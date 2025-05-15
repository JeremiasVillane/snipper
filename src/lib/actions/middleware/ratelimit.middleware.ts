import { headers as getNextHeaders } from "next/headers";
import { env } from "@/env.mjs";
import { Ratelimit } from "@upstash/ratelimit";
import { createMiddleware } from "next-safe-action";

import { redisClient } from "@/lib/redis";

interface RateLimitInfo {
  window: number;
  remaining: number;
  reset: number;
}

export const rateLimitingMiddleware = createMiddleware<{
  ctx: {
    ratelimit?: RateLimitInfo;
  };
  metadata: {
    name: string;
    limiter?: {
      refillRate: number;
      interval: number;
      capacity: number;
      requested: number;
    };
  };
}>().define(async ({ next, metadata, ctx: originalContext }) => {
  if (!env.KV_REST_API_TOKEN || !env.KV_REST_API_URL) {
    console.warn(
      `Upstash Redis not configured. Rate limiting for action '${metadata.name}' disabled.`,
    );
    return next({ ctx: originalContext });
  }

  const {
    limiter = {
      refillRate: 5,
      interval: 10,
      capacity: 1000,
      requested: 1,
    },
    name,
  } = metadata;

  const ratelimit = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.tokenBucket(
      limiter.capacity,
      `${limiter.interval}s`,
      limiter.refillRate,
    ),
  });

  try {
    const currentHeaders = await getNextHeaders();
    const forwardedFor = currentHeaders.get("x-forwarded-for");

    let clientIpAddress: string;
    if (forwardedFor) {
      clientIpAddress = forwardedFor.split(",")[0].trim();
    } else {
      try {
        const response = await fetch("https://api.ipify.org/?format=json");
        const data = await response.json();
        clientIpAddress = data.ip || "127.0.0.1";
      } catch {
        clientIpAddress = "127.0.0.1";
      }
    }

    const { success, remaining, reset } = await ratelimit.limit(
      `action:${name}:ip:${clientIpAddress}`,
      { rate: limiter.requested },
    );

    if (!success) {
      console.warn(
        `Rate limit exceeded for action '${name}'. IP: ${clientIpAddress}. Reset: ${new Date(reset)}`,
      );
      const error = new Error("Too Many Requests");
      error.cause = "rate-limit";
      throw error;
    }

    return next({
      ctx: {
        ...originalContext,
        ratelimit: {
          window: limiter.interval,
          remaining,
          reset: Math.floor(reset / 1000),
        },
      },
    });
  } catch (error) {
    console.error(`Error de rate limiting en '${name}':`, error);

    if (error instanceof Error) {
      if (error.message.includes("Invariant: headers()")) {
        console.error(
          "Error: headers() used outside the context of Next.js. Make sure to execute this action in a Server Action.",
        );
        throw new Error("Server configuration error");
      }

      if (error.message === "Too Many Requests") {
        throw error;
      }
    }

    throw new Error("Security error");
  }
});
