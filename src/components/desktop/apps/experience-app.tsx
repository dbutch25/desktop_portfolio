"use client";

import { Button } from "@/components/ui/button";
import { useDesktop } from "@/store/desktop-store";
import { useContent } from "../content-context";

export function ExperienceApp() {
  const { roles } = useContent();
  const open = useDesktop((s) => s.open);
  return (
    <div className="max-w-[740px] px-s6 pt-s6 pb-s8">
      <div className="kicker">Experience · work-history.doc</div>
      <h2 className="mt-s2 mb-s6 text-[40px] font-normal">Work history</h2>
      {roles.map((r) => (
        <div key={r.id} className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] gap-s4 border-t border-divider py-s4">
          <div className="pt-[5px] text-[12px] text-neutral-700 tabular-nums">{r.period}</div>
          <div>
            <h4 className="m-0 mb-0.5 text-[20px]">{r.title}</h4>
            <div className="mb-s2 text-[13px] text-brand-700">
              {r.org} · {r.place}
            </div>
            {r.bullets.map((b, i) => (
              <p key={i} className="m-0 mb-1.5 text-justify text-[14px] hyphens-auto">
                {b}
              </p>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-s2 border-t border-divider pt-s4">
        <Button onClick={() => open("resume")}>Full résumé</Button>
        <Button variant="secondary" onClick={() => open("certs")}>
          Education &amp; certifications
        </Button>
      </div>
    </div>
  );
}
