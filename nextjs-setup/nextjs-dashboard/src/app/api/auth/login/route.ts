import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 *
 * Demo auth endpoint. Validates email/password and returns a mock token.
 * Demo credentials: admin@smmai.com / admin
 *
 * NOTE: This is a demo stub. Replace with real auth (NextAuth, Clerk, etc.)
 * in production.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Demo stub — replace with real auth
    if (
      email.trim() === "admin@smmai.com" &&
      password.trim() === "admin"
    ) {
      return NextResponse.json({
        token: "demo-token-smmai-" + Date.now(),
        user: { email, role: "admin" },
      });
    }

    return NextResponse.json(
      { message: "Invalid credentials. Demo: admin@smmai.com / admin" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: "Server error." },
      { status: 500 }
    );
  }
}
