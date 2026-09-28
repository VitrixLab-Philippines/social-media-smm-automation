import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifySession(request);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const workspaceId = session.payload.workspaceId;

  const [clients, leads, openOpportunities, pendingApprovals, scheduledJobs, failedJobs, connectedAccounts, recentActivities] = await Promise.all([
    prisma.client.count({ where: { workspaceId } }),
    prisma.lead.count({ where: { workspaceId, status: { in: ["NEW", "QUALIFIED", "WORKING"] } } }),
    prisma.opportunity.count({ where: { workspaceId, status: "OPEN" } }),
    prisma.contentDraft.count({ where: { workspaceId, status: "PENDING" } }),
    prisma.publishJob.count({ where: { workspaceId, status: "PENDING" } }),
    prisma.publishJob.count({ where: { workspaceId, status: "FAILED" } }),
    prisma.socialAccount.count({ where: { workspaceId, isActive: true } }),
    prisma.activity.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({
    metrics: { clients, leads, openOpportunities, pendingApprovals, scheduledJobs, failedJobs, connectedAccounts },
    recentActivities,
  });
}
