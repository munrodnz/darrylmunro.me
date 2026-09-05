// ── CLOUDFLARE TURNSTILE ──────────────────────────────────────
// https://developers.cloudflare.com/turnstile/

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileVerdict = "valid" | "disabled" | "failed";

export async function verifyTurnstile(
  token: unknown,
  remoteIp?: string
): Promise<TurnstileVerdict> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Lets the form keep working before the Cloudflare keys are configured.
  if (!secret) return "disabled";

  if (typeof token !== "string" || !token) return "failed";

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!result.success) {
      console.warn("Turnstile rejected token:", result["error-codes"]);
      return "failed";
    }

    return "valid";
  } catch (err) {
    console.error("Turnstile verification error:", err);
    // Fail closed: an unverifiable challenge is the whole point of the wall.
    return "failed";
  }
}
