"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { buildShortUrl, generateShortCode } from "@/lib/helpers";
import { CreateLinkFormData, createLinkSchema } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const shortCodeSchema = z
  .string()
  .min(3, "Custom alias must be at least 3 characters")
  .max(20, "Custom alias cannot exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9-_]+$/,
    "Only alphanumeric characters, hyphens, and underscores are allowed"
  );

export async function shortenUrl(formData: CreateLinkFormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  if (session.user.email === "demo@example.com") {
    throw new Error("This feature is not available for demo accounts.");
  }

  const parsedData = await createLinkSchema.parseAsync(formData);

  const originalUrl = parsedData.originalUrl;

  let shortCode: string;
  if (parsedData.shortCode) {
    shortCodeSchema.parse(parsedData.shortCode);

    const existingLink = await prisma.shortLink.findUnique({
      where: { shortCode: parsedData.shortCode },
      select: { id: true },
    });
    if (existingLink) {
      throw new Error(
        `The alias "${parsedData.shortCode}" is already taken. Please choose another one.`
      );
    }
    shortCode = parsedData.shortCode;
  } else {
    shortCode = generateShortCode();
  }

  try {
    const password = !!parsedData.password
      ? await bcrypt.hash(parsedData.password, 12)
      : null;

    const result = await prisma.$transaction(async (tx) => {
      const shortLink = await tx.shortLink.create({
        data: {
          originalUrl: originalUrl,
          shortCode: shortCode,
          userId: session.user.id!,
          expiresAt: parsedData.expiresAt,
          password,
          // description: formData.description || null,
          clicks: 0,
        },
        select: { id: true, shortCode: true },
      });

      if (parsedData.utmSets && parsedData.utmSets.length > 0) {
        const utmParamsToCreate = parsedData.utmSets.map((utmSet) => ({
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

      if (parsedData.tags && parsedData.tags.length > 0) {
        const tagOperations = parsedData.tags.map(async (tagName) => {
          return await tx.tag.upsert({
            where: {
              userId_name: { userId: session.user.id!, name: tagName.trim() },
            },
            update: {},
            create: { name: tagName.trim(), userId: session.user.id! },
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
        console.log(`Associated ${tags.length} tags with link ${shortLink.id}`);
      }

      return shortLink;
    });

    revalidatePath("/dashboard/links");

    return {
      shortUrl: buildShortUrl(result.shortCode),
      shortCode: result.shortCode,
      success: true,
    };
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
    throw new Error("Failed to create the short link due to a database error.");
  }
}
