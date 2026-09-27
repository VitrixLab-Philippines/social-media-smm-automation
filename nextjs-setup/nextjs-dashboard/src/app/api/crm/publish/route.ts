import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { draftId, platform } = payload;
  if (!draftId || !platform) {
    return NextResponse.json(
      { error: "draftId and platform are required" },
      { status: 400 }
    );
  }

  const job = await prisma.publishJob.create({
    data: {
      draftId: String(draftId),
      platform: String(platform),
      status: "PENDING",
    },
  });

  // Simulate async publishing
  setTimeout(async () => {
    try {
      await prisma.publishJob.update({
        where: { id: job.id },
        data: { status: "SUCCEEDED", completedAt: new Date() },
      });
      await prisma.contentDraft.update({
        where: { id: String(draftId) },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    } catch (err) {
      await prisma.publishJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: err instanceof Error ? err.message : "Unknown error",
          completedAt: new Date(),
        },
      });
    }
  }, 5000);

  return NextResponse.json({ job }, { status: 201 });
}