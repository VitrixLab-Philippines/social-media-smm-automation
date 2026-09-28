// Health check endpoint per vercel-fix-v4.md requirements
// Provides liveness, readiness, and integration health checks

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const check = searchParams.get("check");

  // Liveness check - is the process running?
  const liveness = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  // Readiness check - can the service reach dependencies?
  const readiness = await checkReadiness();

  // Integration health
  const integration = await checkIntegrationHealth();

  // Determine overall status
  const overall = readiness.status === "ok" && integration.status === "ok"
    ? "healthy"
    : "unhealthy";

  return NextResponse.json({
    liveness,
    readiness,
    integration,
    overall,
  });
}

async function checkReadiness() {
  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    const db = { status: "ok", detailed: "PostgreSQL connected" };
    return { status: "ok", checks: { db } };
  } catch (error) {
    const db = { status: "unhealthy", detailed: String(error) };
    return { status: "unhealthy", checks: { db } };
  }
}

async function checkIntegrationHealth() {
  // Check webhook events table accessibility
  try {
    await prisma.webhookEvent.count();
    return { status: "ok", detailed: "Webhook events table accessible" };
  } catch (error) {
    return { status: "unhealthy", detailed: String(error) };
  }
}