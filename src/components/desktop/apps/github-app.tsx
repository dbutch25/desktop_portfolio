"use client";

import { Button } from "@/components/ui/button";
import { useContent } from "../content-context";

const BG = [
  "var(--color-neutral-200)",
  "var(--color-brand-200)",
  "var(--color-brand-300)",
  "var(--color-brand-500)",
  "var(--color-brand-700)",
];

export function GithubApp() {
  const { profile, contributions } = useContent();
  const user = profile.githubUsername ?? "github";
  return (
    <div className="flex flex-col gap-s3 px-s6 py-s4">
      <div className="flex flex-wrap items-baseline gap-s3">
        <h3 className="m-0 text-[30px] font-normal">@{user}</h3>
        <span className="text-[13px] text-neutral-700">
          {contributions.total != null
            ? `${contributions.total.toLocaleString()} contributions, last twelve months`
            : "Contributions, last twelve months"}
        </span>
        {profile.githubUrl && (
          <Button asChild className="ml-auto">
            <a href={profile.githubUrl} target="_blank" rel="noopener">
              Open profile
            </a>
          </Button>
        )}
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="grid w-max grid-flow-col grid-rows-[repeat(7,11px)] auto-cols-[11px] gap-[3px]">
          {contributions.levels.map((lvl, i) => (
            <span
              key={i}
              className="size-[11px] rounded-[2px]"
              style={{ background: lvl < 0 ? "transparent" : BG[lvl] }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-s3 text-[11px] text-neutral-700">
        <span>{contributions.live ? "Live from GitHub · refreshed daily." : "Sample pattern — add a GITHUB_TOKEN to show live activity."}</span>
        <span className="ml-auto flex items-center gap-[3px]">
          Less
          {BG.map((b) => (
            <span key={b} className="size-[11px] rounded-[2px]" style={{ background: b }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
