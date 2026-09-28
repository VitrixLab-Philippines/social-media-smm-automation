import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifySession(request);
  if (!session.valid) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const dbHealth = await prisma.$queryRaw`SELECT 1 AS healthy`;
    return NextResponse.json({
      automationMode: null,
      dbHealth,
      workspaceId: session.payload.workspaceId,
    });
  } catch (error: unknown) {
    console.error("CRM status error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch system state",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    const session = await verifySession(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (type === "dryRun") return NextResponse.json({ ok: true });
    if (type === "health") return NextResponse.json({ healthy: true });
    if (type === "wasmRanking") return NextResponse.json({ ranking: false });

    return NextResponse.json({ error: "Failed to update system state" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Failed to update system state" }, { status: 500 });
  }
}
