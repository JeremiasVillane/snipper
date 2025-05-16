"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";

import { authActionClient } from "../safe-action";

const deleteShortLinkSchema = z.object({
  id: z.string().min(1, "Short link ID is required"),
});

export const deleteShortLink = authActionClient({
  roles: ["USER"],
  plans: "ALL",
})
  .metadata({
    name: "delete-short-link",
    limiter: {
      refillRate: 10,
      interval: 5,
      capacity: 10,
      requested: 1,
    },
  })
  .schema(deleteShortLinkSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { userId } = ctx;

    const shortLink = await shortLinksRepository.findById(id);
    if (!shortLink || shortLink.userId !== userId) {
      throw new Error("Short link not found or you don't have permission.");
    }

    await shortLinksRepository.delete(id);
    revalidatePath("/dashboard");
    return {
      message: `Short link "${shortLink.shortCode}" successfully deleted`,
    };
  });
