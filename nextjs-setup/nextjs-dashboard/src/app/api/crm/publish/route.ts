import { NextRequest, NextResponse } from "next/server";
import { ContentDraft, DraftStatus } from "@/lib/crm";

type Job = {
  id: string;
  draftId: string;
  platform: string;
  status: "pending" | "succeeded" | "failed";
  createdAt: string;
  completedAt?: string;
  error?: string;
};

// In-memory store for publish jobs
const publishJobs: Record<string, Job[]> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { draftId, platform } = body;

    if (!draftId || !platform) {
      return NextResponse.json(
        { error: "draftId and platform are required" },
        { status: 400 }
      );
    }

    const jobId = `publish-${Date.now().toString().slice(-4)}`;
    const job: Job = {
      id: crypto.randomUUID(),
      draftId: String(draftId),
      platform: String(platform),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    publishJobs[jobId] = publishJobs[jobId] ?? [];
    publishJobs[jobId].push(job);

    // Simulate async publish job - in production this would call external API
    setTimeout(() => {
      // Simulate successful publish
      const job = publishJobs[jobId]?.find((j) => j.id === jobId);
      if (job) {
        job.status = "succeeded";
        job.completedAt = new Date().toISOString();
      }
    }, 1500);

    return NextResponse.json({ success: true, jobId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create publish job" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (jobId && publishJobs[jobId]) {
    return NextResponse.json({ job: publishJobs[jobId][0] });
  }

  // Return all jobs
  const allJobs = Object.values(publishJobs).flat();
  return NextResponse.json({ jobs: allJobs });
}