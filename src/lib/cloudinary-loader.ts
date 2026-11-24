"use client";

import type { ImageLoaderProps } from "next/image";

/** next/image loader: lets Cloudinary resize + pick AVIF/WebP instead of the Next optimiser. */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) return src;
  return src.replace("/upload/", `/upload/f_auto,q_${quality ?? "auto"},w_${width},c_limit/`);
}
