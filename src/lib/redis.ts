import { env } from "@/env.mjs";
import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});
