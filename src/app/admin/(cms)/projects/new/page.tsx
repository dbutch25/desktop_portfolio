import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm } from "@/components/admin/record-form";
import { saveProject } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { PROJECT_FIELDS } from "../fields";

export default async function NewProjectPage() {
  const agg = await prisma.project.aggregate({ _max: { order: true } });
  return (
    <>
      <PageHeader kicker="Projects" title="New project" />
      <Card>
        <RecordForm
          fields={PROJECT_FIELDS}
          action={saveProject.bind(null, null)}
          defaults={{ draft: true, order: (agg._max.order ?? -1) + 1 }}
          submitLabel="Create project"
        />
      </Card>
    </>
  );
}
