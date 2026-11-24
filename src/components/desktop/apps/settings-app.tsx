"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesktop, type Wallpaper } from "@/store/desktop-store";
import { useContent } from "../content-context";

/** Downscale to 1920px JPEG @0.82 before it goes into localStorage. */
function downscale(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const sc = Math.min(1, 1920 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * sc);
        c.height = Math.round(img.height * sc);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(file);
  });
}

export function SettingsApp() {
  const { profile } = useContent();
  const wall = useDesktop((s) => s.wall);
  const walls = useDesktop((s) => s.walls);
  const msg = useDesktop((s) => s.settingsMsg);
  const { pickWall, addWall, removeWall, replayBootNextVisit, restart } = useDesktop.getState();

  const tiles: { key: string; label: string; bg: string; value: Wallpaper; removable?: number }[] = [
    {
      key: "portrait",
      label: "Portrait",
      bg: `url("${profile.portraitUrl}") 85% 20% / auto 130% no-repeat, linear-gradient(90deg, var(--color-background) 35%, var(--color-neutral-200))`,
      value: "portrait",
    },
    { key: "paper", label: "Paper", bg: "var(--color-background)", value: "paper" },
    ...walls.map((src, i) => ({
      key: `w${i}`,
      label: `Photo ${i + 1}`,
      bg: `var(--color-neutral-300) url("${src}") center / cover`,
      value: i as Wallpaper,
      removable: i,
    })),
  ];

  return (
    <div className="flex flex-col gap-s4 px-s6 pt-s4 pb-s6">
      <div>
        <h3 className="m-0 mb-1 text-[30px] font-normal">Wallpaper</h3>
        <p className="m-0 text-[13px] text-neutral-700">
          Portrait by default, plain paper, or one of your own photos. Uploads stay in this browser.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-s3">
        {tiles.map((t) => (
          <div key={t.key} className="flex flex-col gap-1.5">
            <button
              onClick={() => pickWall(t.value)}
              aria-label={t.label}
              aria-pressed={wall === t.value}
              className="aspect-[4/3] w-full cursor-pointer rounded-md border border-divider p-0"
              style={{
                background: t.bg,
                outline: wall === t.value ? "2px solid var(--color-brand)" : "2px solid transparent",
                outlineOffset: 2,
              }}
            />
            <div className="flex min-h-[22px] items-center justify-between gap-1 text-[12px]">
              <span>{t.label}</span>
              {t.removable !== undefined && (
                <Button variant="ghost" size="sm" className="px-1 py-0.5 text-[12px]" onClick={() => removeWall(t.removable!)}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <label className="tint-hover relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-brand text-[13px] text-brand-700">
            <Upload className="size-5" strokeWidth={1.5} />
            Upload photo
            <input
              type="file"
              accept="image/*"
              className="absolute size-0 opacity-0"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) addWall(await downscale(f));
              }}
            />
          </label>
          <div className="min-h-[22px] text-[12px] text-neutral-700">Up to four</div>
        </div>
      </div>
      {msg && <p className="m-0 text-[13px] text-brand-800">{msg}</p>}
      <div className="flex flex-col gap-s2 border-t border-divider pt-s4">
        <h4 className="m-0 text-[20px]">Startup</h4>
        <div className="flex flex-wrap items-center gap-s2">
          <Button variant="secondary" onClick={replayBootNextVisit}>
            Show boot screen next visit
          </Button>
          <Button variant="ghost" onClick={restart}>
            Restart now
          </Button>
        </div>
      </div>
    </div>
  );
}
