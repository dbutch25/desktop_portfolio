"use client";
/* eslint-disable @next/next/no-img-element */

import { useSyncExternalStore } from "react";
import { useDesktop, TASKBAR_H } from "@/store/desktop-store";
import { useContent } from "./content-context";
import { windowTitle } from "./folders";

const TICK = 15000;
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, TICK);
  return () => clearInterval(t);
};

function Clock() {
  // Snapshot changes every 15s; null on the server so there's no hydration mismatch.
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / TICK), () => null);
  const now = tick === null ? null : new Date();
  return (
    <div className="flex flex-none flex-col items-end border-l border-divider px-s2 leading-[1.2] tabular-nums">
      <span className="text-[13px]">{now?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) ?? " "}</span>
      <span className="text-[11px] text-neutral-700">{now?.toLocaleDateString([], { month: "short", day: "numeric" }) ?? " "}</span>
    </div>
  );
}

export function Taskbar() {
  const content = useContent();
  const wins = useDesktop((s) => s.wins);
  const startOpen = useDesktop((s) => s.startOpen);
  const activeId = useDesktop((s) => s.activeId());
  const { toggleStart, taskClick } = useDesktop.getState();

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[9002] flex items-center gap-s2 border-t border-divider bg-surface px-s2"
      style={{ height: TASKBAR_H }}
    >
      <button
        onClick={toggleStart}
        aria-label="Start menu"
        aria-expanded={startOpen}
        className="flex h-[34px] flex-none cursor-pointer items-center gap-2 rounded-md border pr-3 pl-1 font-heading text-[17px] font-semibold text-foreground hover:border-brand"
        style={{
          borderColor: startOpen ? "var(--color-brand)" : "var(--color-divider)",
          background: startOpen ? "color-mix(in srgb, var(--color-brand) 12%, transparent)" : "var(--color-background)",
        }}
      >
        <span className="relative size-[26px] flex-none overflow-hidden rounded-sm">
          <img src={content.profile.logoUrl} alt="" className="absolute max-w-none" style={{ width: 56, height: 56, left: -15, top: -11 }} />
        </span>
        Start
      </button>
      <div className="h-6 w-px flex-none bg-divider" />
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {wins.map((w) => {
          const active = w.id === activeId;
          return (
            <button
              key={w.id}
              onClick={() => taskClick(w.id)}
              className="flex h-[34px] min-w-[90px] flex-[0_1_180px] cursor-pointer items-center rounded-t-sm border-0 border-b-2 px-2.5 text-[13px] text-foreground hover:bg-ink/6"
              style={{
                borderBottomColor: active ? "var(--color-brand)" : "transparent",
                background: active ? "color-mix(in srgb, var(--color-brand) 10%, transparent)" : undefined,
              }}
            >
              <span className="truncate">{windowTitle(w.app, w.arg, content)}</span>
            </button>
          );
        })}
      </div>
      <Clock />
    </div>
  );
}
