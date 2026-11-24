import { PageHeader } from "@/components/admin/page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { deleteHighlight, saveHighlight } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function HighlightsPage() {
  const items = await prisma.highlight.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader kicker="Content · readme.txt" title="Highlights" />
      <CollectionEditor
        noun="highlight"
        items={items}
        title={(h) => `Highlight ${String(items.indexOf(h) + 1).padStart(2, "0")}`}
        save={saveHighlight}
        remove={deleteHighlight}
        toDefaults={(h) => ({ text: h.text, order: h.order })}
        fields={[
          { name: "text", label: "Text", type: "textarea", rows: 2, span: 4 },
          { name: "order", label: "Order", type: "number", span: 2 },
        ]}
      />
    </>
  );
}
