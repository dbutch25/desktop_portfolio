"use client";

import { useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteButton({ action, label = "Delete", confirmText }: { action: () => Promise<void>; label?: string; confirmText: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        start(async () => {
          try {
            await action();
            toast.success("Deleted.");
          } catch (e) {
            // redirect() inside the action surfaces as a thrown NEXT_REDIRECT — let it through.
            if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
            toast.error("Couldn't delete.");
          }
        });
      }}
    >
      {pending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
      {label}
    </Button>
  );
}
