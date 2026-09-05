// ── SIGNED FORM TOKEN ─────────────────────────────────────────
// The contact page is statically generated, so it cannot carry a per-request
// nonce. Instead the client fetches a short-lived HMAC-signed timestamp on
// load and returns it on submit, letting us reject submissions that arrive
// implausibly fast (scripted POSTs) without trusting a client-supplied clock.

import { createHmac, timingSafeEqual } from "node:crypto";

/** A human cannot read the page, type a name, email and message this fast. */
export const MIN_AGE_MS = 3_000;
/** Generous, so a page left open in a tab still works; the client refetches. */
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export type TokenVerdict = "valid" | "missing" | "invalid" | "expired" | "too-fast";

function secret(): string | undefined {
  return process.env.FORM_TOKEN_SECRET;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function issueToken(): string | null {
  const key = secret();
  if (!key) return null;

  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt, key)}`;
}

export function verifyToken(token: unknown): TokenVerdict {
  const key = secret();
  // Not configured — treat as disabled rather than rejecting every submission.
  if (!key) return "valid";

  if (typeof token !== "string" || !token) return "missing";

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return "invalid";

  const expected = sign(issuedAt, key);
  // Plain Uint8Array rather than Buffer, which timingSafeEqual's types reject.
  const received = Uint8Array.from(Buffer.from(signature));
  const computed = Uint8Array.from(Buffer.from(expected));
  if (received.length !== computed.length) return "invalid";
  if (!timingSafeEqual(received, computed)) return "invalid";

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age)) return "invalid";
  if (age > MAX_AGE_MS) return "expired";
  // A negative age means a forged or clock-skewed timestamp from the future.
  if (age < MIN_AGE_MS) return "too-fast";

  return "valid";
}
