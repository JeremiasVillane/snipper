import { env } from "@/env.mjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/edge";

import { redisClient } from "./redis";

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

export async function validateEmail(
  email: string,
): Promise<{ risk: "high" | "medium" | "low"; autocorrect?: string }> {
  if (!env.ABSTRACT_API_KEY) {
    console.warn(`Abstract API key not configured. Email validation disabled.`);
    return { risk: "low" };
  }

  const response = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${env.ABSTRACT_API_KEY}&email=${email}`,
  );
  const data = await response.json();

  if (data.deliverability === "UNDELIVERABLE")
    return { risk: "high", autocorrect: data.autocorrect };
  if (data.is_disposable_email.value)
    return { risk: "high", autocorrect: data.autocorrect };
  if (!data.is_valid_format.value)
    return { risk: "high", autocorrect: data.autocorrect };
  if (!data.is_mx_found.value)
    return { risk: "high", autocorrect: data.autocorrect };
  if (!data.is_smtp_valid.value)
    return { risk: "high", autocorrect: data.autocorrect };
  if (data.quality_score < 0.5)
    return { risk: "medium", autocorrect: data.autocorrect };

  return { risk: "low", autocorrect: data.autocorrect };
}

export async function checkIpReputation(ip: string): Promise<boolean> {
  const cacheKey = `ip_reputation:${ip}`;
  const cached = await redisClient?.get(cacheKey);
  if (cached !== null) return Boolean(cached);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(
      `https://www.ipqualityscore.com/api/json/ip/${env.IPQS_KEY}/${ip}`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (!response.ok) return false;

    const data = await response.json();
    const isBad = data.vpn || data.proxy || data.bot_status;

    await redisClient?.setex(cacheKey, 3600, isBad ? 1 : 0);

    return isBad;
  } catch (error) {
    console.error("IPQS IP Check Error:", error);
    return false;
  }
}

export async function checkURLReputation(url: string): Promise<boolean> {
  const cacheKey = `url_reputation:${url}`;
  const cached = await redisClient?.get(cacheKey);
  if (cached !== null) return Boolean(cached);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(
      `https://www.ipqualityscore.com/api/json/url/${env.IPQS_KEY}/${url}`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (!response.ok) return true;

    const data = await response.json();
    const isSafe = !data.malware && !data.spamming && data.dns_valid;

    await redisClient?.setex(cacheKey, 3600, isSafe ? 0 : 1);

    return isSafe;
  } catch (error) {
    console.error("IPQS URL Check Error:", error);
    return false;
  }
}
