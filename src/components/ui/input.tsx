import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "min-h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-[14px] text-foreground caret-brand placeholder:text-neutral-500 hover:border-ink/45 focus-visible:border-brand focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive file:mr-3 file:border-0 file:bg-transparent file:font-heading file:text-sm file:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
