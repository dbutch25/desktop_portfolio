"use client";

import { useRef, useState } from "react";
import { ExternalLink, ImageUp, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_BYTES = { image: 10 * 1024 * 1024, pdf: 10 * 1024 * 1024 };

/** Check the file's first bytes, not just its extension. */
async function sniff(file: File, kind: "image" | "pdf") {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  if (kind === "pdf") return hex.startsWith("25504446"); // %PDF
  return (
    hex.startsWith("ffd8ff") || // jpeg
    hex.startsWith("89504e47") || // png
    hex.startsWith("47494638") || // gif
    (hex.startsWith("52494646") && hex.slice(16, 24) === "57454250") || // webp
    hex.slice(8, 24).startsWith("66747970617669") // avif (ftypavi…)
  );
}

export function AssetField({
  id,
  name,
  kind,
  defaultValue,
  invalid,
}: {
  id: string;
  name: string;
  kind: "image" | "pdf";
  defaultValue: string;
  invalid?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const upload = async (f: File) => {
    if (f.size > MAX_BYTES[kind]) return toast.error("That file is over 10 MB.");
    if (!(await sniff(f, kind))) return toast.error(kind === "pdf" ? "That isn't a PDF." : "That isn't a supported image.");
    setBusy(true);
    try {
      const sig = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      }).then((r) => r.json());
      if (sig.error) throw new Error(sig.error);

      const body = new FormData();
      body.append("file", f);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", String(sig.timestamp));
      body.append("signature", sig.signature);
      body.append("folder", sig.folder);
      body.append("allowed_formats", sig.allowed_formats);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? "Upload failed");
      setUrl(json.secure_url);
      toast.success("Uploaded — remember to save.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input id={id} name={name} value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={invalid || undefined} placeholder="https://res.cloudinary.com/…" />
        <Button type="button" variant="secondary" disabled={busy} onClick={() => file.current?.click()}>
          {busy ? <LoaderCircle className="animate-spin" /> : <ImageUp />}
          Upload
        </Button>
        <input
          ref={file}
          type="file"
          hidden
          accept={kind === "pdf" ? "application/pdf" : "image/jpeg,image/png,image/webp,image/avif,image/gif"}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) upload(f);
          }}
        />
      </div>
      {url && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-24 w-fit max-w-full rounded-sm border border-divider object-contain" />
      )}
      {url && kind === "pdf" && (
        <a href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[13px]">
          Preview PDF <ExternalLink className="size-3.5" />
        </a>
      )}
    </div>
  );
}
