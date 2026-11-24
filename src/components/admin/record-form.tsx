"use client";

import { startTransition, useActionState, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/validation";
import { AssetField } from "./asset-field";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "url" | "email" | "number" | "textarea" | "switch" | "select" | "image" | "pdf";
  hint?: string;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  /** Grid columns this field spans (out of 6). */
  span?: 1 | 2 | 3 | 4 | 6;
  step?: string;
};

type Props = {
  fields: FieldDef[];
  defaults?: Record<string, string | number | boolean | null | undefined>;
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  submitLabel?: string;
  /** Clear the form after a successful save (for "Add new" forms). */
  resetOnSuccess?: boolean;
  footer?: React.ReactNode;
  className?: string;
};

const SPAN: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  6: "sm:col-span-6",
};

export function RecordForm({ fields, defaults = {}, action, submitLabel = "Save", resetOnSuccess, footer, className }: Props) {
  const [formKey, setFormKey] = useState(0);
  const [state, formAction, pending] = useActionState(async (prev: ActionState, fd: FormData) => {
    const res = await action(prev, fd);
    if (res?.ok) {
      toast.success(res.message ?? "Saved.");
      if (resetOnSuccess) setFormKey((k) => k + 1);
    } else if (res) toast.error(res.message ?? "Couldn't save.");
    return res;
  }, null);

  const errors = state && !state.ok ? state.errors ?? {} : {};

  return (
    <form
      key={formKey}
      noValidate
      // Submit manually: React 19 resets uncontrolled fields after a form `action`,
      // which would wipe the user's input whenever validation fails.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
      className={cn("grid grid-cols-1 gap-s3 sm:grid-cols-6", className)}
    >
      {fields.map((f) => {
        const id = `${f.name}-${formKey}`;
        const err = errors[f.name]?.[0];
        const dv = defaults[f.name];
        const common = { id, name: f.name, placeholder: f.placeholder, "aria-invalid": !!err || undefined };
        return (
          <div key={f.name} className={cn("col-span-1", SPAN[f.span ?? 6])}>
            {f.type === "switch" ? (
              <SwitchField id={id} name={f.name} label={f.label} defaultChecked={!!dv} />
            ) : (
              <Label htmlFor={id}>{f.label}</Label>
            )}
            {(f.type ?? "text") === "text" || f.type === "url" || f.type === "email" ? (
              <Input {...common} type={f.type === "url" ? "url" : f.type === "email" ? "email" : "text"} defaultValue={(dv as string) ?? ""} />
            ) : f.type === "number" ? (
              <Input {...common} type="number" step={f.step ?? "1"} defaultValue={(dv as number) ?? 0} />
            ) : f.type === "textarea" ? (
              <Textarea {...common} rows={f.rows ?? 4} defaultValue={(dv as string) ?? ""} />
            ) : f.type === "select" ? (
              <select
                {...common}
                defaultValue={(dv as string) ?? f.options?.[0]?.value}
                className="min-h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-[14px] hover:border-ink/45 focus-visible:border-brand focus-visible:outline-offset-0"
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "image" || f.type === "pdf" ? (
              <AssetField id={id} name={f.name} kind={f.type} defaultValue={(dv as string) ?? ""} invalid={!!err} />
            ) : null}
            {err ? (
              <p className="m-0 mt-1 text-[12px] text-destructive">{err}</p>
            ) : f.hint ? (
              <p className="m-0 mt-1 text-[12px] text-neutral-600">{f.hint}</p>
            ) : null}
          </div>
        );
      })}
      <div className="col-span-1 flex flex-wrap items-center gap-s2 pt-s1 sm:col-span-6">
        <Button type="submit" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin" />}
          {submitLabel}
        </Button>
        {footer}
      </div>
    </form>
  );
}

function SwitchField({ id, name, label, defaultChecked }: { id: string; name: string; label: string; defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center gap-2.5 pt-5">
      <Switch id={id} checked={on} onCheckedChange={setOn} />
      <input type="hidden" name={name} value={on ? "true" : ""} />
      <Label htmlFor={id} className="mb-0 text-[14px] text-foreground">
        {label}
      </Label>
    </div>
  );
}
