// ── EMAIL NORMALISATION ───────────────────────────────────────
// Gmail ignores dots and everything after a "+" in the local part, so
// tic.k.ettm2.01.9@gmail.com and t.i.ck.ettm201.9@gmail.com are the same
// mailbox. Spammers rotate dot positions to defeat naive dedupe/blocklists.

const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/** Canonical form of an address, for blocklist and rate-limit keys. */
export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 1) return trimmed;

  let local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);

  // Subaddressing (+tag) is honoured by Gmail, Outlook, Fastmail and others.
  const plus = local.indexOf("+");
  if (plus > 0) local = local.slice(0, plus);

  if (GMAIL_DOMAINS.has(domain)) {
    local = local.replace(/\./g, "");
    return `${local}@gmail.com`;
  }

  return `${local}@${domain}`;
}

/**
 * Addresses that are always dropped, compared after normalisation.
 * Seeded with the confirmed repeat offender from the Sept 2026 wave; extend
 * without a redeploy via the CONTACT_BLOCKLIST env var (comma-separated).
 */
const SEED_BLOCKLIST = ["tickettm2019@gmail.com"];

export function isBlocked(email: string): boolean {
  const normalized = normalizeEmail(email);
  const extra = (process.env.CONTACT_BLOCKLIST || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(normalizeEmail);

  return [...SEED_BLOCKLIST, ...extra].includes(normalized);
}
