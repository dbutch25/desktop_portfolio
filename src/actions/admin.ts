"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/session";
import {
  certSchema,
  flatten,
  formToObject,
  highlightSchema,
  profileSchema,
  projectSchema,
  roleSchema,
  skillGroupSchema,
  type ActionState,
} from "@/lib/validation";

/** Re-render the public desktop (and the CMS list) after a content change. */
function refresh(adminPath: string) {
  revalidatePath("/");
  revalidatePath(adminPath);
}

/** Auth → validate → write → revalidate, with uniform error reporting. */
async function mutate<S extends z.ZodType>(
  schema: S,
  fd: FormData,
  adminPath: string,
  write: (data: z.output<S>) => Promise<unknown>,
): Promise<ActionState> {
  await assertAdmin();
  const parsed = schema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, message: "Check the highlighted fields.", errors: flatten(parsed.error) };
  try {
    await write(parsed.data);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") return { ok: false, message: "That value is already in use.", errors: { fileName: ["Already used by another project"] } };
    Sentry.captureException(err);
    return { ok: false, message: "Couldn't save — the error has been logged." };
  }
  refresh(adminPath);
  return { ok: true, message: "Saved." };
}

async function remove(adminPath: string, del: () => Promise<unknown>) {
  await assertAdmin();
  await del();
  refresh(adminPath);
}

// ── Profile ────────────────────────────────────────────────────────────

export async function saveProfile(_prev: ActionState, fd: FormData) {
  return mutate(profileSchema, fd, "/admin/profile", (data) =>
    prisma.siteSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } }),
  );
}

// ── Projects ───────────────────────────────────────────────────────────

export async function saveProject(id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  let createdId: string | null = null;
  const res = await mutate(projectSchema, fd, "/admin/projects", async (data) => {
    if (id) return prisma.project.update({ where: { id }, data });
    createdId = (await prisma.project.create({ data })).id;
  });
  if (res?.ok && createdId) redirect(`/admin/projects/${createdId}?created=1`);
  return res;
}

export async function deleteProject(id: string) {
  await remove("/admin/projects", () => prisma.project.delete({ where: { id } }));
  redirect("/admin/projects");
}

// ── Experience / certifications / skills / highlights ────────────────

export async function saveRole(id: string | null, _prev: ActionState, fd: FormData) {
  return mutate(roleSchema, fd, "/admin/experience", (data) =>
    id ? prisma.role.update({ where: { id }, data }) : prisma.role.create({ data }),
  );
}
export async function deleteRole(id: string) {
  await remove("/admin/experience", () => prisma.role.delete({ where: { id } }));
}

export async function saveCert(id: string | null, _prev: ActionState, fd: FormData) {
  return mutate(certSchema, fd, "/admin/certifications", (data) =>
    id ? prisma.certification.update({ where: { id }, data }) : prisma.certification.create({ data }),
  );
}
export async function deleteCert(id: string) {
  await remove("/admin/certifications", () => prisma.certification.delete({ where: { id } }));
}

export async function saveSkillGroup(id: string | null, _prev: ActionState, fd: FormData) {
  return mutate(skillGroupSchema, fd, "/admin/skills", (data) =>
    id ? prisma.skillGroup.update({ where: { id }, data }) : prisma.skillGroup.create({ data }),
  );
}
export async function deleteSkillGroup(id: string) {
  await remove("/admin/skills", () => prisma.skillGroup.delete({ where: { id } }));
}

export async function saveHighlight(id: string | null, _prev: ActionState, fd: FormData) {
  return mutate(highlightSchema, fd, "/admin/highlights", (data) =>
    id ? prisma.highlight.update({ where: { id }, data }) : prisma.highlight.create({ data }),
  );
}
export async function deleteHighlight(id: string) {
  await remove("/admin/highlights", () => prisma.highlight.delete({ where: { id } }));
}

// ── Messages ───────────────────────────────────────────────────────────

export async function setMessageRead(id: string, read: boolean) {
  await assertAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await assertAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
