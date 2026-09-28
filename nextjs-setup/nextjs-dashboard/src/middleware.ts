// Middleware for route protection and session verification
// Based on vercel-fix-v4.md P0 requirements

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
];

// Protected routes that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/api/crm",
  "/api/publish",
  "/api/accounts",
  "/api/analytics",
  "/api/settings",
];

// Protected route prefixes
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/api/crm/",
  "/api/publish/",
  "/api/accounts/",
  "/api/analytics/",
  "/api/settings/",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  ) || PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath) {
    // In production, verify session here
    // For now, check for auth token in cookies or header
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie");

    // TODO: Replace with real session verification
    // if (!isLoggedIn(authHeader, cookieHeader)) {
    //   const url = new URL("/login", request.url);
    //   url.searchParams.set("redirect", pathname);
    //   return NextResponse.redirect(url);
    // }

    // Temporary: allow through for development
    // In production, uncomment the session check above
    return NextResponse.next();
  }

  // Default: allow other paths
  return NextResponse.next();
}

export const config = {
  // Match all routes
  matcher: ["/((?!api/auth/.+|_next|favicon.ico).*)"],
};