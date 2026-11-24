"use client";

import { Briefcase, Code, FileText, Folder, LogOut, Mail, Power, Settings2, SquareTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesktop } from "@/store/desktop-store";
import { useContent } from "./content-context";
import { Avatar } from "./avatar";
import { GithubIcon } from "./icons";

function Item({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="tint-hover-10 flex cursor-pointer items-center gap-2.5 rounded-sm border-0 bg-transparent px-s2 py-2 text-left text-[14px] text-foreground"
    >
      {icon}
      {label}
    </button>
  );
}

export function StartMenu({ mobile }: { mobile: boolean }) {
  const { profile } = useContent();
  const { open, closeStart, logOff, shutDown } = useDesktop.getState();
  const gold = "size-[18px] flex-none stroke-brand-600";
  const ink = "size-[18px] flex-none stroke-neutral-800";

  return (
    <>
      <div className="absolute inset-0 z-[9000]" onClick={closeStart} />
      <div
        role="menu"
        className="absolute bottom-[52px] left-2 z-[9001] flex flex-col overflow-hidden rounded-md border border-divider bg-background shadow-ds-lg"
        style={{ width: mobile ? "calc(100% - 16px)" : 440 }}
      >
        <div className="flex items-center gap-s3 border-b border-divider px-s4 py-s3">
          <Avatar src={profile.portraitUrl} alt={profile.name} size={44} />
          <div>
            <div className="font-heading text-[20px] leading-[1.1] font-semibold">{profile.name}</div>
            <div className="text-[12px] text-neutral-700">
              {profile.title} · {profile.location}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-0.5 border-r border-divider p-s2">
            <div className="px-s2 py-s1 text-[10px] uppercase tracking-[0.1em] text-neutral-700">Portfolio</div>
            <Item icon={<FileText className={gold} strokeWidth={1.5} />} label="About me" onClick={() => open("about")} />
            <Item icon={<FileText className={gold} strokeWidth={1.5} />} label="Résumé" onClick={() => open("resume")} />
            <Item icon={<Folder className={gold} strokeWidth={1.5} />} label="Projects" onClick={() => open("explorer", "projects")} />
            <Item icon={<Briefcase className={gold} strokeWidth={1.5} />} label="Experience" onClick={() => open("experience")} />
            <Item icon={<Code className={gold} strokeWidth={1.5} />} label="Skills" onClick={() => open("skills")} />
            <Item icon={<Mail className={gold} strokeWidth={1.5} />} label="Contact" onClick={() => open("mail")} />
          </div>
          <div className="flex flex-col gap-0.5 bg-[color-mix(in_srgb,var(--color-surface)_60%,transparent)] p-s2">
            <div className="px-s2 py-s1 text-[10px] uppercase tracking-[0.1em] text-neutral-700">Programs</div>
            <Item icon={<SquareTerminal className={ink} strokeWidth={1.5} />} label="Terminal" onClick={() => open("terminal")} />
            <Item icon={<GithubIcon className={ink} strokeWidth={1.5} />} label="GitHub activity" onClick={() => open("github")} />
            <Item icon={<Settings2 className={ink} strokeWidth={1.5} />} label="Settings" onClick={() => open("settings")} />
          </div>
        </div>
        <div className="flex justify-end gap-s2 border-t border-divider px-s3 py-s2">
          <Button variant="secondary" onClick={logOff}>
            <LogOut strokeWidth={1.5} />
            Log off
          </Button>
          <Button onClick={shutDown}>
            <Power strokeWidth={1.5} />
            Shut down
          </Button>
        </div>
      </div>
    </>
  );
}
