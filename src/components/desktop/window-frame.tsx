"use client";

import { useRef } from "react";
import { Minus, Square, X } from "lucide-react";
import { useDesktop, TASKBAR_H, type Win } from "@/store/desktop-store";
import { useContent } from "./content-context";
import { windowTitle } from "./folders";
import { WindowContent } from "./window-content";

type Drag = { mode: "move" | "resize"; dx: number; dy: number; x0: number; y0: number; w0: number; h0: number };

export function WindowFrame({ win, zIndex, mobile }: { win: Win; zIndex: number; mobile: boolean }) {
  const content = useContent();
  const active = useDesktop((s) => s.activeId() === win.id);
  const { focus, minimize, toggleMax, close, detach, setRect } = useDesktop.getState();
  const drag = useRef<Drag | null>(null);
  const full = mobile || win.max;
  const title = windowTitle(win.app, win.arg, content);

  const start = (e: React.PointerEvent, mode: Drag["mode"]) => {
    if (e.button !== 0 || mobile || win.max) return;
    if (mode === "move" && (e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    detach(win.id);
    drag.current = { mode, dx: e.clientX - win.x, dy: e.clientY - win.y, x0: e.clientX, y0: e.clientY, w0: win.w, h0: win.h };
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const { vw, vh } = useDesktop.getState();
    if (d.mode === "move") {
      setRect(win.id, {
        x: Math.round(Math.min(Math.max(e.clientX - d.dx, 60 - win.w), vw - 60)),
        y: Math.round(Math.min(Math.max(e.clientY - d.dy, 0), vh - TASKBAR_H - 40)),
      });
    } else {
      setRect(win.id, {
        w: Math.round(Math.min(Math.max(320, d.w0 + e.clientX - d.x0), vw - win.x)),
        h: Math.round(Math.min(Math.max(220, d.h0 + e.clientY - d.y0), vh - TASKBAR_H - win.y)),
      });
    }
  };

  const end = () => {
    drag.current = null;
  };

  return (
    <section
      role="dialog"
      aria-label={title}
      data-screen-label={title}
      onPointerDown={() => focus(win.id)}
      className="absolute flex-col overflow-hidden border border-divider bg-background"
      style={{
        left: full ? 0 : win.x,
        top: full ? 0 : win.y,
        width: full ? "100%" : win.w,
        height: full ? "100%" : win.h,
        zIndex,
        display: win.min ? "none" : "flex",
        borderTop: `2px solid ${active ? "var(--color-brand)" : "var(--color-divider)"}`,
        borderRadius: full ? 0 : 4,
        boxShadow: active ? "var(--shadow-ds-lg)" : "var(--shadow-ds-md)",
      }}
    >
      <header
        onPointerDown={(e) => start(e, "move")}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onDoubleClick={() => !mobile && toggleMax(win.id)}
        className="flex h-10 flex-none touch-none items-center gap-s2 border-b border-divider pr-1.5 pl-s3 select-none"
        style={{ cursor: full ? "default" : "move" }}
      >
        <span
          className="min-w-0 flex-1 truncate font-heading text-[17px] font-semibold"
          style={{ color: active ? "var(--color-foreground)" : "var(--color-neutral-700)" }}
        >
          {title}
        </span>
        <TitleButton label="Minimize" onClick={() => minimize(win.id)}>
          <Minus className="size-[15px]" strokeWidth={1.5} />
        </TitleButton>
        {!mobile && (
          <TitleButton label={win.max ? "Restore" : "Maximize"} onClick={() => toggleMax(win.id)}>
            <Square className="size-3.5" strokeWidth={1.5} />
          </TitleButton>
        )}
        <TitleButton label="Close" onClick={() => close(win.id)} danger>
          <X className="size-[15px]" strokeWidth={1.5} />
        </TitleButton>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <WindowContent win={win} mobile={mobile} />
      </div>

      {!full && (
        <div
          aria-hidden
          onPointerDown={(e) => start(e, "resize")}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          className="absolute right-0 bottom-0 size-4 cursor-nwse-resize touch-none"
        />
      )}
    </section>
  );
}

function TitleButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={
        "inline-flex size-[30px] cursor-pointer items-center justify-center rounded-md text-neutral-800 " +
        (danger ? "hover:bg-brand/16 hover:text-brand-800" : "hover:bg-ink/7")
      }
    >
      {children}
    </button>
  );
}
