import { PageHeader } from "@/components/admin/page-header";
import { SecurityPanel } from "@/components/admin/security-panel";
import { requireAdmin } from "@/lib/session";

export default async function SecurityPage() {
  const session = await requireAdmin();
  return (
    <>
      <PageHeader kicker="Account" title="Security" />
      <SecurityPanel twoFactorEnabled={!!session.user.twoFactorEnabled} />
    </>
  );
}
