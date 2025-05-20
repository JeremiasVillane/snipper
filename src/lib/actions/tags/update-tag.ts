"use server";

import { revalidatePath } from "next/cache";

import { tagsRepository } from "@/lib/db/repositories";
import { updateTagSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

export const updateTag = authActionClient({
  roles: ["USER"],
  plans: ["Pro", "Business"],
})
  .metadata({
    name: "update-tag",
    limiter: {
      refillRate: 10,
      interval: 10,
      capacity: 100,
      requested: 1,
    },
  })
  .schema(updateTagSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, ...tagData } = parsedInput;
    const { userId } = ctx;

    await tagsRepository.update(id, userId, tagData);

    revalidatePath("/dashboard");
    return { message: "Tag updated successfully" };
  });
