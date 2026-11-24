import { z } from "zod";

/** Splits a textarea into trimmed, non-empty lines. */
export const lines = z
  .string()
  .default("")
  .transform((s) =>
    s
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  );

/** "" → null, otherwise a valid absolute http(s) URL. */
const optionalUrl = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : s))
  .pipe(z.url({ protocol: /^https?$/ }).nullable());

/** Asset references can be site-relative ("/assets/x.jpg") or absolute (Cloudinary). */
const assetUrl = z
  .string()
  .trim()
  .min(1, "Required")
  .refine((s) => s.startsWith("/") || /^https:\/\//.test(s), "Use /path or an https:// URL");

const required = (max = 200) => z.string().trim().min(1, "Required").max(max);
const order = z.coerce.number().int().min(0).max(9999).default(0);
const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const figureSchema = z.object({ value: z.string().min(1).max(12), label: z.string().min(1).max(80) });
export const figuresSchema = z.array(figureSchema);

/** Figures textarea: one per line as "value | label". */
const figuresText = lines.transform((rows, ctx) =>
  rows.flatMap((row) => {
    const [value, ...rest] = row.split("|");
    const parsed = figureSchema.safeParse({ value: value?.trim(), label: rest.join("|").trim() });
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", message: `Use "value | label" — couldn't read "${row}"` });
      return [];
    }
    return [parsed.data];
  }),
);

// ── Public ─────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: required(100),
  email: z.email("Enter a valid email so Daniel can reply").max(200),
  subject: z.string().trim().max(150).default(""),
  body: z.string().trim().min(10, "A few more words, please").max(5000),
  /** Honeypot — real people never see this field. */
  company: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

// ── CMS ────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  name: required(),
  title: required(),
  location: required(),
  coordinates: required(),
  tagline: required(),
  heroBody: required(600),
  aboutSubtitle: required(),
  aboutBody: z.string().default("").transform((s) =>
    s
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  ),
  skillsIntro: required(400),
  email: z.email(),
  phone: z.string().trim().max(40).transform((s) => s || null),
  siteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  githubUsername: z
    .string()
    .trim()
    .max(39)
    .regex(/^[a-zA-Z0-9-]*$/, "Letters, numbers and dashes only")
    .transform((s) => s || null),
  portraitUrl: assetUrl,
  logoUrl: assetUrl,
  resumeUrl: assetUrl,
  resumePages: z.coerce.number().int().min(1).max(20),
  bootMessages: lines.pipe(z.array(z.string().max(60)).min(1, "Add at least one boot message")),
  bootSeconds: z.coerce.number().min(1).max(6),
  openOnLogin: z.enum(["none", "about", "projects"]),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const projectSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "Required")
    .max(60)
    .regex(/^[a-z0-9][a-z0-9._-]*$/, "Lowercase letters, numbers, dots and dashes (e.g. skincan.proj)"),
  title: required(),
  client: required(),
  summary: required(400),
  url: optionalUrl,
  stack: lines,
  figures: figuresText,
  bullets: lines,
  screenshotUrl: z
    .string()
    .trim()
    .transform((s) => s || null)
    .pipe(z.url({ protocol: /^https$/ }).nullable()),
  draft: checkbox,
  order,
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const roleSchema = z.object({
  period: required(60),
  title: required(),
  org: required(),
  place: required(),
  bullets: lines,
  order,
});

export const certSchema = z.object({
  year: required(10),
  name: required(),
  org: required(),
  order,
});

export const skillGroupSchema = z.object({
  name: required(80),
  items: z
    .string()
    .default("")
    .transform((s) =>
      s
        .split(/[\n,]/)
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  order,
});

export const highlightSchema = z.object({ text: required(400), order });

/** FormData → plain object (last value wins; checkboxes absent = undefined). */
export function formToObject(fd: FormData) {
  const out: Record<string, string> = {};
  fd.forEach((v, k) => {
    if (typeof v === "string" && !k.startsWith("$ACTION")) out[k] = v;
  });
  return out;
}

export type FieldErrors = Record<string, string[] | undefined>;
export type ActionState = { ok: boolean; message?: string; errors?: FieldErrors } | null;

export function flatten(err: z.ZodError): FieldErrors {
  return z.flattenError(err).fieldErrors as FieldErrors;
}
