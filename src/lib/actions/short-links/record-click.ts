"use server";

import { auth } from "@/lib/auth";
import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";

export async function recordClick(
  shortCode: string,
  data: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
  }
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (session.user.email === "demo@example.com") {
    throw new Error("Not available on demo account");
  }

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
  });

  await shortLinksRepository.incrementClicks(shortLink.id);

  return shortLink.originalUrl;
}
