"use client";

import { ChevronRight, FileCode, FileText, Folder, Link as LinkIcon } from "lucide-react";
import { MailIcon } from "../icons";
import { useDesktop, type FolderId } from "@/store/desktop-store";
import { cn } from "@/lib/utils";
import { useContent } from "../content-context";
import { FOLDER_NAMES, FOLDER_ORDER, folderFiles, type FileKind } from "../folders";
import { useOpenGesture } from "../desktop-icons";

const ICONS: Record<FileKind, React.ReactNode> = {
  text: <FileText className="size-[42px] fill-neutral-100 stroke-neutral-800" strokeWidth={1.1} />,
  code: <FileCode className="size-[42px] fill-brand-100 stroke-brand-600" strokeWidth={1.1} />,
  mail: <MailIcon className="size-[42px] fill-brand-100 stroke-brand-600" strokeWidth={1.1} />,
  link: <LinkIcon className="size-[42px] stroke-neutral-800" strokeWidth={1.1} />,
};

export function ExplorerApp({ winId, folder, mobile }: { winId: string; folder: FolderId; mobile: boolean }) {
  const content = useContent();
  const open = useDesktop((s) => s.open);
  const navigate = useDesktop((s) => s.navigate);
  const gesture = useOpenGesture(mobile);
  const files = folderFiles(folder, content);
  const n = files.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-none items-center gap-s2 border-b border-divider px-s3 py-s2 text-[13px]">
        <span className="text-neutral-700">Desktop</span>
        <ChevronRight className="size-3.5 stroke-neutral-600" strokeWidth={1.5} />
        <span>{FOLDER_NAMES[folder]}</span>
      </div>
      <div className="flex min-h-0 flex-1">
        {!mobile && (
          <div className="flex w-[170px] flex-none flex-col gap-0.5 overflow-auto border-r border-divider p-s2">
            <div className="px-s2 py-s1 text-[10px] uppercase tracking-[0.1em] text-neutral-700">Folders</div>
            {FOLDER_ORDER.map((k) => (
              <button
                key={k}
                onClick={() => navigate(winId, "explorer", k)}
                className={cn(
                  "tint-hover-10 flex cursor-pointer items-center gap-2 rounded-sm border-0 px-s2 py-1.5 text-left text-[13px]",
                  k === folder ? "bg-brand-100 text-brand-800" : "bg-transparent text-foreground",
                )}
              >
                <Folder className="size-[15px] flex-none stroke-brand-600" strokeWidth={1.5} />
                {FOLDER_NAMES[k]}
              </button>
            ))}
          </div>
        )}
        <div className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fill,minmax(112px,1fr))] content-start gap-s2 overflow-auto p-s3">
          {files.map((f) => (
            <button
              key={f.name}
              title={f.name}
              onClick={gesture(() => (f.app ? open(f.app, f.arg) : window.open(f.href, "_blank", "noopener")))}
              className="tint-hover focus:border-brand-300 focus:bg-brand-100 focus-visible:outline-none flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-transparent bg-transparent px-s1 py-s2 text-foreground"
            >
              {ICONS[f.kind]}
              <span className="text-center text-[12px] leading-[1.3] break-words">{f.name}</span>
              <span className="text-[10px] text-neutral-700">{f.meta}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-none border-t border-divider px-s3 py-1.5 text-[11px] text-neutral-700 tabular-nums">
        {n} item{n === 1 ? "" : "s"}
        {mobile ? " · tap to open" : " · double-click to open, as tradition demands"}
      </div>
    </div>
  );
}
