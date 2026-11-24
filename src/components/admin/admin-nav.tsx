"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  Briefcase,
  Code,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile & settings", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/highlights", label: "Highlights", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/security", label: "Security", icon: ShieldCheck },
];

export function AdminNav({ unread, user }: { unread: number; user: { name: string; email: string } }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className="flex flex-col gap-s4 border-divider bg-surface p-s3 md:sticky md:top-0 md:h-dvh md:w-[240px] md:flex-none md:border-r">
      <div className="px-s2 pt-s2">
        <div className="font-heading text-[18px] font-semibold">Portfolio CMS</div>
        <div className="truncate text-[12px] text-neutral-700">{user.email}</div>
      </div>
      <nav className="flex flex-row flex-wrap gap-0.5 md:flex-col">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-sm px-s2 py-2 text-[14px] text-foreground no-underline hover:bg-brand/10 hover:text-foreground",
                active && "bg-brand-100 text-brand-800 hover:bg-brand-100 hover:text-brand-800",
              )}
            >
              <Icon className="size-[17px] stroke-brand-600" strokeWidth={1.5} />
              {label}
              {href === "/admin/messages" && unread > 0 && (
                <span className="ml-auto rounded-full bg-brand px-1.5 text-[11px] text-white tabular-nums">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-0.5 border-t border-divider pt-s2">
        <a href="/" target="_blank" className="flex items-center gap-2.5 rounded-sm px-s2 py-2 text-[14px] text-foreground no-underline hover:bg-brand/10">
          <ExternalLink className="size-[17px] stroke-neutral-700" strokeWidth={1.5} />
          View site
        </a>
        <button
          onClick={async () => {
            await authClient.signOut();
            router.push("/admin/login");
            router.refresh();
          }}
          className="flex cursor-pointer items-center gap-2.5 rounded-sm px-s2 py-2 text-left text-[14px] hover:bg-brand/10"
        >
          <LogOut className="size-[17px] stroke-neutral-700" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
