"use client";
/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { useDesktop, isMobile, TASKBAR_H } from "@/store/desktop-store";
import { useContent } from "./content-context";

const ICON_COUNT = 9;

/** The "Portrait" wallpaper with the hero block, or the name signature on other wallpapers. */
export function Wallpaper({ photo }: { photo: boolean }) {
  const { profile } = useContent();
  const wall = useDesktop((s) => s.wall);
  const vw = useDesktop((s) => s.vw);
  const vh = useDesktop((s) => s.vh);
  const open = useDesktop((s) => s.open);
  const mobile = isMobile(vw);

  if (wall !== "portrait") {
    if (mobile) return null;
    return (
      <div
        className="pointer-events-none absolute right-s6 bottom-s4 rounded-sm px-2.5 py-1 text-right"
        style={{ background: photo ? "color-mix(in srgb, var(--color-background) 88%, transparent)" : "transparent" }}
      >
        <div className="font-heading text-[24px] leading-[1.1] font-normal">{profile.name}</div>
        <div className="text-[12px] text-neutral-700">
          {profile.title} · {profile.location}
        </div>
      </div>
    );
  }

  // Collision rule from the handoff: keep the about block clear of the face.
  const iconRows = Math.max(1, Math.floor((vh - TASKBAR_H - 24) / 104));
  const iconCols = Math.ceil(ICON_COUNT / iconRows);
  const aLeft = 12 + iconCols * 96 + 40;
  const imgW = (vh - TASKBAR_H) * (2 / 3);
  let shift = 0;
  let avail = vw - imgW + imgW * 0.22 - aLeft - 24;
  if (avail < 340) {
    shift = Math.min(imgW * 0.2, 340 - avail);
    avail += shift;
  }
  const maxW = Math.max(180, Math.min(480, Math.floor(avail)));
  const compact = maxW < 330;
  const nameSize = mobile ? 40 : Math.round(Math.max(32, Math.min(72, maxW / 8.8)));

  const fade = "linear-gradient(to right, transparent 0%, black 38%), linear-gradient(to top, transparent 0%, black 14%)";
  const gridLine = "color-mix(in srgb, var(--color-neutral-900) 7%, transparent)";
  const gridMask = "radial-gradient(ellipse 34% 52% at 70% 46%, transparent 40%, black 100%)";

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(90deg, var(--color-background) 0%, var(--color-background) 38%, var(--color-neutral-200) 100%)" }}
      />
      <img
        src={profile.portraitUrl}
        alt={`Portrait of ${profile.name}`}
        draggable={false}
        className="pointer-events-none absolute bottom-0 w-auto max-w-none select-none"
        style={{
          right: mobile ? "-12%" : -Math.round(shift),
          height: mobile ? "52%" : "100%",
          opacity: mobile ? 0.55 : 1,
          WebkitMaskImage: fade,
          WebkitMaskComposite: "source-in",
          maskImage: fade,
          maskComposite: "intersect",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          WebkitMaskImage: gridMask,
          maskImage: gridMask,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-brand) 30%, var(--color-brand) 70%, transparent)" }}
      />
      <div
        className="absolute flex flex-col gap-s3"
        style={
          mobile
            ? { left: 18.4, right: 18.4, bottom: 27.6, maxWidth: 480 }
            : { left: aLeft, top: "50%", transform: "translateY(-50%)", maxWidth: maxW }
        }
      >
        <div className={mobile ? "hidden" : "kicker flex items-center gap-s2 tracking-[0.12em]"}>
          <span className="h-px w-7 bg-brand" />
          {profile.coordinates}
        </div>
        <h1 className="m-0 leading-none font-medium tracking-[-0.02em]" style={{ fontSize: nameSize }}>
          {profile.name}
        </h1>
        {!mobile && <p className="m-0 text-[21px] leading-[1.35] text-neutral-800 italic">{profile.tagline}</p>}
        {!mobile && !compact && <p className="m-0 max-w-[44ch] text-[15px] text-pretty">{profile.heroBody}</p>}
        {!mobile && (
          <div className={compact ? "mt-s2 flex flex-col flex-wrap items-start gap-s2" : "mt-s2 flex flex-row flex-wrap gap-s2"}>
            <Button onClick={() => open("resume")}>Open résumé</Button>
            <Button variant="secondary" onClick={() => open("explorer", "projects")}>
              Browse projects
            </Button>
            <Button variant="ghost" onClick={() => open("about")}>
              Read more
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
