import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

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

// ── API HANDLER ───────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message, website } = req.body;

    // Honeypot — bots fill hidden fields, humans don't
    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const safeName = sanitize(name, 200);
    const safeEmail = sanitize(email, 200);
    const safeSubject = sanitize(subject || "General enquiry", 200);
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
      subject: `[Contact] ${safeSubject} — ${safeName}`,
      html: `
        <h3>Contact form submission</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
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
