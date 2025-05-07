"use server";

import { shortLinksRepository } from "@/lib/db/repositories";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const getShortLinkSchema = z.object({
  id: z.string().min(1, "Short link ID is required"),
});

export const getShortLink = authActionClient({})
  .metadata({ name: "get-short-link" })
  .schema(getShortLinkSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { userId } = ctx;

    const shortLink = await shortLinksRepository.findById(id);
    if (!shortLink || shortLink.userId !== userId) {
      throw new Error("Short link not found");
    }

    return shortLink;
  });
