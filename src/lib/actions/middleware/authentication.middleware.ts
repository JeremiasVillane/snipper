import { auth } from "@/lib/auth";
import { createMiddleware } from "next-safe-action";

export const authenticationMiddleware = createMiddleware<{
  metadata: { name: string };
}>().define(async ({ next }) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return next({
    ctx: {
      userId: session.user.id,
    },
  });
});
