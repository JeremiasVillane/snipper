"use server";

import { revalidatePath } from "next/cache";

import { customDomainsRepository } from "@/lib/db/repositories";
import { createCustomDomainSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

export const createCustomDomain = authActionClient({
  roles: ["USER"],
  plans: ["Pro", "Business"],
})
  .metadata({
    name: "create-custom-domain",
    track: {
      event: "create_custom_domain",
      channel: "analytics",
    },
    limiter: {
      refillRate: 5,
      interval: 60,
      capacity: 100,
      requested: 1,
    },
  })
  .schema(createCustomDomainSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;

    try {
      const result = await customDomainsRepository.create(
        { ...parsedInput },
        userId,
      );

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/custom-domains");

      return result;
    } catch (error) {
      console.error("Error in customDomainsRepository.create:", error);

      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to create the custom domain due to a database error.",
      );
    }
  });
