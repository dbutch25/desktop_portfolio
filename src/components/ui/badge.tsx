import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-[3px] px-2.5 py-[3px] text-[11px] tracking-[0.02em]", {
  variants: {
    variant: {
      default: "bg-brand-100 text-brand-800",
      neutral: "bg-neutral-100 text-neutral-800",
      outline: "border border-brand text-brand",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
