"use server";

import { apiKeysRepository } from "@/lib/db/repositories";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const deleteApiKeySchema = z.object({
  id: z.string().min(1, "API Key ID is required"),
});

export const deleteApiKey = authActionClient({
  roles: ["USER"],
  plans: ["Premium"],
})
  .metadata({ name: "delete-api-key" })
  .schema(deleteApiKeySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { userId } = ctx;

    await apiKeysRepository.delete(id, userId);

    revalidatePath("/dashboard/api-keys");
    return { message: "Your API key has been deleted" };
  });
