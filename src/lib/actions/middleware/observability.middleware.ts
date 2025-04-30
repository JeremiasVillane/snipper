import { createMiddleware } from "next-safe-action";
import * as Sentry from "@sentry/nextjs";
import { env } from "@/env.mjs";

export const sentryMiddleware = createMiddleware<{
  metadata: { name: string };
}>().define(async ({ next, metadata }) => {
  if (!!env.NEXT_PUBLIC_SENTRY_DSN) {
    return Sentry.withServerActionInstrumentation(metadata.name, async () => {
      return next({
        ctx: {},
      });
    });
  }

  return next({
    ctx: {},
  });
});

export const loggingMiddleware = createMiddleware<{
  metadata: { name: string };
}>().define(async ({ next, metadata, clientInput }) => {
  const result = await next({ ctx: undefined });

  if (process.env.NODE_ENV === "development") {
    console.debug({ clientInput }, "Input");
    console.debug({ result: result.data }, "Result");
    console.debug({ metadata }, "Metadata");
  }

  return result;
});
