import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "CMS", robots: { index: false, follow: false } };

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const unread = await prisma.contactMessage.count({ where: { read: false } });
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminNav unread={unread} user={{ name: session.user.name, email: session.user.email }} />
      <main className="min-w-0 flex-1 px-s6 py-s6 md:px-s8">
        <div className="mx-auto max-w-[920px]">{children}</div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
