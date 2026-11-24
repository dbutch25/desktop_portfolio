"use client";

import { Button } from "@/components/ui/button";
import { useDesktop } from "@/store/desktop-store";
import { useContent } from "./content-context";

export function OffScreen() {
  const { profile } = useContent();
  const restart = useDesktop((s) => s.restart);
  return (
    <div
      data-screen-label="Shut down"
      className="absolute inset-0 flex flex-col items-start justify-center gap-s4 bg-[color-mix(in_srgb,var(--color-neutral-900)_78%,black)] py-s8 text-neutral-200"
      style={{ paddingInline: "max(27.6px, 10vw)" }}
    >
      <div className="text-[11px] uppercase tracking-[0.1em] text-neutral-500">Session ended</div>
      <h1 className="m-0 max-w-[14ch] text-[56px] leading-[1.05] font-normal text-neutral-100">It’s now safe to close this tab.</h1>
      <p className="m-0 text-neutral-400">
        Thanks for stopping by. The inbox stays open:{" "}
        <a href={`mailto:${profile.email}`} className="text-brand-300 hover:text-brand-200">
          {profile.email}
        </a>
      </p>
      <Button onClick={restart} className="border-brand-400 text-brand-400 hover:text-brand-400">
        Restart
      </Button>
    </div>
  );
}
