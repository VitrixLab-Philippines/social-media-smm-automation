import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  const session = await verifySession(request);
  const workspaceId = session?.workspaceId;

  let where: any = {};

  if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  if (platform && platform !== "all") {
    where.platform = platform;
  }

  // Use existing ContentDraft and Approval models for inbox items
  const [drafts, approvals] = await Promise.all([
    prisma.contentDraft.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.approval.findMany({
      where,
      orderBy: { approvedAt: "desc" },
      take: 20,
    }),
  ]);

  // Transform into inbox item format
  const items = [
    ...drafts.map((d: any) => ({
      id: d.id,
      type: "draft",
      topic: d.topic,
      platform: d.platform || "meta",
      status: d.status,
      createdAt: d.createdAt,
    })),
    ...approvals.map((a: any) => ({
      id: a.id,
      type: "approval",
      topic: d?.topic || "approval",
      platform: "meta",
      status: a.policyVersion,
      createdAt: a.approvedAt,
    })),
  ];

  const total = items.length;
  const unread = items.filter((i: any) => i.status !== "published").length;

  return NextResponse.json({
    items,
    total,
    unread,
    platform,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, topic, platform } = body;

    const session = await verifySession(request);
    const workspaceId = session?.workspaceId;

    if (!workspaceId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (type === "draft") {
      const draft = await prisma.contentDraft.create({
        data: {
          topic,
          platform: platform || "meta",
          status: "draft",
          workspaceId,
          text: "",
          hashtags: [],
          createdAt: new Date().toISOString(),
          author: "Marketing Team",
        },
      });

      return NextResponse.json({ success: true, draft }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to create engagement item" }, { status: 500 });
  }
}