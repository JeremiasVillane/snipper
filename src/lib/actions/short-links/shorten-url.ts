"use server";

import { auth } from "@/lib/auth";
import { shortLinksRepository, tagsRepository } from "@/lib/db/repositories";
import {
  buildShortUrl,
  generateQRCode,
  generateShortCode,
} from "@/lib/helpers";
import { CreateLinkFormData, createLinkSchema } from "@/lib/schemas";
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
    throw new Error("Not available on demo account");
  }

  const parsedData = await createLinkSchema.parseAsync(formData);

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

  let shortCode: string;
  if (session.user && formData.shortCode) {
    try {
      shortCodeSchema.parse(formData.shortCode);

      const existingLink = await shortLinksRepository.findByShortCode(
        formData.shortCode
      );
      if (existingLink) {
        throw new Error("This custom alias is already taken");
      }

      shortCode = formData.shortCode;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  } else {
    shortCode = generateShortCode();
  }

  let qrCodeUrl: string | null = null;
  if (session.user) {
    qrCodeUrl = await generateQRCode(buildShortUrl(shortCode));
  }

  const shortLink = await shortLinksRepository.create({
    originalUrl: finalUrl,
    shortCode,
    expiresAt: parsedData.expiresAt || null,
    password: parsedData.password || null,
    user: session?.user?.id ? { connect: { id: session.user.id } } : undefined,
    qrCodeUrl,
  });

  if (session.user && formData.tags && formData.tags.length > 0) {
    for (const tagName of formData.tags) {
      const tag = await tagsRepository.findOrCreate(tagName, session.user.id);
      await tagsRepository.addTagToLink(shortLink.id, tag.id);
    }
  }

  const shortUrl = buildShortUrl(shortCode);
  return { shortUrl, shortCode, qrCodeUrl };
}
