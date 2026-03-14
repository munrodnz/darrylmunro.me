import type { APIRoute } from "astro";

// ── INPUT SANITIZATION ────────────────────────────────────────
// Strip HTML tags and limit length to prevent injection/abuse.
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

// ── OAUTH TOKEN ───────────────────────────────────────────────
const getAccessToken = async (): Promise<string> => {
  const tenantId = import.meta.env.AZURE_TENANT_ID;
  const clientId = import.meta.env.AZURE_CLIENT_ID;
  const clientSecret = import.meta.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Azure credentials not configured");
  }

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Failed to acquire access token");
  }
  return data.access_token;
};

// ── API HANDLER ───────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot — bots fill hidden fields, humans don't.
    // Return 200 so bots think it succeeded.
    if (website) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), { status: 400 });
    }

    const safeName = sanitize(name, 200);
    const safeEmail = sanitize(email, 200);
    const safeSubject = sanitize(subject || "General enquiry", 200);
    const safeMessage = sanitize(message);

    const sender = import.meta.env.MAIL_SENDER;
    const recipient = import.meta.env.MAIL_RECIPIENT;

    if (!sender || !recipient) {
      throw new Error("Mail sender/recipient not configured");
    }

    const token = await getAccessToken();

    const graphRes = await fetch(`https://graph.microsoft.com/v1.0/users/${sender}/sendMail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `[Contact] ${safeSubject} — ${safeName}`,
          body: {
            contentType: "HTML",
            content: `
                <h3>Contact form submission</h3>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Subject:</strong> ${safeSubject}</p>
                <hr />
                <p>${safeMessage.replace(/\n/g, "<br/>")}</p>
              `,
          },
          toRecipients: [{ emailAddress: { address: recipient } }],
          replyTo: [{ emailAddress: { address: safeEmail, name: safeName } }],
        },
      }),
    });

    if (!graphRes.ok) {
      const err = await graphRes.json();
      console.error("Graph API error:", err);
      return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const prerender = false;
