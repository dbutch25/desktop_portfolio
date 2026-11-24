/**
 * Starting content, lifted verbatim from the design handoff.
 * Used by `prisma/seed.ts`, and as the profile fallback before the DB is seeded.
 * After seeding, edit everything in /admin — not here.
 */
import type { ProfileContent } from "@/types/content";

export const DEFAULT_PROFILE: ProfileContent = {
  name: "Daniel Butcher",
  title: "Lead Developer",
  location: "Toronto, Ontario",
  coordinates: "43.65° N · 79.38° W — Toronto",
  tagline: "Lead developer, full stack.",
  heroBody:
    "Seven years shipping production React and TypeScript, with Node, PostgreSQL and GraphQL behind it. I build the whole thing, from the first DNS record to the last Jest test.",
  aboutSubtitle: "Lead developer, full stack — Toronto, Ontario.",
  aboutBody: [
    "I build and ship customer-facing web applications: React and TypeScript on the front, Node, PostgreSQL and GraphQL behind it. For seven years that has meant production work, from the first DNS record to the last Jest test.",
    "Most of my recent work runs through Secura Design, my freelance practice, for wellness, medical and construction clients. I care about the unglamorous parts: caching, image delivery, accessibility, and content workflows that non-technical authors can run on their own.",
  ],
  skillsIntro:
    "Seven years of production React and TypeScript, plus the backend, CDN and testing work that keeps it upright.",
  email: "danielbutcher25@gmail.com",
  phone: "+1 (416) 899-2825",
  siteUrl: "https://daniel-butcher.com/",
  linkedinUrl: "https://linkedin.com/in/daniel-butcher25",
  githubUrl: "https://github.com/dbutch25",
  githubUsername: "dbutch25",
  portraitUrl: "/assets/portrait.jpg",
  logoUrl: "/assets/secura-logo.png",
  resumeUrl: "/assets/Daniel_Butcher_Resume.pdf",
  resumePages: 2,
  bootMessages: [
    "Mounting /projects…",
    "Resolving dependencies…",
    "Warming the CDN cache…",
    "Hydrating components…",
    "Ready.",
  ],
  bootSeconds: 3,
  openOnLogin: "none",
};

export const DEFAULT_HIGHLIGHTS = [
  "7+ years building and shipping production, customer-facing front-ends with React, TypeScript and modern JavaScript.",
  "Component architecture, state management and reusable component libraries across production apps.",
  "Headless CMS work with Sanity — content models and publishing workflows non-technical authors run on their own.",
  "Global asset delivery with Cloudinary and AWS S3: caching, image optimization, next-generation formats.",
  "Consulting teams on technical direction for their online presence.",
];

const f = (value: string, label: string) => ({ value, label });

export const DEFAULT_PROJECTS = [
  {
    fileName: "myodetox-booking.proj",
    title: "Myodetox Booking Widget",
    client: "Clinic booking",
    url: "https://booking.myodetox.com/",
    summary: "A clinic booking funnel rebuilt to take three screens out of the journey — and a silent auth drop-off with them.",
    stack: ["Next.js", "TypeScript", "Zustand", "Node.js", "GraphQL", "Jest", "AWS S3"],
    figures: [f("3", "screens cut from the journey"), f("45", "tests on every push"), f("3", "deploy environments")],
    bullets: [
      "Rebuilt the entry point to pass clinician, service and location straight into the widget through URL parameters, cutting three screens from the journey.",
      "Traced the full execution order to the root cause of a booking drop-off, re-architected the auth sequence, and confirmed the drop-off was gone.",
      "Wrote 45 Jest and React Testing Library tests covering the full funnel, running on every push through a three-environment GitHub Actions and Vercel pipeline.",
    ],
    draft: false,
  },
  {
    fileName: "skyluxe-roofing.proj",
    title: "Skyluxe Roofing & Sheet Metal",
    client: "Custom CMS",
    url: "https://skyluxeroofing.com/",
    summary: "WordPress and a paid CMS replaced by a custom Next.js 16 application — at zero ongoing platform cost.",
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma 7", "shadcn/ui", "better-auth", "Cloudinary"],
    figures: [f("14", "Prisma models"), f("19", "Zod-validated API routes"), f("$0", "ongoing platform cost")],
    bullets: [
      "Replaced WordPress and a paid third-party CMS with a custom Next.js 16 app and an admin panel built from scratch.",
      "Designed the data layer: 14 Prisma models, 19 Zod-validated REST routes with typed schemas, and role-based access control across every admin route.",
      "Hardened every layer — CSP, HSTS and X-Frame-Options headers, rate limiting, magic-byte upload validation, and 2FA/TOTP admin login via better-auth.",
      "Integrated Cloudinary for on-the-fly transformations and automatic WebP and AVIF delivery, cutting page payload.",
    ],
    draft: false,
  },
  {
    fileName: "skincan.proj",
    title: "SkinCan",
    client: "Toronto cancer screening clinic",
    url: "https://skincan.ca/",
    summary: "Everything from the domain and DNS through the deployment pipeline and the application itself.",
    stack: ["Next.js", "TypeScript", "Sanity CMS", "Resend", "GSAP", "Google Ads"],
    figures: [],
    bullets: [
      "Built everything from the domain and DNS through the deployment pipeline and the full application.",
      "Six service pages with JSON-LD schema markup, a Sanity-powered blog with tag filtering and pagination, FAQ and pricing pages, and a contact form wired to Resend.",
      "Integrated Microsoft Clarity for session recording and heatmaps.",
    ],
    draft: false,
  },
  {
    fileName: "daniel-butcher-com.proj",
    title: "daniel-butcher.com",
    client: "Personal site",
    url: "https://daniel-butcher.com/",
    summary: "The site this desktop lives on. Write-up to come.",
    stack: [],
    figures: [],
    bullets: [],
    draft: true,
  },
  {
    fileName: "secura-design.proj",
    title: "Secura Design",
    client: "Freelance practice",
    url: null,
    summary: "The studio behind most of this work. Write-up to come.",
    stack: [],
    figures: [],
    bullets: [],
    draft: true,
  },
  {
    fileName: "cg-creates-storefronts.proj",
    title: "CG Creates storefronts",
    client: "E-commerce",
    url: null,
    summary: "Client e-commerce builds, 2018–2022. Write-up to come.",
    stack: [],
    figures: [],
    bullets: [],
    draft: true,
  },
  {
    fileName: "untitled-07.proj",
    title: "Untitled project",
    client: "Slot 07",
    url: null,
    summary: "Reserved for the next one.",
    stack: [],
    figures: [],
    bullets: [],
    draft: true,
  },
];

