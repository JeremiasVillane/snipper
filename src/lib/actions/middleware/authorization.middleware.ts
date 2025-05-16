import { createMiddleware } from "next-safe-action";

import { usersRepository } from "@/lib/db/repositories";
import { authorizationMiddlewareProps } from "@/lib/types";

export const authorizationMiddleware = (props: authorizationMiddlewareProps) =>
  createMiddleware<{
    metadata: { name: string };
    ctx: {
      userId: string;
    };
  }>().define(async ({ next, ctx }) => {
    const { userId } = ctx;

    const user = await usersRepository.findById(userId);
    if (!user) throw new Error("User not found");

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
      throw new Error("This feature is not available for your current plan");
    }

    const activeUserPlans = user.subscriptions
      .filter((sub) => ["ACTIVE", "TRIALING"].includes(sub.status))
      .map((s) => s.plan);
    const totalUserLinks = user._count.shortLinks;

    return next({
      ctx: {
        activeUserPlans,
        totalUserLinks,
      },
    });
  });
