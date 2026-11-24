"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/actions/contact";
import type { FieldErrors } from "@/lib/validation";
import { useContent } from "../content-context";

type Draft = { name: string; email: string; subject: string; body: string; company: string };
const EMPTY: Draft = { name: "", email: "", subject: "", body: "", company: "" };

// Draft survives closing/reopening the window during a session.
let saved: Draft = EMPTY;

export function MailApp() {
  const { profile } = useContent();
  const [draft, setDraft] = useState<Draft>(saved);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...draft, [k]: e.target.value };
    saved = next;
    setDraft(next);
    setStatus(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await sendContactMessage(draft);
      setErrors(res?.errors ?? {});
      setStatus({ ok: !!res?.ok, text: res?.message ?? "" });
      if (res?.ok) {
        saved = EMPTY;
        setDraft(EMPTY);
      }
    });
  };

  const err = (k: keyof Draft) => errors[k]?.[0];

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-s3 overflow-auto px-s4 py-s3">
        <div className="flex flex-wrap items-baseline gap-s2 border-b border-divider pb-s2 text-[14px]">
          <span className="w-14 text-[12px] text-neutral-700">To</span>
          <span>
            {profile.name} &lt;{profile.email}&gt;
          </span>
        </div>
        <div className="grid gap-s3 sm:grid-cols-2">
          <Field id="mail-name" label="Your name" error={err("name")}>
            <Input id="mail-name" value={draft.name} onChange={set("name")} placeholder="Jane Recruiter" autoComplete="name" aria-invalid={!!err("name")} />
          </Field>
          <Field id="mail-email" label="Your email" error={err("email")}>
            <Input id="mail-email" type="email" value={draft.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" aria-invalid={!!err("email")} />
          </Field>
        </div>
        <Field id="mail-subject" label="Subject" error={err("subject")}>
          <Input id="mail-subject" value={draft.subject} onChange={set("subject")} placeholder={`${profile.title} role at …`} />
        </Field>
        <Field id="mail-body" label="Message" error={err("body")} grow>
          <Textarea
            id="mail-body"
            value={draft.body}
            onChange={set("body")}
            placeholder={`Hi ${profile.name.split(" ")[0]},`}
            className="min-h-[140px] flex-1"
            aria-invalid={!!err("body")}
          />
        </Field>
        {/* Honeypot */}
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          name="company"
          value={draft.company}
          onChange={set("company")}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
      </div>
      <div className="flex flex-none flex-wrap items-center gap-s3 border-t border-divider px-s4 py-s3">
        <Button type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" strokeWidth={1.5} /> : <Send strokeWidth={1.5} />}
          Send
        </Button>
        <span className={"text-[12px] " + (status && !status.ok ? "text-destructive" : "text-neutral-700")} aria-live="polite">
          {status?.text ?? "Goes straight to Daniel’s inbox."}
        </span>
        <span className="ml-auto flex flex-wrap gap-s3 text-[13px]">
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener">
              LinkedIn
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener">
              GitHub
            </a>
          )}
          {profile.phone && <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}>{profile.phone}</a>}
        </span>
      </div>
    </form>
  );
}

function Field({ id, label, error, grow, children }: { id: string; label: string; error?: string; grow?: boolean; children: React.ReactNode }) {
  return (
    <div className={grow ? "flex flex-1 flex-col" : undefined}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="m-0 mt-1 text-[12px] text-destructive">{error}</p>}
    </div>
  );
}
