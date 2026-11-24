import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 proxy (formerly middleware). Optimistic gate only — it checks a
 * session cookie exists. The real admin check happens in requireAdmin() /
 * assertAdmin() on the server, next to the data.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  if (!getSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
