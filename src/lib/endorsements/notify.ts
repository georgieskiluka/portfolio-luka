import "server-only";

import type { EndorsementInput } from "./rules";

const NOTIFY_TO = "luka.georgieski@gmail.com";
// Resend's shared sender; it can deliver to the address that owns the Resend account.
const NOTIFY_FROM = "Portfolio <onboarding@resend.dev>";

function adminUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}/admin` : "http://localhost:3000/admin";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Emails Luka about a new submission. A failed email never loses the submission. */
export async function notifyNewEndorsement(endorsement: EndorsementInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping the endorsement email");
    return;
  }

  const { quote, name, role, rating } = endorsement;
  const link = adminUrl();
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const summary = `${name} (${role}) wants to leave an endorsement.`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        subject: `${name} wants to leave an endorsement`,
        text: `${summary}\n\n${stars}\n"${quote}"\n\nGo to your page: ${link}`,
        html: `<div style="font-family:Georgia,serif;color:#000068;max-width:520px">
  <p style="font-size:18px"><strong>${escapeHtml(name)}</strong> (${escapeHtml(role)}) wants to leave an endorsement.</p>
  <p style="font-size:18px">${stars}</p>
  <blockquote style="margin:0;padding:12px 16px;background:#FBF8F0;font-size:18px">“${escapeHtml(quote)}”</blockquote>
  <p style="margin-top:24px"><a href="${link}" style="background:#000068;color:#F5EFE0;padding:12px 20px;text-decoration:none">Go to your page</a></p>
</div>`,
      }),
    });
    if (!response.ok) {
      console.error(
        "Resend rejected the endorsement email",
        response.status,
        await response.text()
      );
    }
  } catch (error) {
    console.error("Could not send the endorsement email", error);
  }
}
