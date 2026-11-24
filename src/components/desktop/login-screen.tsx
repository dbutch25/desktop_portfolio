"use client";

import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesktop } from "@/store/desktop-store";
import { useContent } from "./content-context";
import { Avatar } from "./avatar";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { profile } = useContent();
  const login = useDesktop((s) => s.login);
  const shutDown = useDesktop((s) => s.shutDown);

  return (
    <div data-screen-label="Login" className="absolute inset-0 grid grid-rows-[minmax(0,1fr)_auto] bg-background">
      <div className="flex flex-wrap items-center justify-center gap-s8 overflow-auto px-s6 py-s8">
        <div className="flex max-w-[420px] flex-[1_1_300px] flex-col gap-s2">
          <div className="kicker">Guest session</div>
          <h1 className="m-0 text-[76px] leading-none font-normal">Welcome.</h1>
          <p className="m-0 font-heading text-[22px] text-neutral-700 italic">Click your name to begin.</p>
        </div>
        <div className="hidden min-h-[160px] w-px self-stretch bg-divider min-[720px]:block" />
        <button
          onClick={() => {
            login();
            onLogin();
          }}
          className="flex max-w-[420px] flex-[1_1_300px] cursor-pointer items-center gap-s4 rounded-md border border-transparent bg-transparent p-s4 text-left text-foreground hover:border-brand hover:bg-brand/6"
        >
          <Avatar src={profile.portraitUrl} alt={profile.name} size={72} />
          <span className="flex flex-col gap-0.5">
            <span className="font-heading text-[27px] leading-[1.1] font-semibold">{profile.name}</span>
            <span className="text-[13px] text-neutral-700">
              {profile.title} · {profile.location}
            </span>
          </span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-s3 border-t border-divider px-s6 py-s3">
        <Button variant="secondary" onClick={shutDown}>
          <Power className="size-4" strokeWidth={1.5} />
          Shut down
        </Button>
        <span className="text-[12px] text-neutral-700">
          No password required. Recruiters, hiring managers and the curious all welcome.
        </span>
      </div>
    </div>
  );
}
