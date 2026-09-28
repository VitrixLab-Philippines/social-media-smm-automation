import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const WINDOW_SECONDS = 60;
const MAX_BODY_BYTES = 1024 * 1024;
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();
let redis: Redis | null = null;

function redisClient() {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) return null;

  // Netlify can reuse a warm serverless instance after the Redis connection has
  // been closed. Never keep a terminal ioredis client around.
  if (redis && (redis.status === "end" || redis.status === "close")) {
    redis = null;
  }

  if (redis) return redis;

  redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: () => null,
  });
  redis.on("error", (error) => {
    console.error("[Redis] Rate limiter connection error:", error);
  });
  return redis;
}

function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export type RateLimitPolicy = { limit: number; windowSeconds?: number; scope?: string };

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
  unavailable?: boolean;
};

export async function checkRateLimit(request: NextRequest, policy: RateLimitPolicy): Promise<RateLimitResult> {
  const windowSeconds = policy.windowSeconds ?? WINDOW_SECONDS;
  const scope = policy.scope ?? request.nextUrl.pathname;
  const key = `smmai:rl:${scope}:${clientIp(request)}`;
  const client = redisClient();

  if (!client && process.env.NODE_ENV === "production") {
    return { allowed: false, remaining: 0, retryAfter: 5, unavailable: true };
  }

  if (client) {
    try {
      if (client.status === "wait") await client.connect();
      const count = await client.incr(key);
      if (count === 1) await client.expire(key, windowSeconds);
      return {
        allowed: count <= policy.limit,
        remaining: Math.max(0, policy.limit - count),
        retryAfter: count > policy.limit ? await client.ttl(key) : 0,
      };
    } catch (error) {
      console.error("[Redis] Rate limiter unavailable:", error);
      return { allowed: false, remaining: 0, retryAfter: 5, unavailable: true };
    }
  }

  const now = Date.now();
  const current = memoryBuckets.get(key);
  if (!current || current.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: policy.limit - 1, retryAfter: 0 };
  }
  current.count += 1;
  return {
    allowed: current.count <= policy.limit,
    remaining: Math.max(0, policy.limit - current.count),
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

export function rateLimitResponse(result: RateLimitResult) {
  const status = result.unavailable ? 503 : 429;
  const message = result.unavailable ? "Rate limiting service unavailable" : "Too many requests";
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "content-type": "application/json",
      "retry-after": String(Math.max(1, result.retryAfter)),
    },
  });
}

export function requireIdempotencyKey(request: NextRequest) {
  const value = request.headers.get("idempotency-key")?.trim();
  if (!value || value.length < 16 || value.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(value)) {
    return null;
  }
  return value;
}

export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function readJsonWithLimit<T = unknown>(request: NextRequest): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
  return JSON.parse(raw) as T;
}

export function hashSecret(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function setSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return response;
}
