"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { validateShortLinkFeatures } from "@/lib/feature-access";
import { updateLinkSchema } from "@/lib/schemas";
import { checkURLReputation } from "@/lib/security";

import { authActionClient } from "../safe-action";

const updateShortLinkSchema = z.object({
  linkId: z.string().min(1, "Short link ID is required"),
  formData: updateLinkSchema,
});

export const updateShortLink = authActionClient({
  roles: ["USER"],
  plans: "ALL",
})
  .metadata({
    name: "update-short-link",
    limiter: {
      refillRate: 10,
      interval: 5,
      capacity: 10,
      requested: 1,
    },
  })
  .schema(updateShortLinkSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { linkId, formData } = parsedInput;
    const { userId, activeUserPlans } = ctx;

    validateShortLinkFeatures(formData, activeUserPlans);

    if (formData.originalUrl) {
      const { isSafe, isUp } = await checkURLReputation(
        formData.originalUrl.replace(/^https?:\/\//, ""),
      );

      if (!isSafe) {
        throw new Error(
          "The URL you provided is not safe. Please check the URL and try again.",
        );
      }

      if (!isUp) {
        throw new Error(
          "The URL you provided is not reachable. Please check the URL and try again.",
        );
      }
    }

    if (!!formData.expirationUrl) {
      const { isSafe: isExpirationURLSafe, isUp: isExpirationURLUp } =
        await checkURLReputation(
          formData.expirationUrl.replace(/^https?:\/\//, ""),
        );

      if (!isExpirationURLUp) {
        throw new Error(
          "The expiration URL you provided is not reachable. Please check the URL and try again.",
        );
      }

      if (!isExpirationURLSafe) {
        throw new Error(
          "The expiration URL you provided is not safe. Please check the URL and try again.",
        );
      }
    }

    try {
      const result = await shortLinksRepository.update(
        linkId,
        userId,
        formData,
      );

      revalidatePath("/dashboard");
      revalidatePath(`/dashboard/analytics/${linkId}`);

      return result;
    } catch (error) {
      console.error(`Error updating link ${linkId}:`, error);
      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to update the short link due to a database error.",
      );
    }
  });
