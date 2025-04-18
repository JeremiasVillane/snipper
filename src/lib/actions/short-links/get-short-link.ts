"use server";

import { auth } from "@/lib/auth";
import { shortLinksRepository } from "@/lib/db/repositories";

export async function getShortLink(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  const shortLink = await shortLinksRepository.findById(id);
  if (!shortLink || shortLink.userId !== session.user.id) {
    throw new Error("Short link not found");
  }

  return shortLink;
}
