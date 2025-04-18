"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { shortLinksRepository, tagsRepository } from "@/lib/db/repositories";
import { generateQRCode } from "@/lib/helpers";
import { z } from "zod";

const customAliasSchema = z
  .string()
  .min(3, "Custom alias must be at least 3 characters")
  .max(20, "Custom alias cannot exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9-_]+$/,
    "Only alphanumeric characters, hyphens, and underscores are allowed"
  );

export async function updateShortLink(
  id: string,
  data: {
    customAlias?: string;
    expiresAt?: Date | null;
    password?: string | null;
    tags?: string[];
  }
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  const shortLink = await shortLinksRepository.findById(id);
  if (!shortLink || shortLink.userId !== session.user.id) {
    throw new Error("Short link not found");
  }

  if (data.customAlias && data.customAlias !== shortLink.shortCode) {
    try {
      customAliasSchema.parse(data.customAlias);

      const existingLink = await shortLinksRepository.findByShortCode(
        data.customAlias
      );
      if (existingLink && existingLink.id !== id) {
        throw new Error("This custom alias is already taken");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  const updatedShortLink = await shortLinksRepository.update(id, {
    shortCode: data.customAlias || shortLink.shortCode,
    expiresAt:
      data.expiresAt !== undefined ? data.expiresAt : shortLink.expiresAt,
    password: data.password !== undefined ? data.password : shortLink.password,
  });

  if (data.tags) {
    const tagIds = [];
    for (const tagName of data.tags) {
      const tag = await tagsRepository.findOrCreate(tagName, session.user.id);
      tagIds.push(tag.id);
    }
    await tagsRepository.updateLinkTags(id, tagIds);
  }

  if (data.customAlias && data.customAlias !== shortLink.shortCode) {
    const qrCodeUrl = await generateQRCode(
      `${process.env.NEXT_PUBLIC_APP_URL}/${data.customAlias}`
    );
    await shortLinksRepository.update(id, { qrCodeUrl });
  }

  revalidatePath("/dashboard");
  return updatedShortLink;
}
