"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { shortLinksRepository } from "@/lib/db/repositories";
import { createLinkSchema } from "@/lib/schemas";

import { authActionClient } from "../safe-action";

const updateShortLinkSchema = z.object({
  linkId: z.string().min(1, "Short link ID is required"),
  formData: createLinkSchema,
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
    const { userId } = ctx;

    try {
      const result = await prisma?.$transaction(async (tx) => {
        const currentLink = await tx.shortLink.findUnique({
          where: { id: linkId, userId },
          select: { id: true, shortCode: true },
        });

        if (!currentLink) {
          throw new Error(
            "Link not found or you do not have permission to edit it.",
          );
        }

        if (
          formData.shortCode &&
          formData.shortCode !== currentLink.shortCode
        ) {
          try {
            const existingLink = await shortLinksRepository.findByShortCode(
              formData.shortCode,
            );
            if (existingLink && existingLink.id !== linkId) {
              throw new Error("This custom alias is already taken");
            }
          } catch (error) {
            throw error;
          }
        }

        const password = !!formData.password
          ? await bcrypt.hash(formData.password, 12)
          : null;

        await tx.shortLink.update({
          where: { id: linkId },
          data: {
            originalUrl: formData.originalUrl,
            expiresAt: formData.expiresAt,
            password,
            // description: formData.description,
          },
        });

        await tx.linkTag.deleteMany({ where: { linkId } });
        if (formData.tags && formData.tags.length > 0) {
          const tagOperations = formData.tags.map(async (tagName) => {
            return await tx.tag.upsert({
              where: {
                userId_name: { userId, name: tagName.trim() },
              },
              update: {},
              create: { name: tagName.trim(), userId },
              select: { id: true },
            });
          });
          const tags = await Promise.all(tagOperations);
          await tx.linkTag.createMany({
            data: tags.map((tag) => ({ linkId, tagId: tag.id })),
            skipDuplicates: true,
          });
          console.log(`Synced ${tags.length} tags for link ${linkId}`);
        }

        await tx.uTMParam.deleteMany({ where: { shortLinkId: linkId } });
        if (formData.utmSets && formData.utmSets.length > 0) {
          const utmParamsToCreate = formData.utmSets.map((utmSet) => ({
            shortLinkId: linkId,
            source: utmSet.source || null,
            medium: utmSet.medium || null,
            campaign: utmSet.campaign,
            term: utmSet.term || null,
            content: utmSet.content || null,
          }));
          await tx.uTMParam.createMany({ data: utmParamsToCreate });
          console.log(
            `Synced ${utmParamsToCreate.length} UTMParam sets for link ${linkId}`,
          );
        }

        return { shortCode: currentLink.shortCode };
      });

      revalidatePath("/dashboard");
      revalidatePath(`/dashboard/analytics/${linkId}`);

      return { shortCode: result.shortCode };
    } catch (error) {
      console.error(`Error updating link ${linkId}:`, error);
      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to update the short link due to a database error.",
      );
    }
  });
