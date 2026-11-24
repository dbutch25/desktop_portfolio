# Portfolio Desktop

A personal portfolio presented as a retro desktop OS: boot screen → login → desktop with folders, draggable windows, a terminal, taskbar and start menu. Every word, link, project and asset is editable from a built-in CMS at `/admin`.

**Stack:** Next.js 16 (App Router, Turbopack, `proxy.ts`) · TypeScript · PostgreSQL · Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`) · Zustand · shadcn/ui (Tailwind v4, `radix-ui`) · better-auth (+ TOTP 2FA) · Zod 4 · Resend · Cloudinary · Sentry · Vercel.

## Getting started

```bash
npm install
cp .env.example .env            # fill in DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_* at minimum
npx prisma migrate dev --name init
npm run db:seed                 # résumé content + your admin account
npm run dev
```

- Desktop: http://localhost:3000. Add `localStorage.clear()` in devtools to see the boot screen again.
- CMS: http://localhost:3000/admin. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then turn on 2FA under **Security**.

You can run the seed again safely. It fills only empty tables, and it resets the admin password to whatever is in `.env`.

## Project layout

```
proxy.ts                         Optimistic /admin gate (Next 16 replacement for middleware.ts)
prisma/schema.prisma             Content models + better-auth tables
prisma/seed.ts                   Seeds content from src/lib/defaults.ts and creates the admin
src/app/page.tsx                 Static home page (ISR), JSON-LD, crawlable summary
src/app/admin/login              Sign-in (password → TOTP step if enabled)
src/app/admin/(cms)/…            Overview, Profile & settings, Projects, Experience,
                                 Certifications, Skills, Highlights, Messages, Security
src/app/api/auth/[...all]        better-auth handler
src/app/api/cloudinary/sign      Signed direct-to-Cloudinary uploads (admin only)
src/actions/admin.ts             CMS server actions (assertAdmin → zod → Prisma → revalidatePath)
src/actions/contact.ts           Contact form → DB + Resend, honeypot + per-IP rate limit
src/store/desktop-store.ts       Zustand window manager (open/focus/minimise/maximise/drag/resize,
                                 terminal history, wallpaper persistence)
src/components/desktop/…         Boot, login, shut-down, wallpaper, icons, windows, taskbar, start menu
src/components/desktop/apps/…    readme.txt, résumé, explorer, project, work history, certs,
                                 tech stack, mail, terminal, GitHub, settings
src/components/admin/…           Schema-driven RecordForm, CollectionEditor, AssetField, …
src/components/ui/…              shadcn components themed to the design system
src/lib/validation.ts            All zod schemas (public + CMS)
src/app/globals.css              Design tokens → Tailwind v4 theme + shadcn variables
```

## How content flows

1. The home page is statically generated. It reads everything in one go through `getSiteContent()`.
2. Every CMS save calls `revalidatePath("/")`, so changes go live at once without a redeploy.
3. The desktop is a client component tree. It reads content from a React context, and window state lives in Zustand.

## Design tokens

The Classical design system from the handoff lives in `globals.css`:

- **Brand gold:** `brand`, `brand-100` … `brand-900`. It's called `brand` because shadcn uses `accent` for its subtle hover fills.
- **Neutrals:** `neutral-100` … `neutral-900`, plus `surface`, `divider` and `ink`.
- **Spacing:** `p-s1` … `p-s8`, the 4.6 px scale. Shadows are `shadow-ds-sm/md/lg`.
- **Fonts:** Montserrat for headings, Lora for body text, self-hosted via `@fontsource-variable`.
- **Buttons:** outlined only, as in the design. The variants are `default` (gold), `secondary` and `ghost`.

## Services (all optional in development)

| Service | Env | Without it |
| --- | --- | --- |
| **Resend** | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (verified domain), optional `CONTACT_TO_EMAIL` | Messages are still saved and shown under **Messages**, marked "Not emailed". |
| **Cloudinary** | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | You can paste URLs, or use the defaults in `/public/assets`. For the résumé PDF, turn on *Settings → Security → Allow delivery of PDF and ZIP files* in Cloudinary. |
| **GitHub** | `GITHUB_TOKEN` (fine-grained, no extra scopes) | The contribution graph shows the seeded sample pattern. When set, the graph is fetched daily. |
| **Sentry** | `NEXT_PUBLIC_SENTRY_DSN`, plus `SENTRY_ORG`/`PROJECT`/`AUTH_TOKEN` for source maps | Sentry is disabled. Events go through the `/monitoring` tunnel to avoid ad-blockers. |

## Deploying to Vercel

1. Push to GitHub and import the repo into Vercel.
2. Add a Postgres database (Neon via the Vercel Marketplace) and copy the env vars from `.env.example`. Set `BETTER_AUTH_URL` to your production URL.
3. The build command already runs `prisma generate`. Apply migrations with `npx prisma migrate deploy`, either locally against the production URL or as a pre-build step.
4. Run `npm run db:seed` once against production to create your admin account.

## Security notes

- `proxy.ts` is only a fast cookie check. Every admin page calls `requireAdmin()`, and every action or route calls `assertAdmin()`, which also checks `role === "admin"`.
- Public sign-up is disabled. Accounts are created only by the seed.
- Uploads are signed per request and limited to an allow-list of formats. They are also checked client-side by their magic bytes and a 10 MB limit.
- The contact form is protected by zod validation, a honeypot field and a limit of 3 messages per 10 minutes per hashed IP.
- Security headers (HSTS, nosniff, frame-options and others) are set in `next.config.ts`.

## Differences from the prototype

- **Contact window:** it now sends through Resend instead of opening a `mailto:` link. The single "name or email" field is split into name + email so replies work.
- **Project screenshots:** they come from the CMS (Cloudinary). Before one is uploaded, the project shows a "coming soon" plate.
- **GitHub graph:** live data replaces the seeded pattern once `GITHUB_TOKEN` is set.
- **Terminal output:** derived from CMS content, so it stays correct as you edit.
- **Portrait collision rule:** it assumes a 2:3 portrait. Upload one with that ratio for the best fit.
