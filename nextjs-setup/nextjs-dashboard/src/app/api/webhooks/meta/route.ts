// Meta webhook endpoint with signature verification + queue processing
// Per vercel-fix-v4.md requirements:
// - Verify signature
// - Persist raw event metadata
// - Deduplicate
// - Enqueue processing
// - Acknowledge quickly
// - Process asynchronously

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  enqueuePublishJob,
  getQueueLength,
  getDLQLength,
  addToDLQ,
  getQueueStats,
} from "@/lib/queue";
import crypto from "crypto";

// Meta webhook configuration
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "smmai_webhook_secret";

// Parse Meta webhook payload
function parseMetaPayload(payload: any) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const entry = payload.entry?.[0];
  if (!entry) {
    return null;
  }

  const changes = entry.changes?.[0];
  if (!changes) {
    return null;
  }

  return {
    object: payload.object,
    entryId: entry.id,
    time: entry.time,
    metadata: changes.field === "feed" ? changes.value : {},
    status: changes.value?.status,
    postId: changes.value?.media?.id || changes.value?.id,
    message: changes.value?.message,
    recipient: changes.value?.recipient?.id,
  };
}

// Verify Meta webhook signature
function verifyMetaSignature(body: string, signature: string): boolean {
  if (!signature) {
    return false;
  }

  const hmac = crypto.createHmac("sha256", VERIFY_TOKEN);
  const calculated = hmac.update(body).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(calculated, "hex"),
    Buffer.from(signature, "hex")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256") ||
                     request.headers.get("x-signature") ||
                     "";

    // Verify signature
    const isValid = verifyMetaSignature(body, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse payload
    const parsed = parseMetaPayload(JSON.parse(body));

    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // Deduplicate: check if this event already been processed
    const existingEvent = await prisma.webhookEvent.findFirst({
      where: {
        platform: "meta",
        eventId: parsed.entryId,
      },
    });

    if (existingEvent) {
      // Already processed - acknowledge quickly
      return NextResponse.json({ status: "duplicate" }, { status: 200 });
    }

    // Persist raw event metadata BEFORE enqueuing
    await prisma.webhookEvent.create({
      data: {
        platform: "meta",
        eventId: parsed.entryId,
        status: parsed.status,
        postId: parsed.postId,
        receivedAt: new Date(),
        rawPayload: body,
      },
    });

    // Enqueue for asynchronous processing (publish job)
    await enqueuePublishJob({
      jobId: `webhook_${parsed.entryId}`,
      workflowId: "meta_webhook",
      workspaceId: "ws_default",
      socialAccountId: "meta_account",
      contentRevisionId: parsed.postId || "",
      idempotencyKey: parsed.entryId,
    });

    // Acknowledge quickly - return 200 within seconds
    // Processing happens in background worker
    return NextResponse.json(
      { status: "received", eventId: parsed.entryId },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// GET endpoint for Meta webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  const token = searchParams.get("token");
  const challenge = searchParams.get("challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return NextResponse.json({ challenge }, { status: 200 });
  }

  return NextResponse.json(
    { error: "Verification failed" },
    { status: 403 }
  );
}