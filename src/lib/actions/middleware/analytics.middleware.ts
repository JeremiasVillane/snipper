import { env } from "@/env.mjs";
import { Session } from "next-auth";
import { createMiddleware } from "next-safe-action";

import PostHogClient from "@/lib/posthog";

export const analyticsMiddleware = createMiddleware<{
  metadata: {
    name: string;
    track?: {
      event: string;
      channel: string;
    };
  };
  ctx: {
    userId: Session["user"]["id"];
  };
}>().define(async ({ next, metadata, ctx }) => {
  if (!!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST) {
    const { track } = metadata;

    if (track) {
      const posthog = PostHogClient();

      posthog!.capture({
        distinctId: ctx.userId,
        event: track.event,
        properties: {},
      });

      await posthog!.shutdown();
    }
  }

  return next({
    ctx: {},
  });
});
