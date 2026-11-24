import "server-only";
import { createHash } from "node:crypto";

/**
 * Signed direct-to-Cloudinary uploads — the file never touches our server.
 * https://cloudinary.com/documentation/authentication_signatures
 */
export function signUploadParams(params: Record<string, string | number>) {
  const secret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!secret || !apiKey || !cloudName) throw new Error("Cloudinary is not configured");

  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + secret).digest("hex");
  return { signature, apiKey, cloudName };
}

/** Insert f_auto,q_auto (+ width) into a Cloudinary delivery URL. */
export function cldOptimise(url: string, width?: number) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const t = ["f_auto", "q_auto", width ? `w_${width},c_limit` : null].filter(Boolean).join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}
