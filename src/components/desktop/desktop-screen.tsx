"use client";

import { useDesktop, isMobile, TASKBAR_H } from "@/store/desktop-store";
import { Wallpaper } from "./wallpaper";
import { DesktopIcons } from "./desktop-icons";
import { WindowFrame } from "./window-frame";
import { StartMenu } from "./start-menu";
import { Taskbar } from "./taskbar";

export function DesktopScreen() {
  const wins = useDesktop((s) => s.wins);
  const wall = useDesktop((s) => s.wall);
  const walls = useDesktop((s) => s.walls);
  const startOpen = useDesktop((s) => s.startOpen);
  const mobile = useDesktop((s) => isMobile(s.vw));

  const photo = typeof wall === "number" ? walls[wall] : undefined;
  const ranked = [...wins].sort((a, b) => a.z - b.z).map((w) => w.id);

  return (
    <div
      data-screen-label="Desktop"
      className="absolute inset-0"
      style={{
        background: photo
          ? `var(--color-neutral-800) url("${photo}") center / cover no-repeat`
          : "var(--color-background)",
      }}
    >
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ bottom: TASKBAR_H }}>
        <Wallpaper photo={!!photo} />
        <DesktopIcons photo={!!photo} mobile={mobile} />
        {wins.map((w) => (
          <WindowFrame key={w.id} win={w} zIndex={10 + ranked.indexOf(w.id)} mobile={mobile} />
        ))}
      </div>
      {startOpen && <StartMenu mobile={mobile} />}
      <Taskbar />
    </div>
  );
}
