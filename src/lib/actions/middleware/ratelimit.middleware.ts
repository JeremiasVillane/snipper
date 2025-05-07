import { env } from "@/env.mjs";
import arcjet, {
  ArcjetDecision,
  ArcjetRateLimitReason,
  tokenBucket,
} from "@arcjet/next";
import { createMiddleware } from "next-safe-action";
import { headers as getNextHeaders } from "next/headers";

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
  if (!env.ARCJET_KEY) {
    console.warn(
      `Arcjet key not found. Rate limiting for action '${metadata.name}' will be disabled.`
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
  } = metadata;

  const aj = arcjet({
    key: env.ARCJET_KEY,
    rules: [
      tokenBucket({
        mode: "LIVE",
        characteristics: ["ip.src"],
        refillRate: limiter.refillRate,
        interval: limiter.interval,
        capacity: limiter.capacity,
      }),
    ],
  });

  try {
    const currentHeaders = await getNextHeaders();

    const forwardedFor = currentHeaders.get("x-forwarded-for");
    const clientIpAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : (await fetch("https://api.ipify.org/?format=json")
          .then((res) => res.json())
          .then((res) => res?.ip)) ?? "127.0.0.1";

    const decision: ArcjetDecision = await aj.protect(
      {
        headers: currentHeaders,
        ip: clientIpAddress,
      },
      {
        requested: limiter.requested,
      }
    );

    if (decision.isDenied()) {
      const reason = decision.reason as ArcjetRateLimitReason;

      if (reason.isRateLimit()) {
        console.warn(
          `Rate limit hit for action '${metadata.name}'. IP: ${
            decision.ip ?? "N/A"
          }. Remaining: ${reason.remaining}, Reset: ${new Date(
            reason.reset * 1000
          )}`
        );
        const error = new Error("Too Many Requests");
        error.cause = "rate-limit";
        throw error;
      } else {
        console.warn(
          `Request denied for action '${metadata.name}' by Arcjet. IP: ${
            decision.ip ?? "N/A"
          }. Reason: ${decision.reason.type}`
        );
        const error = new Error("Forbidden");
        error.cause = decision.reason.type;
        throw error;
      }
    }

    return next({
      ctx: {
        ...originalContext,
        ...(decision.isDenied() && decision.reason.isRateLimit()
          ? {
              ratelimit: {
                window: decision.reason.window,
                remaining: decision.reason.remaining,
                reset: decision.reason.reset,
              },
            }
          : {}),
      },
    });
  } catch (error) {
    console.error(
      `Arcjet middleware error for action '${metadata.name}':`,
      error
    );

    if (
      error instanceof Error &&
      (error.message === "Too Many Requests" || error.message === "Forbidden")
    ) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.message.includes("Invariant: headers()")
    ) {
      console.error(
        "Error: headers() was called outside of the Next.js request scope. Ensure this action is run within a Server Action or similar Next.js request context."
      );
      throw new Error("Server configuration error for security check.");
    }
    throw new Error("Security check failed");
  }
});
