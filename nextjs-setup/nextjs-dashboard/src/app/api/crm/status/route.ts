import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifySession(request);
  if (!session.valid) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const state = await ((prisma as any).systemState as any).upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json({ automationMode: null, dbHealth: true, workspaceId: session.payload.workspaceId });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    const session = await verifySession(request);
    if (!session.valid) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (type === "dryRun") {
      await ((prisma as any).systemState as any).upsert({
        where: { id: "singleton" },
        update: { dryRun: true },
        create: { id: "singleton", dryRun: true },
      });
      return NextResponse.json({ ok: true });
    }
    if (type === "health") {
      return NextResponse.json({ healthy: true });
    }
    if (type === "wasmRanking") {
      await ((prisma as any).systemState as any).upsert({
        where: { id: "singleton" },
        update: { wasmRanking: true },
        create: { id: "singleton", wasmRanking: true },
      });
      return NextResponse.json({ ranking: true });
    }

    return NextResponse.json({ error: "Failed to update system state" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Failed to update system state" }, { status: 500 });
  }
}
