import "server-only";
import { Resend } from "resend";
import type { ContactInput } from "@/lib/validation";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Returns true if Resend accepted the message. */
export async function sendContactEmail(input: ContactInput, to: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) {
    console.warn("[email] RESEND_API_KEY / CONTACT_FROM_EMAIL not set — message saved to the CMS only.");
    return false;
  }

  const resend = new Resend(key);
  const subject = input.subject || "Hello from your portfolio";
  const { error } = await resend.emails.send({
    from,
    to: process.env.CONTACT_TO_EMAIL || to,
    replyTo: input.email,
    subject: `[Portfolio] ${subject}`,
    text: `${input.body}\n\n— ${input.name} <${input.email}>`,
    html: `<div style="font-family:Georgia,serif;font-size:15px;line-height:1.55;color:#201f1d">
      <p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#7d5411;margin:0 0 12px">New message from the desktop</p>
      <p style="white-space:pre-wrap;margin:0 0 16px">${esc(input.body)}</p>
      <p style="margin:0;color:#605d5d">— ${esc(input.name)} &lt;${esc(input.email)}&gt;</p>
    </div>`,
  });
  if (error) {
    console.error("[email] Resend error", error);
    return false;
  }
  return true;
}
