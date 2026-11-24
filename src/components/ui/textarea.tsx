import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[90px] w-full resize-y rounded-md border border-input bg-transparent px-2.5 py-1.5 text-[14px] text-foreground caret-brand placeholder:text-neutral-500 hover:border-ink/45 focus-visible:border-brand focus-visible:outline-offset-0 disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
