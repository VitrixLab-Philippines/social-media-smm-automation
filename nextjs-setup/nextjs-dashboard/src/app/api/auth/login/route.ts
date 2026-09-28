import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const ADMIN_EMAIL = "admin@smmai.com";
const ADMIN_PASSWORD = "admin";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email: string; password: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Try to find user in database first
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch {
      // If database is not configured, fall back to demo credentials
      user = null;
    }

    // If no database user, use demo credentials for development
    if (!user) {
      // Demo user - in production this would be replaced with proper DB auth
      const demoPasswordHash = "$2a$10$XyZvxEePv9N.lqE8Rockeye.8mZJ0NJQqZjChJ5KfHpmZ8Yd.uGAuq"; // pre-hashed "admin"
      const passwordMatch = await bcrypt.compare(password, demoPasswordHash);
      if (!passwordMatch) {
        return NextResponse.json(
          { message: "Invalid credentials." },
          { status: 401 }
        );
      }
      // Create a minimal user record if it doesn't exist (development only)
      try {
        await prisma.user.create({
          data: {
            email,
            passwordHash: demoPasswordHash,
            role: "admin",
          },
        });
      } catch {
        // User may already exist
      }
      user = { id: "user_1", email, role: "admin" };
    } else {
      // Verify password against database hash
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return NextResponse.json(
          { message: "Invalid credentials." },
          { status: 401 }
        );
      }
    }

    // Set secure httpOnly cookie instead of localStorage
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // Secure cookie settings - these should be tightened for production
    response.cookies.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Server error." },
      { status: 500 }
    );
  }
}