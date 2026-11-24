"use client";

import Image from "next/image";
import { ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesktop } from "@/store/desktop-store";
import cloudinaryLoader from "@/lib/cloudinary-loader";
import { useContent } from "../content-context";

export function ProjectApp({ projectId }: { projectId: string }) {
  const { projects } = useContent();
  const open = useDesktop((s) => s.open);
  const i = projects.findIndex((p) => p.id === projectId);
  const p = projects[i];
  if (!p) return <p className="p-s6 text-neutral-700">This project has been removed.</p>;
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="flex max-w-[780px] flex-col gap-s4 px-s6 pt-s6 pb-s8">
      <div className="flex flex-wrap items-center gap-s2">
        <span className="kicker">
          Project {String(i + 1).padStart(2, "0")} · {p.client}
        </span>
        {p.draft && <span className="tag tag-brand">Draft</span>}
      </div>
      <h1 className="m-0 text-[46px] leading-[1.05] font-normal">{p.title}</h1>
      <p className="m-0 font-heading text-[22px] leading-[1.35] text-pretty text-neutral-800 italic">{p.summary}</p>
      {p.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="tag tag-neutral">
              {s}
            </span>
          ))}
        </div>
      )}
      <div className="plate relative aspect-video w-full overflow-hidden bg-neutral-200">
        {p.screenshotUrl ? (
          <Image
            src={p.screenshotUrl}
            alt={`Screenshot of ${p.title}`}
            fill
            sizes="(max-width: 720px) 100vw, 740px"
            loader={p.screenshotUrl.includes("res.cloudinary.com") ? cloudinaryLoader : undefined}
            className="object-cover object-top"
          />
        ) : (
          <div className="m-1.5 flex h-[calc(100%-12px)] flex-col items-center justify-center gap-2 border border-dashed border-brand/50 text-[13px] text-neutral-700">
            <ImageIcon className="size-6" strokeWidth={1.2} />
            Screenshot coming soon
          </div>
        )}
      </div>
      {p.figures.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-s4 border-y border-divider py-s4">
          {p.figures.map((f, k) => (
            <div key={k}>
              <div className="font-heading text-[42px] leading-none tabular-nums">{f.value}</div>
              <div className="mt-1 text-[12px] text-neutral-700">{f.label}</div>
            </div>
          ))}
        </div>
      )}
      {p.bullets.length > 0 && (
        <div>
          <h6 className="mb-s2 text-neutral-700">What I did</h6>
          {p.bullets.map((b, k) => (
            <p key={k} className="m-0 border-t border-divider py-s2 text-justify text-[14px] hyphens-auto">
              {b}
            </p>
          ))}
        </div>
      )}
      {p.draft && <p className="m-0 text-[13px] text-neutral-700">Write-up in progress — check back soon.</p>}
      <div className="flex flex-wrap gap-s2">
        {p.url && (
          <Button asChild>
            <a href={p.url} target="_blank" rel="noopener">
              Visit live site
              <ExternalLink className="size-3.5" strokeWidth={1.5} />
            </a>
          </Button>
        )}
        {next && next.id !== p.id && (
          <Button variant="secondary" onClick={() => open("project", next.id)}>
            Next: {next.title} →
          </Button>
        )}
      </div>
    </article>
  );
}
