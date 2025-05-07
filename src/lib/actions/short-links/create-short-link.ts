"use server";

import { prisma } from "@/lib/db/prisma";
import { generateShortCode } from "@/lib/helpers";
import { createLinkSchema } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
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
    const { userId } = ctx;

    let shortCode: string;
    if (formData.shortCode) {
      const existingLink = await prisma.shortLink.findUnique({
        where: { shortCode: formData.shortCode },
        select: { id: true },
      });
      if (existingLink) {
        throw new Error(
          `The alias "${formData.shortCode}" is already taken. Please choose another one.`
        );
      }
      shortCode = formData.shortCode;
    } else {
      shortCode = generateShortCode();
    }

    try {
      const password = !!formData.password
        ? await bcrypt.hash(formData.password, 12)
        : null;

      const result = await prisma.$transaction(async (tx) => {
        const shortLink = await tx.shortLink.create({
          data: {
            originalUrl: formData.originalUrl,
            shortCode: shortCode,
            userId,
            expiresAt: formData.expiresAt,
            password,
            // description: formData.description || null,
            clicks: 0,
          },
          select: { id: true, shortCode: true },
        });

        if (formData.utmSets && formData.utmSets.length > 0) {
          const utmParamsToCreate = formData.utmSets.map((utmSet) => ({
            shortLinkId: shortLink.id,
            source: utmSet.source || null,
            medium: utmSet.medium || null,
            campaign: utmSet.campaign,
            term: utmSet.term || null,
            content: utmSet.content || null,
          }));

          await tx.uTMParam.createMany({
            data: utmParamsToCreate,
          });
          console.log(
            `Created ${utmParamsToCreate.length} UTMParam sets for link ${shortLink.id}`
          );
        }

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
            data: tags.map((tag) => ({
              linkId: shortLink.id,
              tagId: tag.id,
            })),
            skipDuplicates: true,
          });
          console.log(
            `Associated ${tags.length} tags with link ${shortLink.id}`
          );
        }

        return shortLink;
      });

      revalidatePath("/dashboard/links");

      return { shortCode: result.shortCode };
    } catch (error) {
      console.error("Error in shortenUrl transaction:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        if ((error.meta as any)?.target?.includes("shortCode")) {
          throw new Error(
            `The alias "${shortCode}" is already taken or was generated concurrently. Please try again.`
          );
        }
      }

      if (error instanceof Error) throw error;
      throw new Error(
        "Failed to create the short link due to a database error."
      );
    }
  });
