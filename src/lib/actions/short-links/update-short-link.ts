"use server";

import { auth } from "@/lib/auth";
import { shortLinksRepository, tagsRepository } from "@/lib/db/repositories";
import { buildShortUrl, generateQRCode } from "@/lib/helpers";
import { CreateLinkFormData, createLinkSchema } from "@/lib/schemas";
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

export async function updateShortLink(
  id: string,
  formData: CreateLinkFormData
) {
  const parsedData = await createLinkSchema.parseAsync(formData);

  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  const shortLink = await shortLinksRepository.findById(id);
  if (!shortLink || shortLink.userId !== session.user.id) {
    throw new Error("Short link not found");
  }

  if (formData.shortCode && formData.shortCode !== shortLink.shortCode) {
    try {
      shortCodeSchema.parse(formData.shortCode);

      const existingLink = await shortLinksRepository.findByShortCode(
        formData.shortCode
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

  let finalUrl = parsedData.originalUrl;
  if (formData.utmParams) {
    const urlObj = new URL(finalUrl);
    if (formData.utmParams.source)
      urlObj.searchParams.append("utm_source", formData.utmParams.source);
    if (formData.utmParams.medium)
      urlObj.searchParams.append("utm_medium", formData.utmParams.medium);
    if (formData.utmParams.campaign)
      urlObj.searchParams.append("utm_campaign", formData.utmParams.campaign);
    if (formData.utmParams.term)
      urlObj.searchParams.append("utm_term", formData.utmParams.term);
    if (formData.utmParams.content)
      urlObj.searchParams.append("utm_content", formData.utmParams.content);
    finalUrl = urlObj.toString();
  }

  const updatedShortLink = await shortLinksRepository.update(id, {
    originalUrl: finalUrl,
    shortCode: formData.shortCode || shortLink.shortCode,
    expiresAt:
      formData.expiresAt !== undefined
        ? formData.expiresAt
        : shortLink.expiresAt,
    password:
      formData.password !== undefined ? formData.password : shortLink.password,
  });

  if (formData.tags) {
    const tagIds = [];
    for (const tagName of formData.tags) {
      const tag = await tagsRepository.findOrCreate(tagName, session.user.id);
      tagIds.push(tag.id);
    }
    await tagsRepository.updateLinkTags(id, tagIds);
  }

  if (formData.shortCode && formData.shortCode !== shortLink.shortCode) {
    const qrCodeUrl = await generateQRCode(buildShortUrl(formData.shortCode));
    await shortLinksRepository.update(id, { qrCodeUrl });
  }

  revalidatePath("/dashboard");
  return updatedShortLink;
}
