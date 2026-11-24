"use client";

import type { Win, FolderId } from "@/store/desktop-store";
import { AboutApp } from "./apps/about-app";
import { ResumeApp } from "./apps/resume-app";
import { ExplorerApp } from "./apps/explorer-app";
import { ProjectApp } from "./apps/project-app";
import { ExperienceApp } from "./apps/experience-app";
import { CertsApp } from "./apps/certs-app";
import { SkillsApp } from "./apps/skills-app";
import { MailApp } from "./apps/mail-app";
import { TerminalApp } from "./apps/terminal-app";
import { GithubApp } from "./apps/github-app";
import { SettingsApp } from "./apps/settings-app";

export function WindowContent({ win, mobile }: { win: Win; mobile: boolean }) {
  switch (win.app) {
    case "about":
      return <AboutApp />;
    case "resume":
      return <ResumeApp />;
    case "explorer":
      return <ExplorerApp winId={win.id} folder={(win.arg as FolderId) ?? "about"} mobile={mobile} />;
    case "project":
      return <ProjectApp projectId={win.arg ?? ""} />;
    case "experience":
      return <ExperienceApp />;
    case "certs":
      return <CertsApp />;
    case "skills":
      return <SkillsApp />;
    case "mail":
      return <MailApp />;
    case "terminal":
      return <TerminalApp />;
    case "github":
      return <GithubApp />;
    case "settings":
      return <SettingsApp />;
  }
}
