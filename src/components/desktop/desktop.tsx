"use client";

import { useEffect } from "react";
import { useDesktop, TASKBAR_H } from "@/store/desktop-store";
import type { SiteContent } from "@/types/content";
import { ContentProvider } from "./content-context";
import { BootScreen } from "./boot-screen";
import { LoginScreen } from "./login-screen";
import { OffScreen } from "./off-screen";
import { DesktopScreen } from "./desktop-screen";

export function Desktop({ content, alwaysBoot = false }: { content: SiteContent; alwaysBoot?: boolean }) {
  const phase = useDesktop((s) => s.phase);

  // Hydrate persisted state once, then keep the viewport in sync.
  useEffect(() => {
    const s = useDesktop.getState();
    const returning = s.hydrate({ alwaysBoot, name: content.profile.name });
    if (returning) openInitial(content);

    const onResize = () => useDesktop.getState().setViewport(window.innerWidth, window.innerHeight);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
    window.addEventListener("resize", onResize);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && useDesktop.getState().startOpen) useDesktop.getState().closeStart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentProvider value={content}>
      <div
        className="fixed inset-0 overflow-hidden bg-background font-body text-foreground"
        style={{ ["--taskbar-h" as string]: `${TASKBAR_H}px` }}
      >
        {phase === "init" && <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral-900)_78%,black)]" />}
        {phase === "boot" && <BootScreen />}
        {phase === "login" && <LoginScreen onLogin={() => openInitial(content)} />}
        {phase === "off" && <OffScreen />}
        {phase === "desktop" && <DesktopScreen />}
      </div>
    </ContentProvider>
  );
}

/** Window to open on arrival — configurable in the CMS. */
export function openInitial(content: SiteContent) {
  const s = useDesktop.getState();
  const o = content.profile.openOnLogin;
  // Defer a frame so the desktop has measured itself.
  requestAnimationFrame(() => {
    if (o === "about") s.open("about");
    else if (o === "projects") s.open("explorer", "projects");
  });
}
