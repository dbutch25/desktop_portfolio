import type { FieldDef } from "@/components/admin/record-form";

export const PROJECT_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", span: 4 },
  { name: "fileName", label: "File name", span: 2, placeholder: "skincan.proj" },
  { name: "client", label: "Kicker / client", span: 3, placeholder: "Custom CMS" },
  { name: "url", label: "Live site", type: "url", span: 3 },
  { name: "summary", label: "Summary (italic standfirst)", type: "textarea", rows: 2 },
  { name: "stack", label: "Stack", type: "textarea", rows: 4, span: 3, hint: "One technology per line." },
  { name: "figures", label: "Figures", type: "textarea", rows: 4, span: 3, hint: "One per line: 45 | tests on every push" },
  { name: "bullets", label: "What I did", type: "textarea", rows: 6, hint: "One bullet per line." },
  { name: "screenshotUrl", label: "Screenshot (16:9)", type: "image" },
  { name: "order", label: "Order", type: "number", span: 2 },
  { name: "draft", label: "Draft (shows a Draft tag)", type: "switch", span: 4 },
];
