import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/session";
import { signUploadParams } from "@/lib/cloudinary";

const bodySchema = z.object({ kind: z.enum(["image", "pdf"]) });

export async function POST(req: Request) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp,
    folder: process.env.CLOUDINARY_FOLDER ?? "portfolio-desktop",
    // Cloudinary rejects anything that isn't one of these, so a renamed .exe can't slip through.
    allowed_formats: parsed.data.kind === "pdf" ? "pdf" : "jpg,jpeg,png,webp,avif,gif",
  };

  try {
    const { signature, apiKey, cloudName } = signUploadParams(params);
    return NextResponse.json({ ...params, signature, apiKey, cloudName });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
