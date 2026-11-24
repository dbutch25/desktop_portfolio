"use client";

import { Folder, Settings } from "lucide-react";
import type { ReactNode, MouseEvent } from "react";
import { useDesktop, type FolderId } from "@/store/desktop-store";
import { GithubIcon, TerminalIcon } from "./icons";
import { FOLDER_NAMES, FOLDER_ORDER } from "./folders";

/** Double-click opens (as tradition demands); single tap on mobile; Enter/Space via keyboard (detail 0). */
export function useOpenGesture(mobile: boolean) {
  return (fn: () => void) => (e: MouseEvent) => {
    if (mobile || e.detail !== 1) fn();
  };
}

export function DesktopIcons({ photo, mobile }: { photo: boolean; mobile: boolean }) {
  const open = useDesktop((s) => s.open);
  const gesture = useOpenGesture(mobile);
  const labelBg = photo ? "color-mix(in srgb, var(--color-background) 88%, transparent)" : "transparent";

  const folder = (
    <Folder className="size-11 fill-brand-100 stroke-brand-600" strokeWidth={1.1} strokeLinecap="butt" />
  );
  const items: { key: string; label: string; icon: ReactNode; onOpen: () => void }[] = [
    ...FOLDER_ORDER.map((f: FolderId) => ({
      key: f,
      label: FOLDER_NAMES[f],
      icon: folder,
      onOpen: () => open("explorer", f),
    })),
    {
      key: "terminal",
      label: "Terminal",
      icon: <TerminalIcon className="size-11 fill-neutral-100 stroke-neutral-800" strokeWidth={1.1} />,
      onOpen: () => open("terminal"),
    },
    {
      key: "github",
      label: "GitHub",
      icon: <GithubIcon className="size-11 stroke-neutral-800" strokeWidth={1.1} />,
      onOpen: () => open("github"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="size-11 fill-neutral-100 stroke-neutral-800" strokeWidth={1.1} />,
      onOpen: () => open("settings"),
    },
  ];

  return (
    <nav
      aria-label="Desktop"
      className="absolute top-s3 bottom-s3 left-s3 grid content-start gap-1"
      style={
        mobile
          ? { right: 13.8, gridAutoFlow: "row", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }
          : { gridAutoFlow: "column", gridTemplateRows: "repeat(auto-fill, 100px)", gridAutoColumns: 92 }
      }
    >
      {items.map((it) => (
        <button
          key={it.key}
          onClick={gesture(it.onOpen)}
          className="tint-hover focus:border-brand-300 focus:bg-brand-100 focus-visible:outline-none flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-md border border-transparent bg-transparent px-1 py-2 text-foreground"
        >
          {it.icon}
          <span className="rounded-[2px] px-[5px] py-px text-center text-[12px] leading-[1.3]" style={{ background: labelBg }}>
            {it.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
