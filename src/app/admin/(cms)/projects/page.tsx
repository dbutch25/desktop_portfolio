import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader kicker="Content" title="Projects">
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus /> New project
          </Link>
        </Button>
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p, i) => (
            <TableRow key={p.id}>
              <TableCell className="font-heading text-brand-700 tabular-nums">{String(i + 1).padStart(2, "0")}</TableCell>
              <TableCell>
                <Link href={`/admin/projects/${p.id}`} className="font-heading font-semibold">
                  {p.title}
                </Link>
                <div className="text-[12px] text-neutral-600">{p.client}</div>
              </TableCell>
              <TableCell className="font-mono text-[12px]">{p.fileName}</TableCell>
              <TableCell>{p.draft ? <Badge>Draft</Badge> : <Badge variant="neutral">Published</Badge>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