export const DEFAULT_ROLES = [
  {
    period: "08/2022 — Present",
    title: "Senior Full-Stack Developer",
    org: "Secura Design (Freelance)",
    place: "Remote",
    bullets: [
      "Full project lifecycles for wellness, medical and construction clients — requirements, architecture, frontend and backend, testing, deployment and maintenance.",
      "Troubleshot client back-end infrastructure and third-party dependencies, lowering costs by replacing them with in-house software.",
      "Clear, timely communication with clients through every stage of a problem.",
      "Claude Code and GitHub Copilot daily for architecture decisions, debugging and refactoring.",
    ],
  },
  {
    period: "08/2018 — 08/2022",
    title: "Jr. Web Developer / IT Technician",
    org: "CG Creates",
    place: "Brampton, ON",
    bullets: ["Built and launched client e-commerce sites; managed office network infrastructure and hardware support."],
  },
  {
    period: "09/2020 — 01/2021",
    title: "Technical Support",
    org: "Apple Inc.",
    place: "Remote",
    bullets: ["Handled 20–25 tickets a day with high CSAT, fully remote during COVID-19."],
  },
  {
    period: "10/2018 — 07/2020",
    title: "Assembler / Technician",
    org: "Honeywell",
    place: "Mississauga, ON",
    bullets: ["Built and tested IPC Class 3 assemblies for Boeing, Airbus, Bombardier, and US and Canadian military programmes."],
  },
];

export const DEFAULT_CERTS = [
  { year: "2026", name: "Associate Google Workspace Administrator", org: "Google" },
  { year: "2022", name: "Web Development Immersive Certificate", org: "Juno College of Technology, Toronto" },
  { year: "2021", name: "Certified Network Defender (CND)", org: "EC-Council" },
];

export const DEFAULT_SKILLS = [
  { name: "Languages", items: ["TypeScript", "JavaScript (ES6+)", "Node.js", "SQL", "HTML5", "CSS3"] },
  { name: "Frontend", items: ["React.js", "Next.js", "Component architecture", "State management (Zustand, hooks)", "Reusable component libraries"] },
  { name: "Backend", items: ["REST APIs", "GraphQL", "Prisma 7", "Custom CMS ORM", "PostgreSQL architecture", "Zod validation", "Third-party APIs", "Resend", "Redis"] },
  { name: "CDN & performance", items: ["Cloudinary CDN", "AWS S3", "Content & browser caching", "Asset optimization", "Code splitting", "Lazy loading", "Bundle optimization", "Core Web Vitals"] },
  { name: "Testing", items: ["Jest", "React Testing Library", "TDD", "Root cause analysis", "Code reviews", "Sentry monitoring & replay"] },
  { name: "Accessibility & SEO", items: ["WCAG", "Semantic HTML", "Keyboard navigation", "Screen-reader support", "JSON-LD structured data", "Metadata & canonical URLs", "Crawlability & indexing"] },
  { name: "AI & tooling", items: ["Claude Code", "GitHub Copilot", "VS Code", "Figma", "Microsoft Clarity"] },
];
