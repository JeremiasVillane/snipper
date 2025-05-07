"use server";

import { apiKeysRepository } from "@/lib/db/repositories";
import { generateApiKey } from "@/lib/helpers";
import { createApiKeySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const createApiKeyActionSchema = z.object({
  data: createApiKeySchema,
});

export const createApiKey = authActionClient({
  roles: ["USER"],
  plans: ["Premium"],
})
  .metadata({ name: "create-api-key" })
  .schema(createApiKeyActionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput;
    const { userId } = ctx;

    const key = generateApiKey();

    const apiKey = await apiKeysRepository.create({
      user: { connect: { id: userId } },
      name: data.name,
      key,
      expiresAt: data.expiresAt || null,
    });

    revalidatePath("/dashboard/api-keys");
    return { key };
  });
