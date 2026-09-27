import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initialDrafts } from "@/lib/crm";

const DraftStatus = ["draft", "pending", "approved", "rejected", "scheduled", "published"] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  let filtered = [...initialDrafts];

  if (status && status !== "all") {
    filtered = filtered.filter((d: any) => d.status === status);
  }
  if (platform && platform !== "all") {
    filtered = filtered.filter((d: any) => d.platform === platform);
  }

  return NextResponse.json({
    drafts: filtered,
    total: filtered.length,
    counts: {
      all: filtered.length,
      pending: filtered.filter((d: any) => d.status === "pending").length,
      approved: filtered.filter((d: any) => d.status === "approved").length,
      draft: filtered.filter((d: any) => d.status === "draft").length,
      rejected: filtered.filter((d: any) => d.status === "rejected").length,
      published: filtered.filter((d: any) => d.status === "published").length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    // In v3 with Prisma, we would update the DB
    // For now, just return success
    return NextResponse.json({ success: true, draft: { id, status } });
  } catch {
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newDraft: any = {
      id: `draft-${Date.now().toString().slice(-4)}`,
      topic: body.topic || "Untitled Campaign Draft",
      platform: body.platform || "instagram",
      text: body.text || "",
      hashtags: body.hashtags || [],
      status: "pending",
      createdAt: new Date().toISOString(),
      author: body.author || "Marketing Team",
      engagementScore: Math.floor(Math.random() * 20) + 75,
    };

    // In v3 with Prisma, we would create in the DB
    // For now, just return success
    return NextResponse.json({ success: true, draft: newDraft }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create draft" }, { status: 500 });
  }
}