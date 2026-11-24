"use client";

import { create } from "zustand";

export const TASKBAR_H = 46;
export const MOBILE_BP = 720;

export type Phase = "init" | "boot" | "login" | "desktop" | "off";
export type FolderId = "about" | "resume" | "projects" | "experience" | "skills" | "contact";
export type AppId =
  | "about"
  | "resume"
  | "explorer"
  | "project"
  | "experience"
  | "certs"
  | "skills"
  | "mail"
  | "terminal"
  | "github"
  | "settings";

/** Default window sizes per app (clamped to the viewport). */
export const APP_SIZES: Record<AppId, { w: number; h: number }> = {
  about: { w: 680, h: 660 },
  resume: { w: 780, h: 780 },
  explorer: { w: 680, h: 460 },
  project: { w: 740, h: 720 },
  experience: { w: 720, h: 700 },
  certs: { w: 580, h: 420 },
  skills: { w: 720, h: 660 },
  mail: { w: 600, h: 580 },
  terminal: { w: 660, h: 420 },
  github: { w: 840, h: 320 },
  settings: { w: 620, h: 540 },
};

export type Win = {
  id: string;
  app: AppId;
  /** Folder id for explorer, project id for project windows. */
  arg?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
  /** Auto-refit to the viewport until the user moves/resizes it. */
  auto: boolean;
  slot: number;
};

export type TermKind = "in" | "out" | "muted" | "accent" | "err";
export type TermLine = { text: string; kind: TermKind };
export type Wallpaper = "portrait" | "paper" | number;

const K_VISITED = "db-desktop-visited";
const K_WALLS = "db-desktop-walls";
const K_WALL = "db-desktop-wall";

function fit(app: AppId, slot: number, vw: number, vh: number) {
  const cfg = APP_SIZES[app];
  const off = slot * 28;
  const dh = vh - TASKBAR_H;
  const w = Math.max(320, Math.min(cfg.w, vw - 140));
  const h = Math.max(240, Math.min(cfg.h, dh - 32));
  const x = Math.max(116, Math.min(vw - w - 12, Math.round((vw - w) / 2) - 20 + off));
  const y = Math.max(10, Math.min(dh - h - 10, 20 + off));
  return { x, y, w, h };
}

const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => localStorage.setItem(k, v),
  remove: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};

const intro = (name: string): TermLine[] => [
  { text: `${name} — guest session`, kind: "accent" },
  { text: "Type 'help' to see what this can do.", kind: "muted" },
];

type DesktopState = {
  phase: Phase;
  wins: Win[];
  zTop: number;
  startOpen: boolean;
  vw: number;
  vh: number;

  wall: Wallpaper;
  walls: string[];
  settingsMsg: string;

  term: TermLine[];
  termHist: string[];

  // lifecycle
  hydrate: (opts: { alwaysBoot?: boolean; name: string }) => boolean;
  setPhase: (p: Phase) => void;
  login: () => void;
  logOff: () => void;
  shutDown: () => void;
  restart: () => void;
  setViewport: (vw: number, vh: number) => void;

  // windows
  open: (app: AppId, arg?: string) => void;
  navigate: (id: string, app: AppId, arg: string) => void;
  focus: (id: string) => void;
  close: (id: string) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
  taskClick: (id: string) => void;
  detach: (id: string) => void;
  setRect: (id: string, rect: Partial<Pick<Win, "x" | "y" | "w" | "h">>) => void;
  activeId: () => string | null;

  // start menu
  toggleStart: () => void;
  closeStart: () => void;

  // terminal
  pushTerm: (lines: TermLine[], cmd?: string) => void;
  clearTerm: (cmd?: string) => void;

  // wallpaper
  pickWall: (w: Wallpaper) => void;
  addWall: (dataUrl: string) => void;
  removeWall: (i: number) => void;
  replayBootNextVisit: () => void;
};

