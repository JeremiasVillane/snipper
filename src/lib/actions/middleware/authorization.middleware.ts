import { createMiddleware } from "next-safe-action";

import { authorizationMiddlewareProps } from "@/lib/types";

export const authorizationMiddleware = (props: authorizationMiddlewareProps) =>
  createMiddleware<{
    metadata: { name: string };
    ctx: {
      userId: string;
    };
  }>().define(async ({ next, ctx }) => {
    const { userId } = ctx;

    const user = await prisma?.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    const { plans, roles } = props;

    if (!!roles && roles !== "ALL" && !roles.some((r) => user?.role === r)) {
      throw new Error(
        `This feature is not available for ${user?.role.toLowerCase()} users`,
      );
    }

    if (
      !!plans &&
      plans !== "ALL" &&
      !plans.some((p) =>
        user?.subscriptions.some(
          (sub) =>
            sub.plan.name.includes(p) &&
            ["ACTIVE", "TRIALING"].includes(sub.status),
        ),
      )
    ) {
      throw new Error("This feature is not available in your current plan");
    }

    return next({
      ctx: {
        user: user,
      },
    });
  });
