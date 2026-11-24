"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { contactSchema, flatten, type ActionState } from "@/lib/validation";
import { DEFAULT_PROFILE } from "@/lib/defaults";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

export async function sendContactMessage(input: unknown): Promise<ActionState> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Check the highlighted fields.", errors: flatten(parsed.error) };

  // Honeypot filled → pretend it worked.
  if (parsed.data.company) return { ok: true, message: "Sent." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256")
    .update(ip + (process.env.BETTER_AUTH_SECRET ?? ""))
    .digest("hex")
    .slice(0, 32);

  const recent = await prisma.contactMessage.count({
    where: { ipHash, createdAt: { gt: new Date(Date.now() - WINDOW_MS) } },
  });
  if (recent >= MAX_PER_WINDOW)
    return { ok: false, message: "That's a few messages in a row — try again in a little while." };

  try {
    const { company: _c, ...data } = parsed.data;
    const msg = await prisma.contactMessage.create({ data: { ...data, ipHash } });
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 }, select: { email: true } });
    const emailed = await sendContactEmail(parsed.data, settings?.email ?? DEFAULT_PROFILE.email);
    if (emailed) await prisma.contactMessage.update({ where: { id: msg.id }, data: { emailed: true } });
    return { ok: true, message: "Sent — Daniel will reply to " + parsed.data.email + "." };
  } catch (err) {
    Sentry.captureException(err);
    return { ok: false, message: "Something went wrong sending that. Email directly instead?" };
  }
}
