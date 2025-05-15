import { env } from "@/env.mjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/edge";

export type RateLimitConfig = {
  refillRate: number; // Tokens per interval
  interval: number; // Seconds
  capacity: number; // Max. tokens
};

export async function protectRequest(
  req: Request,
  config: RateLimitConfig,
  keyPrefix: string,
) {
  if (!env.KV_REST_API_TOKEN || !env.KV_REST_API_URL) {
    console.warn(
      `Upstash Redis not configured. Rate limiting for action '${keyPrefix}' disabled.`,
    );
    return {
      isDenied: () => false,
      reason: undefined,
      remaining: 0,
      reset: new Date(),
      ip: "unknown",
    };
  }

  const redis = new Redis({
    url: env.KV_REST_API_URL,
    token: env.KV_REST_API_TOKEN,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(
      config.capacity,
      `${config.interval}s`,
      config.refillRate,
    ),
  });

  // Get IP (compatible with Vercel Edge)
  const ip = ipAddress(req) || "unknown";

  const { success, remaining, reset } = await ratelimit.limit(
    `${keyPrefix}:${ip}`,
  );

  return {
    isDenied: () => !success,
    reason: success ? undefined : "RATE_LIMIT",
    remaining,
    reset: new Date(reset),
    ip,
  };
}
