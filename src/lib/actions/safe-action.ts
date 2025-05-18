import { Prisma } from "@prisma/client";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z, ZodError } from "zod";

import { authorizationMiddlewareProps } from "../types";
import { analyticsMiddleware } from "./middleware/analytics.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { authorizationMiddleware } from "./middleware/authorization.middleware";
import {
  loggingMiddleware,
  sentryMiddleware,
} from "./middleware/observability.middleware";
import { rateLimitingMiddleware } from "./middleware/ratelimit.middleware";
import {
  DATABASE_ERROR_MESSAGE,
  DEFAULT_VALIDATION_ERROR_MESSAGE,
} from "./safe-action-helpers";

// Base client which has server error handling, and metadata
export const actionClientWithMeta = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ZodError) {
      console.error(e.message);
      return DEFAULT_VALIDATION_ERROR_MESSAGE;
    } else if (
      e instanceof Prisma.PrismaClientInitializationError ||
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      console.error(e.message);
      return DATABASE_ERROR_MESSAGE;
    } else if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      /**
       * The name of the action.
       * This is the name that will be used to identify the action in the tracking service.
       */
      name: z.string(),
      track: z
        .object({
          /**
           * The event name to track.
           * This is the name of the event that will be sent to the tracking service.
           */
          event: z.string(),
          /**
           * The channel to track the event on.
           * This is the channel that will be used to send the event to the tracking service.
           */
          channel: z.string(),
        })
        .optional(),
      limiter: z
        .object({
          /**
           * The number of requests allowed per interval.
           * This is the maximum number of requests that can be made in the specified interval.
           * For example, if refillRate is 10 and interval is 60 seconds,
           * the client can make 10 requests every 60 seconds.
           */
          refillRate: z.number(),
          /**
           * The time period in seconds for which the rate limit is applied.
           * For example, if interval is 60, the rate limit will be applied every 60 seconds.
           */
          interval: z.number(),
          /**
           * The maximum number of requests that can be made in the specified interval.
           * This is the maximum number of requests that can be made in the specified interval.
           * For example, if capacity is 10 and interval is 60 seconds,
           * the client can make 10 requests every 60 seconds.
           */
          capacity: z.number(),
          /**
           * The cost of each request in the rate limit.
           * This is the number of requests that will be deducted from the client's quota for each request made.
           * For example, if requested is 1 and capacity is 10,
           * the client can make 10 requests every 60 seconds.
           */
          requested: z.number(),
        })
        .optional(),
    });
  },
});

export const noauthActionClient = actionClientWithMeta
  .use(loggingMiddleware)
  .use(rateLimitingMiddleware)
  .use(sentryMiddleware);

export const authActionClient = <P extends authorizationMiddlewareProps>(
  props: P,
) =>
  actionClientWithMeta
    .use(loggingMiddleware)
    .use(rateLimitingMiddleware)
    .use(authenticationMiddleware)
    .use(authorizationMiddleware(props))
    .use(analyticsMiddleware)
    .use(sentryMiddleware);
