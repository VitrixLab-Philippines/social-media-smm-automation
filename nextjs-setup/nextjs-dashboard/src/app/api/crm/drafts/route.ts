import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse, readJsonWithLimit, requireSameOrigin } from "@/lib/security";

export async function GET(request: NextRequest) {\n  const limit = await checkRateLimit(request, { limit: 120, scope: "crm:drafts:read" });\n  if (!limit.allowed) return rateLimitResponse(limit);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  const session = await verifySession(request);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const workspaceId = session.payload.workspaceId;

  let filtered = await prisma.contentDraft.findMany({
    where: { workspaceId },
  });

  if (status && status !== "all") {
    filtered = filtered.filter((d: any) => d.status === status.toUpperCase());
  }
  if (platform && platform !== "all") {
    filtered = filtered.filter((d: any) => d.platform === platform);
  }

  const counts = {
    all: filtered.length,
    pending: filtered.filter((d: any) => d.status === "PENDING").length,
    approved: filtered.filter((d: any) => d.status === "APPROVED").length,
    draft: filtered.filter((d: any) => d.status === "DRAFT").length,
    rejected: filtered.filter((d: any) => d.status === "REJECTED").length,
    published: filtered.filter((d: any) => d.status === "PUBLISHED").length,
  };

  return NextResponse.json({
    drafts: filtered,
    total: filtered.length,
    counts,
  });
}

export async function POST(request: NextRequest) {\n  const limit = await checkRateLimit(request, { limit: 60, scope: "crm:drafts:write" });\n  if (!limit.allowed) return rateLimitResponse(limit);\n  if (!requireSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  const session = await verifySession(request);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const body = await readJsonWithLimit(request);
    const newDraft: any = {
      topic: body.topic || "Untitled Campaign Draft",
      platform: body.platform || "instagram",
      text: body.text || "",
      hashtags: body.hashtags || [],
      status: "PENDING",
      createdAt: new Date().toISOString(),
      author: body.author || "Marketing Team",
    };

    const draft = await prisma.contentDraft.create({
      data: {
        ...newDraft,
        workspaceId: session.valid ? session.payload.workspaceId : undefined,
      },
    });

    return NextResponse.json({ success: true, draft }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create draft" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {\n  const limit = await checkRateLimit(request, { limit: 60, scope: "crm:drafts:write" });\n  if (!limit.allowed) return rateLimitResponse(limit);\n  if (!requireSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  const session = await verifySession(request);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    // RBAC: verify draft belongs to current workspace
    const existingDraft = await prisma.contentDraft.findUnique({
      where: { id },
    });

    if (existingDraft?.workspaceId !== (session.valid ? session.payload.workspaceId : undefined)) {
      return NextResponse.json(
        { error: "Forbidden: draft does not belong to your workspace" },
        { status: 403 }
      );
    }

    const draft = await prisma.contentDraft.update({
      where: { id },
      data: { status: status.toUpperCase() as "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "SCHEDULED" | "PUBLISHED" },
    });

    return NextResponse.json({ success: true, draft });
  } catch {
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {\n  const limit = await checkRateLimit(request, { limit: 30, scope: "crm:drafts:delete" });\n  if (!limit.allowed) return rateLimitResponse(limit);\n  if (!requireSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  const session = await verifySession(request);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const body = await request.json();
    const { id } = body as { id: string };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // RBAC: verify draft belongs to current workspace
    const existingDraft = await prisma.contentDraft.findUnique({
      where: { id },
    });

    if (existingDraft?.workspaceId !== (session.valid ? session.payload.workspaceId : undefined)) {
      return NextResponse.json(
        { error: "Forbidden: draft does not belong to your workspace" },
        { status: 403 }
      );
    }

    await prisma.contentDraft.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 });
  }
}