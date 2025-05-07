"use server";

import { shortLinksRepository } from "@/lib/db/repositories";
import bcrypt from "bcryptjs";

export async function verifyPassword(shortCode: string, plainPassword: string) {
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

  if (!!shortLink.password) {
    const passwordMatch = await bcrypt.compare(
      plainPassword,
      shortLink.password
    );
    if (!passwordMatch) throw new Error("Incorrect password");
  }

  return { success: true, url: shortLink.originalUrl };
}
