/**
 * Seeds the CMS with the résumé content from the design handoff and creates
 * the first admin account. Safe to re-run: content is only inserted into empty
 * tables, and the admin's password is updated if the user already exists.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  DEFAULT_CERTS,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_ROLES,
  DEFAULT_SKILLS,
} from "../src/lib/defaults";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function seedContent() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...DEFAULT_PROFILE },
  });

  if ((await prisma.highlight.count()) === 0)
    await prisma.highlight.createMany({ data: DEFAULT_HIGHLIGHTS.map((text, order) => ({ text, order })) });

  if ((await prisma.project.count()) === 0)
    await prisma.project.createMany({ data: DEFAULT_PROJECTS.map((p, order) => ({ ...p, order })) });

  if ((await prisma.role.count()) === 0)
    await prisma.role.createMany({ data: DEFAULT_ROLES.map((r, order) => ({ ...r, order })) });

  if ((await prisma.certification.count()) === 0)
    await prisma.certification.createMany({ data: DEFAULT_CERTS.map((c, order) => ({ ...c, order })) });

  if ((await prisma.skillGroup.count()) === 0)
    await prisma.skillGroup.createMany({ data: DEFAULT_SKILLS.map((s, order) => ({ ...s, order })) });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";
  if (!email || !password) {
    console.warn("⚠  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user.");
    return;
  }
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  const hash = await hashPassword(password);
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { role: "admin" } });
    await prisma.account.updateMany({
      where: { userId: existing.id, providerId: "credential" },
      data: { password: hash },
    });
    console.log(`✓ Admin ${email} updated`);
    return;
  }

  const id = randomUUID();
  await prisma.user.create({
    data: {
      id,
      email,
      name,
      role: "admin",
      emailVerified: true,
      accounts: { create: { id: randomUUID(), accountId: id, providerId: "credential", password: hash } },
    },
  });
  console.log(`✓ Admin ${email} created`);
}

async function main() {
  await seedContent();
  console.log("✓ Content seeded");
  await seedAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
