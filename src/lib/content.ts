import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { figuresSchema } from "@/lib/validation";
import { getContributions } from "@/lib/github";
import { DEFAULT_PROFILE } from "@/lib/defaults";
import type { ProfileContent, SiteContent } from "@/types/content";

const byOrder = { orderBy: [{ order: "asc" as const }, { createdAt: "asc" as const }] };

/**
 * Everything the desktop needs, in one round-trip.
 * The home page is statically rendered; CMS mutations call revalidatePath("/").
 */
export const getSiteContent = cache(async function getSiteContent(): Promise<SiteContent> {
  const [settings, highlights, projects, roles, certs, skills] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.highlight.findMany(byOrder),
    prisma.project.findMany(byOrder),
    prisma.role.findMany(byOrder),
    prisma.certification.findMany(byOrder),
    prisma.skillGroup.findMany(byOrder),
  ]);

  let profile: ProfileContent = DEFAULT_PROFILE;
  if (settings) {
    const { id: _id, updatedAt: _u, ...rest } = settings;
    profile = {
      ...rest,
      openOnLogin: (["none", "about", "projects"] as const).includes(rest.openOnLogin as "none")
        ? (rest.openOnLogin as ProfileContent["openOnLogin"])
        : "none",
    };
  }

  const contributions = await getContributions(profile.githubUsername);

  return {
    profile,
    highlights: highlights.map((h) => h.text),
    projects: projects.map((p) => ({
      id: p.id,
      fileName: p.fileName,
      title: p.title,
      client: p.client,
      summary: p.summary,
      url: p.url,
      stack: p.stack,
      figures: figuresSchema.catch([]).parse(p.figures),
      bullets: p.bullets,
      screenshotUrl: p.screenshotUrl,
      draft: p.draft,
    })),
    roles: roles.map(({ id, period, title, org, place, bullets }) => ({ id, period, title, org, place, bullets })),
    certs: certs.map(({ id, year, name, org }) => ({ id, year, name, org })),
    skills: skills.map(({ id, name, items }) => ({ id, name, items })),
    contributions,
  };
});
