"use server";

import { shortLinksRepository } from "@/lib/db/repositories";
import { authActionClient } from "../safe-action";

export const getUserShortLinks = authActionClient({})
  .metadata({
    name: "get-user-short-links",
    limiter: {
      refillRate: 10,
      interval: 10,
      capacity: 1000,
      requested: 1,
    },
  })
  .action(async ({ ctx }) => {
    const { userId } = ctx;
    return shortLinksRepository.findByUserId(userId);
  });
