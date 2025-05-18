"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { customDomainsRepository } from "@/lib/db/repositories";

import { authActionClient } from "../safe-action";

export const deleteCustomDomain = authActionClient({
  roles: ["USER"],
  plans: ["Pro", "Business"],
})
  .metadata({
    name: "delete-custom-domain",
    track: {
      event: "delete_custom_domain",
      channel: "analytics",
    },
    limiter: {
      refillRate: 1,
      interval: 60,
      capacity: 100,
      requested: 1,
    },
  })
  .schema(z.object({ domainId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { domainId } = parsedInput;
    const { userId } = ctx;

    try {
      const result = await customDomainsRepository.delete(domainId, userId);

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/custom-domains");

      return result;
    } catch (error) {
      console.error("Error in customDomainsRepository.delete:", error);

      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to delete the custom domain due to a database error.",
      );
    }
  });
