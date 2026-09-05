import type { VercelRequest, VercelResponse } from "@vercel/node";
import { issueToken } from "./_lib/token";

// Issues the short-lived signed timestamp the contact form returns on submit.
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Never cache — a shared token would defeat the timing check.
  res.setHeader("Cache-Control", "no-store, max-age=0");

  return res.status(200).json({ token: issueToken() });
}
