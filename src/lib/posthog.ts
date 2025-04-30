import { env } from "@/env.mjs";
import { PostHog } from "posthog-node";

export default function PostHogClient() {
  const posthogClient =
    !!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST
      ? new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
          host: env.NEXT_PUBLIC_POSTHOG_HOST,
          flushAt: 1,
          flushInterval: 0,
        })
      : null;
  return posthogClient;
}
