"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { shortCodeSchema, shortLinkPassword } from "@/lib/schemas";

import { noauthActionClient } from "../safe-action";

const verifyPasswordSchema = z.object({
  shortCode: shortCodeSchema,
  plainPassword: shortLinkPassword,
});

export const verifyPassword = noauthActionClient
  .metadata({ name: "verify-short-link-password" })
  .schema(verifyPasswordSchema)
  .action(async ({ parsedInput }) => {
    const { shortCode, plainPassword } = parsedInput;

    const shortLink = await shortLinksRepository.findByShortCode(shortCode);

    if (!shortLink) {
      throw new Error("Short link not found");
    }

    if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
      throw new Error("This link has expired");
    }

    if (!shortLink.password) {
      return { url: shortLink.originalUrl };
    }

    if (!!shortLink.password) {
      const passwordMatch = await bcrypt.compare(
        plainPassword,
        shortLink.password,
      );
      if (!passwordMatch) throw new Error("Incorrect password");
    }

    return { url: shortLink.originalUrl };
  });
