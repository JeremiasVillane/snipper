import { Session } from "next-auth";
import { createMiddleware } from "next-safe-action";

export type authorizationMiddlewareProps = {
  // plans: Plan[] | "ALL";
  // roles: Role[] | "ALL";
};

export const authorizationMiddleware = (
  props: authorizationMiddlewareProps
) =>
  createMiddleware<{
    metadata: { name: string };
    ctx: {
      session: Session;
    };
  }>().define(async ({ next, ctx }) => {
    const { session } = ctx;

    const userId = session.user.id;

    const user = await prisma?.user.findUnique({
      where: {
        id: userId,
      },
    });

    // const { plans, roles } = props;

    // if (plans !== "ALL" && !plans.some((p) => p === user?.plan)) {
    //   throw new Error("User is not the correct plan");
    // }

    // if (roles !== "ALL" && !roles.some((r) => user?.role === r)) {
    //   throw new Error("User is not the correct role");
    // }

    return next({
      ctx: {
        user: user,
      },
    });
  });
