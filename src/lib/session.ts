import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Use in admin pages/layouts: redirects to the login page when not an admin. */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/admin/login");
  return session;
}

/** Use in server actions / route handlers: throws instead of redirecting. */
export async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");
  return session;
}
