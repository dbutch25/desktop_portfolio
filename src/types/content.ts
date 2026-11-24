/** Plain, serialisable content passed from the server to the desktop client. */
export type Figure = { value: string; label: string };

export type ProjectContent = {
  id: string;
  fileName: string;
  title: string;
  client: string;
  summary: string;
  url: string | null;
  stack: string[];
  figures: Figure[];
  bullets: string[];
  screenshotUrl: string | null;
  draft: boolean;
};

export type RoleContent = {
  id: string;
  period: string;
  title: string;
  org: string;
  place: string;
  bullets: string[];
};

export type CertContent = { id: string; year: string; name: string; org: string };
export type SkillGroupContent = { id: string; name: string; items: string[] };

export type ProfileContent = {
  name: string;
  title: string;
  location: string;
  coordinates: string;
  tagline: string;
  heroBody: string;
  aboutSubtitle: string;
  aboutBody: string[];
  skillsIntro: string;
  email: string;
  phone: string | null;
  siteUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  githubUsername: string | null;
  portraitUrl: string;
  logoUrl: string;
  resumeUrl: string;
  resumePages: number;
  bootMessages: string[];
  bootSeconds: number;
  openOnLogin: "none" | "about" | "projects";
};

/** 0–4 intensity per day, oldest first, 7 rows per week column. */
export type Contributions = { levels: number[]; total: number | null; live: boolean };

export type SiteContent = {
  profile: ProfileContent;
  highlights: string[];
  projects: ProjectContent[];
  roles: RoleContent[];
  certs: CertContent[];
  skills: SkillGroupContent[];
  contributions: Contributions;
};
