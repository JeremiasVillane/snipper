"use server";

import { auth } from "@/lib/auth";
import { CreateLinkFormData, createLinkSchema } from "@/lib/schemas";
import { prisma } from "@/lib/db/prisma";
import { shortLinksRepository } from "@/lib/db/repositories";
import { revalidatePath } from "next/cache";

export async function updateShortLink(
  linkId: string,
  formData: CreateLinkFormData
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }
  // if (session.user.email === "demo@example.com") {
  //   throw new Error("This feature is not available for demo accounts.");
  // }

  const parsedData = await createLinkSchema.parseAsync(formData);

  try {
    const result = await prisma?.$transaction(async (tx) => {
      const currentLink = await tx.shortLink.findUnique({
        where: { id: linkId, userId: session.user.id! },
        select: { id: true, shortCode: true },
      });

      if (!currentLink) {
        throw new Error(
          "Link not found or you do not have permission to edit it."
        );
      }

      if (
        parsedData.shortCode &&
        parsedData.shortCode !== currentLink.shortCode
      ) {
        try {
          const existingLink = await shortLinksRepository.findByShortCode(
            parsedData.shortCode
          );
          if (existingLink && existingLink.id !== linkId) {
            throw new Error("This custom alias is already taken");
          }
        } catch (error) {
          throw error;
        }
      }

      await tx.shortLink.update({
        where: { id: linkId },
        data: {
          originalUrl: parsedData.originalUrl,
          expiresAt: parsedData.expiresAt,
          password: parsedData.password,
          // description: parsedData.description,
        },
      });

      await tx.linkTag.deleteMany({ where: { linkId } });
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
          data: tags.map((tag) => ({ linkId, tagId: tag.id })),
          skipDuplicates: true,
        });
        console.log(`Synced ${tags.length} tags for link ${linkId}`);
      }

      await tx.uTMParam.deleteMany({ where: { shortLinkId: linkId } });
      if (parsedData.utmSets && parsedData.utmSets.length > 0) {
        const utmParamsToCreate = parsedData.utmSets.map((utmSet) => ({
          shortLinkId: linkId,
          source: utmSet.source || null,
          medium: utmSet.medium || null,
          campaign: utmSet.campaign,
          term: utmSet.term || null,
          content: utmSet.content || null,
        }));
        await tx.uTMParam.createMany({ data: utmParamsToCreate });
        console.log(
          `Synced ${utmParamsToCreate.length} UTMParam sets for link ${linkId}`
        );
      }

      return { id: linkId };
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/analytics/${linkId}`);

    return { success: true, linkId: result.id };
  } catch (error) {
    console.error(`Error updating link ${linkId}:`, error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to update the short link due to a database error.");
  }
}
