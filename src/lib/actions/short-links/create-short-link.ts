"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { validateShortLinkFeatures } from "@/lib/feature-access";
import { createLinkSchema } from "@/lib/schemas";
import { checkURLReputation } from "@/lib/security";

import { authActionClient } from "../safe-action";

const createShortLinkSchema = z.object({
  formData: createLinkSchema,
});

export const createShortLink = authActionClient({
  roles: ["USER"],
  plans: "ALL",
})
  .metadata({
    name: "create-short-link",
    limiter: {
      refillRate: 10,
      interval: 5,
      capacity: 10,
      requested: 1,
    },
  })
  .schema(createShortLinkSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { formData } = parsedInput;
    const { userId, activeUserPlans, totalUserLinks } = ctx;

    validateShortLinkFeatures(formData, activeUserPlans, totalUserLinks);

    const urlIsSafe = await checkURLReputation(formData.originalUrl);

    if (!urlIsSafe) {
      throw new Error(
        "The URL you provided is not safe. Please check the URL and try again.",
      );
    }

    try {
      const result = await shortLinksRepository.create(
        {
          originalUrl: formData.originalUrl,
          shortCode: formData.shortCode,
          tags: formData.tags,
          expiresAt: formData.expiresAt || null,
          password: formData.password || null,
          customOgTitle: formData.customOgTitle,
          customOgDescription: formData.customOgDescription,
          customOgImageUrl: formData.customOgImageUrl,
          customDomain: formData.customDomain,
        },
        userId,
      );

      revalidatePath("/dashboard");

      return result;
    } catch (error) {
      console.error("Error in shortLinksRepository.create:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        if ((error.meta as any)?.target?.includes("shortCode")) {
          throw new Error(
            `The alias "${formData.shortCode}" is already taken or was generated concurrently. Please try again.`,
          );
        }
      }

      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to create the short link due to a database error.",
      );
    }
  });
