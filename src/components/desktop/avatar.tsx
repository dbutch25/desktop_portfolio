/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

/** Circular portrait crop, scaled 1.9× around the face. */
export function Avatar({ src, alt, size, className }: { src: string; alt: string; size: number; className?: string }) {
  return (
    <span
      className={cn("block flex-none overflow-hidden rounded-full border border-brand bg-neutral-200", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="size-full max-w-none object-cover"
        style={{ objectPosition: "50% 28%", transform: "scale(1.9)", transformOrigin: "50% 30%" }}
      />
    </span>
  );
}
