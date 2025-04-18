"use server";

import { shortLinksRepository } from "@/lib/db/repositories";

export async function verifyPassword(shortCode: string, password: string) {
  const shortLink = await shortLinksRepository.findByShortCode(shortCode);

  if (!shortLink) {
    throw new Error("Short link not found");
  }

  if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
    throw new Error("This link has expired");
  }

  if (!shortLink.password) {
    return { success: true, url: shortLink.originalUrl };
  }

  if (shortLink.password !== password) {
    throw new Error("Incorrect password");
  }

  return { success: true, url: shortLink.originalUrl };
}
