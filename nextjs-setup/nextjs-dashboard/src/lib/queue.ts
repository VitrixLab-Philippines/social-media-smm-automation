// Simple queue service using Redis directly
// Per vercel-fix-v4.md: durable queue for publishing jobs
// Uses Redis ZSET for ordered queue, SET for job data

import Redis from "ioredis";

// Redis client instance
let redis: Redis | undefined;

const getRedis = (): Redis => {
  if (redis) return redis;

  const connectionString = process.env.REDIS_URL;
  if (!connectionString) {
    throw new Error("REDIS_URL is not configured");
  }

  // Fail fast when Redis is unreachable instead of buffering commands in the
  // offline queue: enqueue/dequeue callers degrade to explicit errors within
  // seconds rather than hanging requests for tens of seconds.
  redis = new Redis(connectionString, {
    lazyConnect: true,
    connectTimeout: 1500,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });
  redis.on("error", () => {
    // Failures surface through rejected commands; swallow here so an
    // unreachable Redis never becomes an unhandled error.
  });
  return redis;
};

/** Ensure the shared client is connected (no-op when already ready). */
const ensureConnected = async (): Promise<void> => {
  const client = getRedis();
  if (client.status === "wait" || client.status === "close" || client.status === "end") {
    await client.connect();
  }
};

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

  await ensureConnected();

  // Check if job already exists (idempotency)
  const exists = await getRedis().exists(key);
  if (exists) {
    return event.jobId;
  }

  // Set job with TTL (7 days) and JSON payload
  await getRedis().set(key, JSON.stringify(event), "EX", 604800); // 7 days

  // Add to sorted queue by score (timestamp)
  await getRedis().zadd(PUBLISH_QUEUE, Date.now(), event.jobId);

  return event.jobId;
};

// Dequeue a publish job (worker claims)
export const dequeuePublishJob = async (): Promise<{
  jobId: string;
  event: PublishJobEvent | null;
}> => {
  await ensureConnected();

  // Pop the first job from the sorted set
  const jobId = await getRedis().zpopmin(PUBLISH_QUEUE);

  if (!jobId || jobId.length === 0) {
    return { jobId: "", event: null };
  }

  const [id] = jobId;
  const raw = await getRedis().get(`${PUBLISH_QUEUE}:${id}`);

  if (!raw) {
    return { jobId: id, event: null };
  }

  const event: PublishJobEvent = JSON.parse(raw);

  // Check for dead-letter condition (5+ failures)
  const failureCount = await getRedis().get(
    `${FAILURE_COUNTER_PREFIX}${jobId}`
  );

  if (failureCount && parseInt(failureCount) >= 5) {
    // Move to dead-letter queue
    await getRedis().zadd(DEAD_LETTER_QUEUE, Date.now(), id);
    await getRedis().del(`${PUBLISH_QUEUE}:${id}`);
    await getRedis().del(`${FAILURE_COUNTER_PREFIX}${jobId}`);

    return { jobId: id, event: null };
  }

  return { jobId: id, event };
};

// Get queue length
export const getQueueLength = async (): Promise<number> => {
  await ensureConnected();
  return await getRedis().zcard(PUBLISH_QUEUE);
};

// Get dead-letter queue length
export const getDLQLength = async (): Promise<number> => {
  await ensureConnected();
  return await getRedis().zcard(DEAD_LETTER_QUEUE);
};

// Add to dead-letter queue
export const addToDLQ = async (jobId: string, reason: string): Promise<void> => {
  // Recorded for contract visibility: caller (the route) already surfaces the
  // failure, so `reason` is transport state rather than a persisted decision.
  void reason;
  await ensureConnected();
  await getRedis().zadd(DEAD_LETTER_QUEUE, Date.now(), jobId);
  await getRedis().set(`${FAILURE_COUNTER_PREFIX}${jobId}`, "1", "EX", 86400); // 24 hours
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