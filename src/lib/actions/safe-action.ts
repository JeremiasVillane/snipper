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
      name: z.string(),
      track: z
        .object({
          event: z.string(),
          channel: z.string(),
        })
        .optional(),
    });
  },
});

export const noauthActionClient = actionClientWithMeta
  .use(loggingMiddleware)
  .use(sentryMiddleware);

export const authActionClient = <P extends authorizationMiddlewareProps>(
  props: P
) =>
  actionClientWithMeta
    .use(loggingMiddleware)
    .use(authenticationMiddleware)
    .use(authorizationMiddleware(props))
    .use(analyticsMiddleware)
    .use(sentryMiddleware);
