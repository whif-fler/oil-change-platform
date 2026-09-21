import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, getSessionCookieValue } from "@/lib/auth-edge";

// ─── Route patterns ───────────────────────────────────────

const PROTECTED_ROUTES = ["/dashboard"];
const PROTECTED_API_ROUTES = ["/api/dashboard"];

function isProtectedPath(pathname: string): boolean {
  return (
    PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/")) ||
    PROTECTED_API_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))
  );
}

function isApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

// ─── Middleware ────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect specific routes
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Full HMAC-SHA256 session verification via Web Crypto API
  const cookieValue = getSessionCookieValue(request);
  const user = cookieValue !== null ? await verifySession(cookieValue) : null;

  if (user) {
    return NextResponse.next();
  }

  // No valid session — respond based on request type
  if (isApiPath(pathname)) {
    // API routes: return 401 JSON (no redirect)
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 },
    );
  }

  // Browser navigation: redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
  ],
};
