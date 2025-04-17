"use server";

import { shortLinksRepository, tagsRepository } from "@/lib/db/repositories";
import { generateQRCode, generateShortCode } from "@/lib/helpers";
import { auth, authOptions } from "@/lib/auth";
import { z } from "zod";

const shortenUrlSchema = z.object({
  url: z.string().url(),
  customAlias: z.string().optional(),
  expiresAt: z.date().optional(),
  password: z.string().optional(),
  tags: z.array(z.string()).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

const customAliasSchema = z
  .string()
  .min(3, "Custom alias must be at least 3 characters")
  .max(20, "Custom alias cannot exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9-_]+$/,
    "Only alphanumeric characters, hyphens, and underscores are allowed"
  );

export async function shortenUrl(
  url: string,
  customAlias?: string,
  expiresAt?: Date,
  password?: string,
  tags?: string[],
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }
) {
  const parsedUrl = shortenUrlSchema.parse({
    url,
    customAlias,
    expiresAt,
    password,
    tags,
    utmSource: utmParams?.source,
    utmMedium: utmParams?.medium,
    utmCampaign: utmParams?.campaign,
    utmTerm: utmParams?.term,
    utmContent: utmParams?.content,
  });

  const session = await auth();
  const user = session?.user;

  let finalUrl = parsedUrl.url;
  if (utmParams) {
    const urlObj = new URL(finalUrl);
    if (utmParams.source)
      urlObj.searchParams.append("utm_source", utmParams.source);
    if (utmParams.medium)
      urlObj.searchParams.append("utm_medium", utmParams.medium);
    if (utmParams.campaign)
      urlObj.searchParams.append("utm_campaign", utmParams.campaign);
    if (utmParams.term) urlObj.searchParams.append("utm_term", utmParams.term);
    if (utmParams.content)
      urlObj.searchParams.append("utm_content", utmParams.content);
    finalUrl = urlObj.toString();
  }

  let shortCode: string;
  if (user && customAlias) {
    try {
      customAliasSchema.parse(customAlias);

      const existingLink = await shortLinksRepository.findByShortCode(
        customAlias
      );
      if (existingLink) {
        throw new Error("This custom alias is already taken");
      }

      shortCode = customAlias;
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
  if (user) {
    qrCodeUrl = await generateQRCode(
      `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`
    );
  }

  const shortLink = await shortLinksRepository.create({
    id: crypto.randomUUID(),
    originalUrl: finalUrl,
    shortCode,
    expiresAt: parsedUrl.expiresAt || null,
    password: parsedUrl.password || null,
    user: user?.id ? { connect: { id: user.id } } : undefined,
    qrCodeUrl,
  });

  if (user && tags && tags.length > 0) {
    for (const tagName of tags) {
      const tag = await tagsRepository.findOrCreate(tagName, user.id);
      await tagsRepository.addTagToLink(shortLink.id, tag.id);
    }
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`;
  return { shortUrl, shortCode, qrCodeUrl };
}
