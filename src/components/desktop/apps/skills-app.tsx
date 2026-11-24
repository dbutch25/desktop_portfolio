"use client";

import { useContent } from "../content-context";

export function SkillsApp() {
  const { skills, profile } = useContent();
  return (
    <div className="max-w-[740px] px-s6 pt-s6 pb-s8">
      <div className="kicker">Skills · tech-stack.doc</div>
      <h2 className="mt-s2 mb-s2 text-[40px] font-normal">Tech stack</h2>
      <p className="m-0 mb-s4 max-w-[52ch] text-[14px] text-neutral-700">{profile.skillsIntro}</p>
      {skills.map((g) => (
        <div key={g.id} className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-s3 border-t border-divider py-s3">
          <div className="font-heading text-[18px] leading-[1.2] font-semibold">{g.name}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((it) => (
              <span key={it} className="tag tag-neutral">
                {it}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
