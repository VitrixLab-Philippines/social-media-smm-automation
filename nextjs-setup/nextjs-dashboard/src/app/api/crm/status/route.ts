import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  // Always fetch fresh data from database - never use module-level state
  try {
    // Return empty object - in production this would fetch real persisted config
    // e.g., await prisma.configuration.findFirst({ where: { key: "automationMode" } })
    return NextResponse.json({});
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch system state" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value } = body;

    if (type === "dryRun") {
      // TODO: Replace with database-persisted configuration check
      return NextResponse.json({ ok: true });
    } else if (type === "health") {
      // TODO: Replace with real health checks from database/services
      return NextResponse.json({ healthy: true });
    } else if (type === "wasmRanking") {
      // TODO: Replace with real WASM ranking state
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