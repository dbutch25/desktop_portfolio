"use client";

import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "../content-context";
import { resumeFileName } from "../folders";

export function ResumeApp() {
  const { profile } = useContent();
  const file = resumeFileName(profile.name);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-none flex-wrap items-center gap-s2 border-b border-divider px-s3 py-s2">
        <span className="mr-auto text-[12px] text-neutral-700">PDF · {profile.resumePages} pages</span>
        <Button variant="secondary" asChild>
          <a href={profile.resumeUrl} download={file}>
            <Download strokeWidth={1.5} />
            Download
          </a>
        </Button>
        <Button asChild>
          <a href={profile.resumeUrl} target="_blank" rel="noopener">
            <ExternalLink strokeWidth={1.5} />
            Open full size
          </a>
        </Button>
      </div>
      <iframe
        src={`${profile.resumeUrl}#view=FitH`}
        title={`${profile.name} résumé`}
        className="min-h-0 w-full flex-1 border-0 bg-surface"
      />
    </div>
  );
}
