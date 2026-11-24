import { PageHeader } from "@/components/admin/page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { deleteSkillGroup, saveSkillGroup } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function SkillsPage() {
  const groups = await prisma.skillGroup.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader kicker="Content · tech-stack.doc" title="Skills" />
      <CollectionEditor
        noun="skill group"
        items={groups}
        title={(g) => g.name}
        save={saveSkillGroup}
        remove={deleteSkillGroup}
        toDefaults={(g) => ({ name: g.name, items: g.items.join("\n"), order: g.order })}
        fields={[
          { name: "name", label: "Category", span: 4 },
          { name: "order", label: "Order", type: "number", span: 2 },
          { name: "items", label: "Skills", type: "textarea", rows: 5, hint: "One per line (or comma-separated)." },
        ]}
      />
    </>
  );
}
