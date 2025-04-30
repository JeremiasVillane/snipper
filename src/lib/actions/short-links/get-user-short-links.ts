"use server";

import { shortLinksRepository } from "@/lib/db/repositories";
import { authActionClient } from "../safe-action";

export const getUserShortLinks = authActionClient({})
  .metadata({
    name: "get-user-short-links",
  })
  .action(async ({ ctx }) => {
    const { userId } = ctx;
    return shortLinksRepository.findByUserId(userId);
  });
