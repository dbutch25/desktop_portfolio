import type { AppId, FolderId } from "@/store/desktop-store";
import type { SiteContent } from "@/types/content";

export type FileKind = "text" | "code" | "mail" | "link";
export type FileEntry = { name: string; meta: string; kind: FileKind; app?: AppId; arg?: string; href?: string };

export const FOLDER_ORDER: FolderId[] = ["about", "resume", "projects", "experience", "skills", "contact"];

export const FOLDER_NAMES: Record<FolderId, string> = {
  about: "About Me",
  resume: "Résumé",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  contact: "Contact",
};

export function resumeFileName(name: string) {
  return `${name.replace(/\s+/g, "_")}_Resume.pdf`;
}

export function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function folderFiles(folder: FolderId, c: SiteContent): FileEntry[] {
  const p = c.profile;
  switch (folder) {
    case "about":
      return [{ name: "readme.txt", meta: "Text document", kind: "text", app: "about" }];
    case "resume":
      return [{ name: resumeFileName(p.name), meta: `PDF · ${p.resumePages} pages`, kind: "text", app: "resume" }];
    case "projects":
      return c.projects.map((pr) => ({
        name: pr.fileName,
        meta: pr.draft ? "Draft" : "Project",
        kind: "code",
        app: "project",
        arg: pr.id,
      }));
    case "experience":
      return [
        { name: "work-history.doc", meta: "Document", kind: "text", app: "experience" },
        { name: "certifications.doc", meta: "Document", kind: "text", app: "certs" },
      ];
    case "skills":
      return [{ name: "tech-stack.doc", meta: "Document", kind: "text", app: "skills" }];
    case "contact": {
      const links: FileEntry[] = [{ name: "New message.mail", meta: "Compose", kind: "mail", app: "mail" }];
      if (p.linkedinUrl) links.push({ name: "LinkedIn.url", meta: "Shortcut", kind: "link", href: p.linkedinUrl });
      if (p.githubUrl) links.push({ name: "GitHub.url", meta: "Shortcut", kind: "link", href: p.githubUrl });
      if (p.siteUrl) links.push({ name: `${hostOf(p.siteUrl)}.url`, meta: "Shortcut", kind: "link", href: p.siteUrl });
      return links;
    }
  }
}

export function windowTitle(app: AppId, arg: string | undefined, c: SiteContent): string {
  switch (app) {
    case "about":
      return "readme.txt — About Me";
    case "resume":
      return resumeFileName(c.profile.name);
    case "explorer":
      return FOLDER_NAMES[(arg as FolderId) ?? "about"];
    case "project":
      return c.projects.find((p) => p.id === arg)?.fileName ?? "Project";
    case "experience":
      return "work-history.doc";
    case "certs":
      return "certifications.doc";
    case "skills":
      return "tech-stack.doc";
    case "mail":
      return `New message — to ${c.profile.name.split(" ")[0]}`;
    case "terminal":
      return "Terminal";
    case "github":
      return `GitHub — @${c.profile.githubUsername ?? "github"}`;
    case "settings":
      return "Settings";
  }
}
