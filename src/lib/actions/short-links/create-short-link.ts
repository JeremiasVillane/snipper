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
    track: {
      event: "create_short_link",
      channel: "analytics",
    },
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

    const { isSafe, isUp } = await checkURLReputation(
      formData.originalUrl.replace(/^https?:\/\//, ""),
    );

    if (!isUp) {
      throw new Error(
        "The destination URL you provided is not reachable. Please check the URL and try again.",
      );
    }

    if (!isSafe) {
      throw new Error(
        "The destination URL you provided is not safe. Please check the URL and try again.",
      );
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
      const result = await shortLinksRepository.create(
        {
          originalUrl: formData.originalUrl,
          shortCode: formData.shortCode,
          title: formData.title,
          shortLinkIcon: formData.shortLinkIcon,
          tags: formData.tags,
          expiresAt: formData.expiresAt || null,
          expirationUrl: formData.expirationUrl || null,
          password: formData.password || null,
          customOgTitle: formData.customOgTitle,
          customOgDescription: formData.customOgDescription,
          customOgImageUrl: formData.customOgImageUrl,
          customDomain: formData.customDomain,
          isLinkHubEnabled: formData.isLinkHubEnabled,
          linkHubTitle: formData.linkHubTitle,
          linkHubDescription: formData.linkHubDescription,
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
