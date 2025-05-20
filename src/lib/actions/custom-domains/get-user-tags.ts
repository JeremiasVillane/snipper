"use server";

import { tagsRepository } from "@/lib/db/repositories";

import { authActionClient } from "../safe-action";

export const getUserTags = authActionClient({})
  .metadata({
    name: "get-user-tags",
    limiter: {
      refillRate: 10,
      interval: 10,
      capacity: 1000,
      requested: 1,
    },
  })
  .action(async ({ ctx }) => {
    const { userId } = ctx;
    const fullTags = await tagsRepository.findByUserId(userId);
    const tags = fullTags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    }));

    return tags;
  });
