import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm } from "@/components/admin/record-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject, saveProject } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { figuresSchema } from "@/lib/validation";
import { PROJECT_FIELDS } from "../fields";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.project.findUnique({ where: { id } });
  if (!p) notFound();

  const figures = figuresSchema.catch([]).parse(p.figures);
  return (
    <>
      <PageHeader kicker={`Projects · ${p.fileName}`} title={p.title}>
        <DeleteButton action={deleteProject.bind(null, p.id)} label="Delete project" confirmText={`Delete “${p.title}”? This can't be undone.`} />
      </PageHeader>
      <Card>
        <RecordForm
          fields={PROJECT_FIELDS}
          action={saveProject.bind(null, p.id)}
          defaults={{
            title: p.title,
            fileName: p.fileName,
            client: p.client,
            url: p.url,
            summary: p.summary,
            screenshotUrl: p.screenshotUrl,
            order: p.order,
            draft: p.draft,
            stack: p.stack.join("\n"),
            bullets: p.bullets.join("\n"),
            figures: figures.map((f) => `${f.value} | ${f.label}`).join("\n"),
          }}
        />
      </Card>
    </>
  );
}
