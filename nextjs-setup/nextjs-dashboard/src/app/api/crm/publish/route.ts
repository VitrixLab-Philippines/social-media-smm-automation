import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse, readJsonWithLimit, requireIdempotencyKey, requireSameOrigin } from "@/lib/security";
import { enqueuePublishJob, getQueueLength, getQueueStats } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req, { limit: 20, windowSeconds: 60, scope: "publish:create" });
  if (!limit.allowed) return rateLimitResponse(limit);
  if (!requireSameOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });

  const session = await verifySession(req);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (session.payload.role === "viewer") return NextResponse.json({ error: "Publishing permission required" }, { status: 403 });

  const idempotencyKey = requireIdempotencyKey(req);
  if (!idempotencyKey) return NextResponse.json({ error: "Idempotency-Key header is required" }, { status: 400 });

  let payload: { draftId?: unknown; platform?: unknown };
  try {
    payload = await readJsonWithLimit(req);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "Payload too large" : "Invalid JSON" }, { status: 400 });
  }

  const draftId = typeof payload.draftId === "string" ? payload.draftId : "";
  const platform = typeof payload.platform === "string" ? payload.platform.toLowerCase() : "";
  if (!draftId || !platform || platform.length > 32) {
    return NextResponse.json({ error: "draftId and platform are required" }, { status: 400 });
  }

  const requestHash = crypto.createHash("sha256").update(JSON.stringify({ draftId, platform })).digest("hex");
  const existing = await prisma.idempotencyRecord.findUnique({
    where: { workspaceId_key: { workspaceId: session.payload.workspaceId, key: idempotencyKey } },
  });
  if (existing) {
    if (existing.requestHash !== requestHash) return NextResponse.json({ error: "Idempotency-Key was reused with a different request" }, { status: 409 });
    return NextResponse.json(existing.response ?? { status: "accepted" }, { status: existing.statusCode ?? 200, headers: { "Idempotent-Replay": "true" } });
  }

  const draft = await prisma.contentDraft.findUnique({ where: { id: draftId } });
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  if (draft.workspaceId !== session.payload.workspaceId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (draft.status !== "APPROVED") return NextResponse.json({ error: "Only approved drafts may be published" }, { status: 409 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const job = await tx.publishJob.create({
        data: {
          workspaceId: session.payload.workspaceId,
          draftId,
          platform,
          status: "PENDING",
          idempotencyKey,
        },
      });
      const responseBody = { status: "accepted", draftId, platform, jobId: job.id };
      const record = await tx.idempotencyRecord.create({
        data: {
          workspaceId: session.payload.workspaceId,
          key: idempotencyKey,
          requestHash,
          statusCode: 202,
          response: responseBody,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      await tx.contentDraft.update({ where: { id: draftId }, data: { status: "SCHEDULED" } });
      return { job, record, responseBody };
    });

    await enqueuePublishJob({
      jobId: result.job.id,
      workflowId: "default",
      workspaceId: session.payload.workspaceId,
      socialAccountId: platform,
      contentRevisionId: draftId,
      idempotencyKey,
      type: "publish.requested",
      version: 1,
    });

    return NextResponse.json({ ...result.responseBody, idempotencyRecordId: result.record.id }, { status: 202 });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "P2002") {
      const replay = await prisma.idempotencyRecord.findUnique({ where: { workspaceId_key: { workspaceId: session.payload.workspaceId, key: idempotencyKey } } });
      if (replay?.requestHash === requestHash) return NextResponse.json(replay.response ?? { status: "accepted" }, { status: replay.statusCode ?? 202, headers: { "Idempotent-Replay": "true" } });
      return NextResponse.json({ error: "Idempotency-Key conflict" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to enqueue publish job" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await verifySession(req);
  if (!session.valid) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  if (action === "stats") return NextResponse.json(await getQueueStats());
  if (action === "queue-length") return NextResponse.json({ pending: await getQueueLength() });
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
