"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/types/content";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const v = useContext(ContentContext);
  if (!v) throw new Error("useContent must be used inside <ContentProvider>");
  return v;
}
