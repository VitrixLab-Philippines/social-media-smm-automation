import { NextRequest, NextResponse } from "next/server";
import { initialDrafts, ContentDraft, DraftStatus } from "@/lib/crm";

// In-memory store for session persistence
const drafts: ContentDraft[] = [...initialDrafts];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  let filtered = [...drafts];
  if (status && status !== "all") {
    filtered = filtered.filter((d) => d.status === status);
  }
  if (platform && platform !== "all") {
    filtered = filtered.filter((d) => d.platform === platform);
  }

  return NextResponse.json({
    drafts: filtered,
    total: drafts.length,
    counts: {
      all: drafts.length,
      pending: drafts.filter((d) => d.status === "pending").length,
      approved: drafts.filter((d) => d.status === "approved").length,
      draft: drafts.filter((d) => d.status === "draft").length,
      rejected: drafts.filter((d) => d.status === "rejected").length,
      published: drafts.filter((d) => d.status === "published").length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: DraftStatus };

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const index = drafts.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    drafts[index] = {
      ...drafts[index],
      status,
    };

    return NextResponse.json({ success: true, draft: drafts[index] });
  } catch {
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newDraft: ContentDraft = {
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

    drafts.unshift(newDraft);
    return NextResponse.json({ success: true, draft: newDraft }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create draft" }, { status: 500 });
  }
}
