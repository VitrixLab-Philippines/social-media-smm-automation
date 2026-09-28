// Simple queue service using Redis directly
// Per vercel-fix-v4.md: durable queue for publishing jobs
// Uses Redis ZSET for ordered queue, SET for job data

import Redis from "ioredis";

// Redis client instance
const redis = new Redis();

// Queue keys
const PUBLISH_QUEUE = "smmai:queue:publish";
const DEAD_LETTER_QUEUE = "smmai:dlq:publish";
const FAILURE_COUNTER_PREFIX = "smmai:failure:";

// Job types
export type PublishJobEvent = {
  type: "publish.requested";
  version: 1;
  jobId: string;
  workflowId: string;
  workspaceId: string;
  socialAccountId: string;
  contentRevisionId: string;
  idempotencyKey: string;
};

// Enqueue a publish job
export const enqueuePublishJob = async (event: PublishJobEvent): Promise<string> => {
  const key = `${PUBLISH_QUEUE}:${event.jobId}`;

  // Check if job already exists (idempotency)
  const exists = await redis.exists(key);
  if (exists) {
    return event.jobId;
  }

  // Set job with TTL (7 days) and JSON payload
  await redis.set(key, JSON.stringify(event), "EX", 604800); // 7 days

  // Add to sorted queue by score (timestamp)
  await redis.zadd(PUBLISH_QUEUE, Date.now(), event.jobId);

  return event.jobId;
};

// Dequeue a publish job (worker claims)
export const dequeuePublishJob = async (): Promise<{
  jobId: string;
  event: PublishJobEvent | null;
}> => {
  // Pop the first job from the sorted set
  const jobId = await redis.zpopmin(PUBLISH_QUEUE);

  if (!jobId || jobId.length === 0) {
    return { jobId: "", event: null };
  }

  const [id] = jobId;
  const raw = await redis.get(`${PUBLISH_QUEUE}:${id}`);

  if (!raw) {
    return { jobId: id, event: null };
  }

  const event: PublishJobEvent = JSON.parse(raw);

  // Check for dead-letter condition (5+ failures)
  const failureCount = await redis.get(
    `${FAILURE_COUNTER_PREFIX}${jobId}`
  );

  if (failureCount && parseInt(failureCount) >= 5) {
    // Move to dead-letter queue
    await redis.zadd(DEAD_LETTER_QUEUE, Date.now(), id);
    await redis.del(`${PUBLISH_QUEUE}:${id}`);
    await redis.del(`${FAILURE_COUNTER_PREFIX}${id}`);

    return { jobId: id, event: null as any };
  }

  return { jobId: id, event };
};

// Get queue length
export const getQueueLength = async (): Promise<number> => {
  return await redis.zcard(PUBLISH_QUEUE);
};

// Get dead-letter queue length
export const getDLQLength = async (): Promise<number> => {
  return await redis.zcard(DEAD_LETTER_QUEUE);
};

// Add to dead-letter queue
export const addToDLQ = async (jobId: string, reason: string): Promise<void> => {
  await redis.zadd(DEAD_LETTER_QUEUE, Date.now(), jobId);
  await redis.set(`${FAILURE_COUNTER_PREFIX}${id}`, "1", "EX", 86400); // 24 hours
};

// Get queue stats
export const getQueueStats = async (): Promise<{
  pending: number;
  failed: number;
}> => {
  const pending = await getQueueLength();
  const failed = await getDLQLength();

  return { pending, failed };
};