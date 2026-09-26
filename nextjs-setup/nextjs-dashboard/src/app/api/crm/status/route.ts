import { NextRequest, NextResponse } from "next/server";

let systemState = {
  health: "healthy",
  dryRun: true,
  wasmRanking: false,
  lastChecked: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  // Allow forced refresh to override caching
  if (!force) {
    const cacheControl = request.headers.get("cache-control");
    if (!cacheControl?.includes("no-store")) {
      return NextResponse.json(systemState, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
  }

  return NextResponse.json(systemState);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value } = body;

    if (type === "dryRun") {
      systemState.dryRun = value === true;
    } else if (type === "health") {
      systemState.health = value === "unhealthy" ? "unhealthy" : "healthy";
    } else if (type === "wasmRanking") {
      systemState.wasmRanking = value === true;
    }

    systemState.lastChecked = new Date().toISOString();

    return NextResponse.json(systemState);
  } catch {
    return NextResponse.json(
      { error: "Failed to update system state" },
      { status: 500 }
    );
  }
}