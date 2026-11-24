"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/store/desktop-store";
import { useContent } from "./content-context";

export function BootScreen() {
  const { profile } = useContent();
  const setPhase = useDesktop((s) => s.setPhase);
  const [pct, setPct] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const dur = profile.bootSeconds * 1000;
    const t0 = Date.now();
    let done: ReturnType<typeof setTimeout> | undefined;
    timer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / dur);
      setPct(p);
      if (p >= 1) {
        clearInterval(timer.current);
        done = setTimeout(() => {
          if (useDesktop.getState().phase === "boot") setPhase("login");
        }, 350);
      }
    }, 50);
    return () => {
      clearInterval(timer.current);
      clearTimeout(done);
    };
  }, [profile.bootSeconds, setPhase]);

  const msgs = profile.bootMessages;
  const msg = msgs[Math.min(msgs.length - 1, Math.floor(pct * msgs.length))];

  return (
    <div
      data-screen-label="Boot"
      onClick={() => {
        clearInterval(timer.current);
        setPhase("login");
      }}
      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-s4 bg-[color-mix(in_srgb,var(--color-neutral-900)_78%,black)] p-s6 text-neutral-200"
    >
      <img src={profile.logoUrl} alt="Secura Design" className="size-[220px] object-cover mix-blend-lighten" />
      <div className="font-heading text-[36px] font-normal tracking-[-0.01em] text-neutral-100">{profile.name}</div>
      <div className="relative h-0.5 w-[220px] overflow-hidden bg-neutral-800" role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className="absolute inset-y-0 left-0 bg-brand-400" style={{ width: `${Math.round(pct * 100)}%` }} />
      </div>
      <div className="min-h-[1.5em] text-[12px] text-neutral-400" aria-live="polite">
        {msg}
      </div>
      <div className="absolute bottom-s6 text-[11px] uppercase tracking-[0.1em] text-neutral-500">Click anywhere to skip</div>
    </div>
  );
}
