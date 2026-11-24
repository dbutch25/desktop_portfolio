"use client";

import { useContent } from "../content-context";

export function CertsApp() {
  const { certs } = useContent();
  return (
    <div className="max-w-[620px] p-s6">
      <div className="kicker">Experience · certifications.doc</div>
      <h2 className="mt-s2 mb-s4 text-[34px] font-normal">Education &amp; certifications</h2>
      {certs.map((c) => (
        <div key={c.id} className="grid grid-cols-[56px_minmax(0,1fr)] gap-s3 border-t border-divider py-s3">
          <span className="font-heading text-[20px] text-brand-700 tabular-nums">{c.year}</span>
          <div>
            <div className="font-heading text-[18px] leading-[1.2] font-semibold">{c.name}</div>
            <div className="text-[13px] text-neutral-700">{c.org}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
