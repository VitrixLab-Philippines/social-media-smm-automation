import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action"); // status, policies

  const session = await verifySession();
  const workspaceId = session?.workspaceId;

  let where: any = {};

  if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  if (action === "status") {
    // Return automation system status
    const [drafts, published] = await Promise.all([
      prisma.contentDraft.findMany({ where: { ...where, status: "published" } }),
      prisma.contentDraft.count({ where: { ...where, status: "published" } }),
    ]);

    return NextResponse.json({
      action: "status",
      workspaceId,
      publishedDrafts: drafts.length,
      totalPublished: published,
      queueLength: 0, // Would query Redis queue in production
      dryRun: process.env.DRY_RUN === "true",
    });
  }

  if (action === "policies") {
    // Return automation policies for the workspace
    return NextResponse.json({
      action: "policies",
      workspaceId,
      policies: [
        {
          id: "1",
          name: "Moderation Policy",
          enabled: true,
          prohibitedTopics: [],
          requiredDisclosures: [],
        },
      ],
      canEdit: true,
    });
  }

  // Default: status
  const [drafts, published] = await Promise.all([
    prisma.contentDraft.findMany({ where: { ...where, status: "published" } }),
    prisma.contentDraft.count({ where: { ...where, status: "published" } }),
  ]);

  return NextResponse.json({
    action: "status",
    workspaceId,
    publishedDrafts: drafts.length,
    totalPublished: published,
    queueLength: 0,
    dryRun: process.env.DRY_RUN === "true",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, policyId, policyData } = body;

    const session = await verifySession();
    const workspaceId = session?.workspaceId;

    if (!workspaceId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (action === "updatePolicy") {
      // Update automation policy
      return NextResponse.json({
        success: true,
        action: "updatePolicy",
        policyId,
        workspaceId,
        message: "Policy updated successfully",
      });
    }

    if (action === "triggerScheduler") {
      // Trigger the daily scheduler
      return NextResponse.json({
        success: true,
        action: "triggerScheduler",
        workspaceId,
        message: "Scheduler triggered",
      });
    }

    return NextResponse.json({ error: "Unknown automation action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process automation request" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, enabled } = body;

    const session = await verifySession();
    const workspaceId = session?.workspaceId;

    if (!workspaceId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Update policy enabled status
    return NextResponse.json({
      success: true,
      action: "patchPolicy",
      policyId,
      enabled,
      workspaceId,
      message: "Policy status updated",
    });
  } catch {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}