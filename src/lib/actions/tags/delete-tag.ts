"use server";

import { revalidatePath } from "next/cache";

import { tagsRepository } from "@/lib/db/repositories";
import { tagIdSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

export const deleteTag = authActionClient({
  roles: ["USER"],
  plans: ["Pro", "Business"],
})
  .metadata({
    name: "delete-tag",
    limiter: {
      refillRate: 10,
      interval: 10,
      capacity: 100,
      requested: 1,
    },
  })
  .schema(tagIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { userId } = ctx;

    await tagsRepository.delete(id, userId);

    revalidatePath("/dashboard");
    return { message: "Tag deleted successfully" };
  });
