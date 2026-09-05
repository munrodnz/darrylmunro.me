import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { isBlocked, normalizeEmail } from "./_lib/email";
import { checkRateLimits, clientIp } from "./_lib/rate-limit";
import { DROP_THRESHOLD, scoreSubmission, TAG_THRESHOLD } from "./_lib/spam";
import { verifyToken } from "./_lib/token";
import { verifyTurnstile } from "./_lib/turnstile";

// ── INPUT SANITIZATION ────────────────────────────────────────
function sanitize(input: string, maxLength = 5000): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim()
    .slice(0, maxLength);
}

/** As above, but also strips newlines — for values used in mail headers. */
function sanitizeLine(input: string, maxLength = 200): string {
  return sanitize(input.replace(/[\r\n\t]+/g, " "), maxLength);
}

// Mirrors the <select> on the contact page; anything else is a forged POST.
const SUBJECTS: Record<string, string> = {
  general: "General enquiry",
  "fractional-cto": "Fractional CTO / CIO",
  "ea-consulting": "Enterprise Architecture Consulting",
  "nd-coaching": "Neurodiversity Coaching",
  "workplace-nd": "Workplace Neurodiversity Programme",
  speaking: "Speaking / Events",
  other: "Something else",
};

/** Bots are told everything worked, so they do not adapt and retry. */
function silentlyAccept(res: VercelResponse, reason: string, detail?: unknown) {
  console.warn(`Contact form rejected (${reason}):`, detail ?? "");
  return res.status(200).json({ success: true });
}

// ── API HANDLER ───────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message, website, formToken, turnstileToken } = req.body ?? {};

    // ── Layer 1: honeypot ─────────────────────────────────────
    if (website) {
      return silentlyAccept(res, "honeypot");
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid field types" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // ── Layer 2: signed timing token ──────────────────────────
    // A missing or expired token is recoverable: the client fetches a fresh
    // one and retries once. Only a bad signature — which means forgery, since
    // the secret never leaves the server — is treated as a bot.
    const tokenVerdict = verifyToken(formToken);
    if (tokenVerdict === "expired" || tokenVerdict === "missing") {
      return res.status(400).json({ error: `${tokenVerdict}_token` });
    }
    if (tokenVerdict === "too-fast") {
      return silentlyAccept(res, "submitted-too-fast");
    }
    if (tokenVerdict === "invalid") {
      return silentlyAccept(res, "form-token-invalid");
    }

    // ── Layer 3: blocklist (normalised, so dot-variants collapse) ──
    if (isBlocked(email)) {
      return silentlyAccept(res, "blocklisted", normalizeEmail(email));
    }

    // ── Layer 4: rate limiting ────────────────────────────────
    const ip = clientIp(req.headers);
    const { limited, trippedBy } = await checkRateLimits([
      { key: `ip:${ip}:1h`, max: 5, windowSeconds: 60 * 60 },
      { key: `ip:${ip}:24h`, max: 10, windowSeconds: 24 * 60 * 60 },
      { key: `email:${normalizeEmail(email)}:24h`, max: 2, windowSeconds: 24 * 60 * 60 },
    ]);
    if (limited) {
      console.warn(`Contact form rate limited: ${trippedBy}`);
      return res.status(429).json({ error: "Too many messages. Please try again later." });
    }

    // ── Layer 5: Turnstile ────────────────────────────────────
    const turnstileVerdict = await verifyTurnstile(turnstileToken, ip);
    if (turnstileVerdict === "failed") {
      return res.status(403).json({ error: "Verification failed. Please reload and try again." });
    }

    // ── Layer 6: content scoring ──────────────────────────────
    const { score, reasons } = scoreSubmission({ name, email, message });
    if (score >= DROP_THRESHOLD) {
      return silentlyAccept(res, `spam-score-${score}`, reasons.join(", "));
    }
    const suspicious = score >= TAG_THRESHOLD;
    if (suspicious) {
      console.warn(`Contact form tagged as suspicious (${score}):`, reasons.join(", "));
    }

    const safeName = sanitizeLine(name, 200);
    const safeEmail = sanitizeLine(email, 200);
    const safeSubject = SUBJECTS[String(subject)] || "General enquiry";
    const safeMessage = sanitize(message);

    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.MAIL_SENDER || "contact@darrylmunro.me";
    const recipient = process.env.MAIL_RECIPIENT || "daz@darrylmunro.me";

    if (!apiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `${safeName} via darrylmunro.me <${sender}>`,
      to: [recipient],
      replyTo: safeEmail,
      subject: `${suspicious ? "[SPAM?] " : ""}[Contact] ${safeSubject} — ${safeName}`,
      html: `
        <h3>Contact form submission</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        ${suspicious ? `<p><strong>Spam score:</strong> ${score} (${reasons.join(", ")})</p>` : ""}
        <hr />
        <p>${safeMessage.replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
