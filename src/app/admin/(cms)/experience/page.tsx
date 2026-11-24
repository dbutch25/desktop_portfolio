import { PageHeader } from "@/components/admin/page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { deleteRole, saveRole } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function ExperiencePage() {
  const roles = await prisma.role.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader kicker="Content · work-history.doc" title="Experience" />
      <CollectionEditor
        noun="role"
        items={roles}
        title={(r) => `${r.title} — ${r.org}`}
        save={saveRole}
        remove={deleteRole}
        toDefaults={(r) => ({ period: r.period, title: r.title, org: r.org, place: r.place, bullets: r.bullets.join("\n"), order: r.order })}
        fields={[
          { name: "title", label: "Role", span: 4 },
          { name: "period", label: "Dates", span: 2, placeholder: "08/2022 — Present" },
          { name: "org", label: "Organisation", span: 3 },
          { name: "place", label: "Place", span: 3 },
          { name: "bullets", label: "Bullets", type: "textarea", rows: 4, hint: "One per line." },
          { name: "order", label: "Order", type: "number", span: 2 },
        ]}
      />
    </>
  );
}