export const useDesktop = create<DesktopState>()((set, get) => {
  const saveWalls = () => {
    const { walls, wall } = get();
    try {
      store.set(K_WALLS, JSON.stringify(walls));
      store.set(K_WALL, String(wall));
      set({ settingsMsg: "" });
    } catch {
      set({ settingsMsg: "That photo is too large to remember between visits — it will stay until you reload." });
    }
  };

  return {
    phase: "init",
    wins: [],
    zTop: 1,
    startOpen: false,
    vw: 1280,
    vh: 800,
    wall: "portrait",
    walls: [],
    settingsMsg: "",
    term: [],
    termHist: [],

    /** Reads persisted state. Returns true if this is a returning visitor. */
    hydrate: ({ alwaysBoot = false, name }) => {
      let walls: string[] = [];
      let wall: Wallpaper = "portrait";
      try {
        walls = JSON.parse(store.get(K_WALLS) || "[]") || [];
      } catch {}
      const w = store.get(K_WALL);
      if (w === "paper" || w === "portrait") wall = w;
      else if (w != null && walls[+w]) wall = +w;
      const visited = !!store.get(K_VISITED) && !alwaysBoot;
      set({
        walls,
        wall,
        term: intro(name),
        vw: window.innerWidth,
        vh: window.innerHeight,
        phase: visited ? "desktop" : "boot",
      });
      return visited;
    },
    setPhase: (phase) => set({ phase }),
    login: () => {
      try {
        store.set(K_VISITED, "1");
      } catch {}
      set({ phase: "desktop", wins: [], startOpen: false });
    },
    logOff: () => set({ phase: "login", wins: [], startOpen: false }),
    shutDown: () => set({ phase: "off", wins: [], startOpen: false }),
    restart: () => set({ phase: "boot", wins: [], startOpen: false }),

    setViewport: (vw, vh) => {
      const s = get();
      if (vw === s.vw && vh === s.vh) return;
      set({ vw, vh, wins: s.wins.map((w) => (w.auto ? { ...w, ...fit(w.app, w.slot, vw, vh) } : w)) });
    },

    open: (app, arg) =>
      set((s) => {
        const id = `${app}:${arg ?? ""}`;
        const z = s.zTop + 1;
        if (s.wins.some((w) => w.id === id))
          return { zTop: z, startOpen: false, wins: s.wins.map((w) => (w.id === id ? { ...w, min: false, z } : w)) };
        const vw = window.innerWidth || s.vw;
        const vh = window.innerHeight || s.vh;
        const slot = s.wins.length % 6;
        const win: Win = { id, app, arg, slot, auto: true, ...fit(app, slot, vw, vh), z, min: false, max: false };
        return { vw, vh, zTop: z, startOpen: false, wins: [...s.wins, win] };
      }),

    /** Explorer sidebar: re-point a window at another folder (or raise it if already open). */
    navigate: (id, app, arg) =>
      set((s) => {
        const nid = `${app}:${arg}`;
        const z = s.zTop + 1;
        if (s.wins.some((x) => x.id === nid))
          return {
            zTop: z,
            wins: s.wins.filter((x) => x.id !== id).map((x) => (x.id === nid ? { ...x, z, min: false } : x)),
          };
        return { zTop: z, wins: s.wins.map((x) => (x.id === id ? { ...x, id: nid, arg, z } : x)) };
      }),

    focus: (id) =>
      set((s) => {
        const w = s.wins.find((x) => x.id === id);
        if (!w || w.z === s.zTop) return {};
        const z = s.zTop + 1;
        return { zTop: z, wins: s.wins.map((x) => (x.id === id ? { ...x, z } : x)) };
      }),
    close: (id) => set((s) => ({ wins: s.wins.filter((w) => w.id !== id) })),
    minimize: (id) => set((s) => ({ wins: s.wins.map((w) => (w.id === id ? { ...w, min: true } : w)) })),
    toggleMax: (id) => set((s) => ({ wins: s.wins.map((w) => (w.id === id ? { ...w, max: !w.max } : w)) })),

    activeId: () => {
      const vis = get().wins.filter((w) => !w.min);
      return vis.length ? vis.reduce((a, b) => (b.z > a.z ? b : a)).id : null;
    },

    taskClick: (id) => {
      const s = get();
      const w = s.wins.find((x) => x.id === id);
      if (!w) return;
      if (w.min) {
        const z = s.zTop + 1;
        set({ zTop: z, wins: s.wins.map((x) => (x.id === id ? { ...x, min: false, z } : x)) });
      } else if (s.activeId() === id) s.minimize(id);
      else s.focus(id);
    },

    detach: (id) => set((s) => ({ wins: s.wins.map((x) => (x.id === id && x.auto ? { ...x, auto: false } : x)) })),
    setRect: (id, rect) => set((s) => ({ wins: s.wins.map((x) => (x.id === id ? { ...x, ...rect } : x)) })),

    toggleStart: () => set((s) => ({ startOpen: !s.startOpen })),
    closeStart: () => set({ startOpen: false }),

    pushTerm: (lines, cmd) =>
      set((s) => ({ term: [...s.term, ...lines], termHist: cmd ? [...s.termHist, cmd] : s.termHist })),
    clearTerm: (cmd) => set((s) => ({ term: [], termHist: cmd ? [...s.termHist, cmd] : s.termHist })),

    pickWall: (wall) => {
      set({ wall });
      saveWalls();
    },
    addWall: (url) => {
      const walls = [...get().walls, url].slice(-4);
      set({ walls, wall: walls.length - 1 });
      saveWalls();
    },
    removeWall: (i) => {
      const s = get();
      const walls = s.walls.filter((_, j) => j !== i);
      let wall = s.wall;
      if (wall === i) wall = "portrait";
      else if (typeof wall === "number" && wall > i) wall -= 1;
      set({ walls, wall });
      saveWalls();
    },
    replayBootNextVisit: () => {
      store.remove(K_VISITED);
      set({ settingsMsg: "Done — the boot screen will greet you next time." });
    },
  };
});

export const isMobile = (vw: number) => vw < MOBILE_BP;
