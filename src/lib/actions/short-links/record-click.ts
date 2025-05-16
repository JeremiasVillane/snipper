"use server";

import { z } from "zod";

import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";
import { shortCodeSchema } from "@/lib/schemas";

import { noauthActionClient } from "../safe-action";

const ClickEventInputDataSchema = z.object({
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

const recordClickSchema = z.object({
  shortCode: shortCodeSchema,
  data: ClickEventInputDataSchema,
});

export const recordClick = noauthActionClient
  .metadata({ name: "record-click" })
  .schema(recordClickSchema)
  .action(async ({ parsedInput }) => {
    const { data, shortCode } = parsedInput;

    const shortLink = await shortLinksRepository.findByShortCode(shortCode);
    if (!shortLink) {
      throw new Error("Short link not found");
    }

    if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
      throw new Error("This link has expired");
    }

    await clickEventsRepository.create({
      shortLink: { connect: { id: shortLink.id } },
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      referrer: data.referrer || null,
      country: data.country || null,
      city: data.city || null,
      device: data.device || null,
      browser: data.browser || null,
      os: data.os || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
    });

    await shortLinksRepository.incrementClicks(shortLink.id);

    return;
  });
