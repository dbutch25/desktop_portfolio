import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function Overview() {
  const [projects, drafts, roles, skills, unread, recent] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { draft: true } }),
    prisma.role.count(),
    prisma.skillGroup.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { n: projects, label: "projects", sub: `${drafts} draft${drafts === 1 ? "" : "s"}`, href: "/admin/projects" },
    { n: roles, label: "roles", sub: "work history", href: "/admin/experience" },
    { n: skills, label: "skill groups", sub: "tech stack", href: "/admin/skills" },
    { n: unread, label: "unread", sub: "messages", href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader kicker="Portfolio CMS" title="Overview">
        <Button asChild>
          <a href="/" target="_blank">
            Open the desktop
          </a>
        </Button>
      </PageHeader>
      <div className="grid grid-cols-2 gap-s3 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="text-foreground no-underline hover:text-foreground">
            <Card className="h-full hover:border-brand">
              <div className="font-heading text-[42px] leading-none tabular-nums">{s.n}</div>
              <div className="text-[13px]">
                {s.label}
                <span className="block text-[12px] text-neutral-600">{s.sub}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="mt-s6">
        <CardHeader>
          <CardTitle>Latest messages</CardTitle>
          <CardDescription>From the New message window on the desktop.</CardDescription>
        </CardHeader>
        {recent.length === 0 ? (
          <p className="m-0 text-[14px] text-neutral-700">Nothing yet.</p>
        ) : (
          recent.map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages#${m.id}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-s2 border-t border-divider pt-s2 text-[14px] text-foreground no-underline hover:text-brand-700"
            >
              <span className="truncate">
                {!m.read && <span className="mr-2 inline-block size-2 rounded-full bg-brand" />}
                <strong className="font-semibold">{m.name}</strong> — {m.subject || m.body.slice(0, 80)}
              </span>
              <span className="text-[12px] text-neutral-600 tabular-nums">{m.createdAt.toLocaleDateString("en-CA")}</span>
            </Link>
          ))
        )}
      </Card>
    </>
  );
}
