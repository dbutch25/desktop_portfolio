"use client";

import { Button } from "@/components/ui/button";
import { useDesktop } from "@/store/desktop-store";
import { useContent } from "../content-context";

export function AboutApp() {
  const { profile, highlights } = useContent();
  const open = useDesktop((s) => s.open);
  return (
    <article className="flex max-w-[700px] flex-col gap-s4 px-s6 pt-s6 pb-s8">
      <div className="kicker">About me · readme.txt</div>
      <div>
        <h1 className="m-0 mb-s2 text-[56px] leading-none font-normal">{profile.name}</h1>
        <p className="m-0 font-heading text-[23px] text-neutral-800 italic">{profile.aboutSubtitle}</p>
      </div>
      <div className="gap-s6 text-justify text-[14px] hyphens-auto [&>p]:mb-s3" style={{ columns: "2 260px" }}>
        {profile.aboutBody.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {highlights.length > 0 && (
        <div>
          <h6 className="mb-s2 text-neutral-700">Highlights</h6>
          {highlights.map((text, i) => (
            <div key={i} className="grid grid-cols-[30px_minmax(0,1fr)] gap-s2 border-t border-divider py-s2 text-[14px]">
              <span className="font-heading text-[16px] text-brand-700 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-pretty">{text}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-s2">
        <Button onClick={() => open("resume")}>Open résumé</Button>
        <Button variant="secondary" onClick={() => open("explorer", "projects")}>
          Browse projects
        </Button>
        <Button variant="ghost" onClick={() => open("mail")}>
          Write to me
        </Button>
      </div>
    </article>
  );
}
