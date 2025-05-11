"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { apiKeysRepository } from "@/lib/db/repositories";
import { generateApiKey } from "@/lib/helpers";
import { createApiKeySchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

const createApiKeyActionSchema = z.object({
  data: createApiKeySchema,
});

export const createApiKey = authActionClient({
  roles: ["USER"],
  plans: ["Business"],
})
  .metadata({
    name: "create-api-key",
    limiter: {
      refillRate: 5,
      interval: 10,
      capacity: 5,
      requested: 1,
    },
  })
  .schema(createApiKeyActionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput;
    const { userId } = ctx;

    const key = generateApiKey();

    await apiKeysRepository.create({
      user: { connect: { id: userId } },
      name: data.name,
      key,
      expiresAt: data.expiresAt || null,
    });

    revalidatePath("/dashboard/api-keys");
    return { key };
  });
