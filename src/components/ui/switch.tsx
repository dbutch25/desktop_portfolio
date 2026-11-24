"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-divider bg-surface transition-colors data-[state=checked]:border-brand data-[state=checked]:bg-brand-200",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-3.5 translate-x-0.5 rounded-full bg-neutral-600 transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-brand-700" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
