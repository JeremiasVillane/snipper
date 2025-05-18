"use server";

import { revalidatePath } from "next/cache";

import { customDomainsRepository } from "@/lib/db/repositories";
import { updateCustomDomainSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

export const updateCustomDomain = authActionClient({
  roles: ["USER"],
  plans: ["Pro", "Business"],
})
  .metadata({
    name: "update-custom-domain",
    track: {
      event: "update_custom_domain",
      channel: "analytics",
    },
    limiter: {
      refillRate: 5,
      interval: 60,
      capacity: 100,
      requested: 1,
    },
  })
  .schema(updateCustomDomainSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;

    try {
      const result = await customDomainsRepository.update(
        { ...parsedInput },
        userId,
      );

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/custom-domains");

      return result;
    } catch (error) {
      console.error("Error in customDomainsRepository.update:", error);

      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to update the custom domain due to a database error.",
      );
    }
  });
