import type { NextRequest } from "next/server";

// Authentication options and helpers for Next.js API routes
// Used by middleware and route handlers to verify session

// Session cookie name
export const AUTH_COOKIE_NAME = "smmai_session";

// Session payload interface
export interface SessionPayload {
  userId: string;
  email: string;
  role: "admin" | "user";
  workspaceId: string;
  iat?: number;
  exp?: number;
}

// Verify session from request
// In production, this would validate a jwt or session cookie
export function verifySession(request: NextRequest): { valid: true; payload: SessionPayload } | { valid: false; reason: string } {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!cookie) {
    return { valid: false, reason: "No session cookie" };
  }

  // TODO: In production, verify JWT signature and expiration
  // const payload = jwt.verify(cookie.value, process.env.SESSION_SECRET!);
  // return { valid: true, payload };

  // For development: check if it's the demo session
  if (cookie.value === "demo-session") {
    return { valid: true, payload: { userId: "user_demo", email: "admin@smmai.com", role: "admin", workspaceId: "ws_demo" } };
  }

  return { valid: false, reason: "Invalid session" };
}

export default verifySession;