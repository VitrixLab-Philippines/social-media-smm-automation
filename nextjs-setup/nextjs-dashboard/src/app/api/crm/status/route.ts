import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  // Verify session - enforce authentication
  const session = await verifySession();
  if (!session.valid) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const workspaceId = session.payload?.workspaceId;

  // Fetch persisted configuration from database
  try {
    // Check automation mode for this workspace
    const automationMode = await prisma.notification.findFirst({
      where: { 
        OR: [
          { title: "automation_mode" }, 
          { data: { key: "automation_mode" } }
        ]
      },
      select: { title: true }
    });

    // Check integration health
    const dbHealth = await prisma.$queryRaw`SELECT 1 AS healthy`;

    return NextResponse.json({ automationMode, dbHealth });
  } catch (error) {
    console.error("CRM status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch system state", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value } = body;

    if (type === "dryRun") {
      return NextResponse.json({ ok: true });
    } else if (type === "health") {
      return NextResponse.json({ healthy: true });
    } else if (type === "wasmRanking") {
      return NextResponse.json({ ranking: false });
    }

    return NextResponse.json(
      { error: "Failed to update system state" },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to update system state" },
      { status: 500 }
    );
  }
}