import { PageHeader } from "@/components/admin/page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { deleteCert, saveCert } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function CertificationsPage() {
  const certs = await prisma.certification.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader kicker="Content · certifications.doc" title="Education & certifications" />
      <CollectionEditor
        noun="certification"
        items={certs}
        title={(c) => c.name}
        save={saveCert}
        remove={deleteCert}
        toDefaults={(c) => ({ year: c.year, name: c.name, org: c.org, order: c.order })}
        fields={[
          { name: "name", label: "Name", span: 4 },
          { name: "year", label: "Year", span: 2 },
          { name: "org", label: "Issuer", span: 4 },
          { name: "order", label: "Order", type: "number", span: 2 },
        ]}
      />
    </>
  );
}
