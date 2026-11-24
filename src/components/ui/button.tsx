import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Classical buttons are outlined only — never filled.
 * default = primary (gold outline), secondary = hairline, ghost = gold text.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent bg-transparent font-heading text-[14px] font-semibold leading-[1.2] text-foreground no-underline transition-colors disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[15px]",
  {
    variants: {
      variant: {
        default:
          "border-brand text-brand hover:bg-brand/12 hover:text-brand active:bg-brand/22",
        secondary:
          "border-divider hover:bg-ink/7 hover:text-foreground active:bg-ink/14",
        ghost: "px-s1 text-brand hover:bg-brand/10 hover:text-brand active:bg-brand/18",
        destructive:
          "border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive",
        link: "text-brand-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "px-[16.56px] py-s2",
        sm: "px-3 py-1.5 text-[13px]",
        icon: "size-9 p-0",
        "icon-sm": "size-[30px] p-0",
      },
    },
    compoundVariants: [{ variant: "ghost", size: "default", className: "px-s1" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
