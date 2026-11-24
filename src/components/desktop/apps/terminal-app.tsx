"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktop, type AppId, type TermKind, type TermLine } from "@/store/desktop-store";
import { useContent } from "../content-context";
import { FOLDER_NAMES, FOLDER_ORDER, hostOf } from "../folders";

const COLORS: Record<TermKind, string> = {
  in: "var(--color-neutral-100)",
  out: "var(--color-neutral-300)",
  muted: "var(--color-neutral-500)",
  accent: "var(--color-brand-400)",
  err: "var(--color-brand-300)",
};

const APP_NAMES: Record<string, [AppId, string?]> = {
  about: ["about"],
  readme: ["about"],
  resume: ["resume"],
  "résumé": ["resume"],
  projects: ["explorer", "projects"],
  experience: ["experience"],
  skills: ["skills"],
  contact: ["mail"],
  mail: ["mail"],
  github: ["github"],
  settings: ["settings"],
};

export function TerminalApp() {
  const c = useContent();
  const { profile, projects, roles } = c;
  const term = useDesktop((s) => s.term);
  const hist = useDesktop((s) => s.termHist);
  const { pushTerm, clearTerm, open } = useDesktop.getState();
  const [input, setInput] = useState("");
  const hi = useRef<number | undefined>(undefined);
  const body = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const prompt = `guest@${profile.name.toLowerCase().replace(/\s+/g, "-")}:~$`;

  useEffect(() => {
    field.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [term]);

  const openByName = (t: string) => {
    if (APP_NAMES[t]) {
      open(...APP_NAMES[t]);
      return true;
    }
    const n = parseInt(t.replace("project", "").trim(), 10);
    if (n >= 1 && n <= projects.length) {
      open("project", projects[n - 1].id);
      return true;
    }
    return false;
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    const lc = cmd.toLowerCase();
    const out: TermLine[] = [{ text: `${prompt} ${cmd}`, kind: "in" }];
    const say = (text: string, kind: TermKind = "out") => out.push({ text, kind });
    const first = profile.name.split(" ")[0];
    hi.current = undefined;
    setInput("");

    if (!cmd) {
    } else if (lc === "help") {
      [
        "help            this list",
        "whoami          who you are talking to",
        "ls projects     list the projects folder",
        "open <app>      about · resume · projects · experience · skills · contact · github · settings",
        `open <1-${projects.length}>      open a project by number`,
        "cat resume      the résumé, condensed",
        `contact         ways to reach ${first}`,
        "clear           wipe the screen",
      ].forEach((l) => say(l));
    } else if (lc === "whoami") {
      say(profile.name);
      say(`${profile.tagline.replace(/\.$/, "")} · ${profile.location}`);
      say(profile.heroBody.split(". ")[0] + ".", "muted");
    } else if (lc === "ls") {
      say(FOLDER_ORDER.map((k) => FOLDER_NAMES[k].replace(" ", "_") + "/").join("   "));
    } else if (lc === "ls projects" || lc === "ls projects/") {
      projects.forEach((p, i) =>
        say(String(i + 1).padStart(2, "0") + "  " + p.fileName.padEnd(28) + p.title + (p.draft ? "  (draft)" : "")),
      );
    } else if (lc === "open" || lc.startsWith("open ")) {
      const t = lc.slice(4).trim();
      if (t === "terminal") say("You're already here.", "muted");
      else if (!t) say("Open what? e.g. open projects", "err");
      else if (openByName(t)) say(`Opening ${t}…`, "muted");
      else say(`No app called '${t}'. Try: about, resume, projects, experience, skills, contact, github, settings.`, "err");
    } else if (lc === "cat resume" || lc === "cat résumé") {
      [
        `${profile.name.toUpperCase()} — ${profile.title}`,
        `${profile.location} · ${profile.email}`,
        " ",
        "EXPERIENCE",
        ...roles.map((r) => "  " + r.period.padEnd(20) + r.title + ", " + r.org),
        " ",
        "SELECTED PROJECTS",
        "  " + projects.filter((p) => !p.draft).map((p) => p.title).join(" · "),
        " ",
        "STACK",
        "  " + [...new Set(c.skills.slice(0, 3).flatMap((g) => g.items))].slice(0, 9).join(" · "),
      ].forEach((l) => say(l));
      say("Full PDF: open resume", "muted");
    } else if (lc === "contact") {
      say("email     " + profile.email);
      if (profile.phone) say("phone     " + profile.phone);
      if (profile.siteUrl) say("web       " + hostOf(profile.siteUrl));
      if (profile.linkedinUrl) say("linkedin  " + profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ""));
      if (profile.githubUrl) say("github    " + profile.githubUrl.replace(/^https?:\/\/(www\.)?/, ""));
      say("Or type 'open contact' to write a message.", "muted");
    } else if (lc === "clear") {
      clearTerm(cmd);
      return;
    } else {
      say(`command not found: ${cmd} — type 'help' for the short list.`, "err");
    }
    pushTerm(out, cmd || undefined);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") run(input);
    else if (e.key === "ArrowUp" && hist.length) {
      e.preventDefault();
      hi.current = Math.max(0, (hi.current ?? hist.length) - 1);
      setInput(hist[hi.current]);
    } else if (e.key === "ArrowDown" && hi.current !== undefined) {
      e.preventDefault();
      const n = hi.current + 1;
      hi.current = n >= hist.length ? undefined : n;
      setInput(n >= hist.length ? "" : hist[n]);
    }
  };

  return (
    <div
      onClick={() => !window.getSelection()?.toString() && field.current?.focus()}
      className="flex min-h-0 flex-1 flex-col bg-[color-mix(in_srgb,var(--color-neutral-900)_82%,black)] font-mono text-[13px] leading-[1.55] text-neutral-200"
    >
      <div ref={body} className="min-h-0 flex-1 overflow-auto px-s3 pt-s3">
        {term.map((l, i) => (
          <div key={i} className="break-words whitespace-pre-wrap" style={{ color: COLORS[l.kind] }}>
            {l.text}
          </div>
        ))}
        <div className="flex gap-2 pb-s3">
          <span className="flex-none text-brand-400">{prompt}</span>
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            aria-label="Terminal input"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-neutral-100 caret-brand-400 outline-none focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
