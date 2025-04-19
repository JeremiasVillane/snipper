"use server";

import { auth } from "@/lib/auth";
import { shortLinksRepository } from "@/lib/db/repositories";
import { ShortLinkFromRepository } from "@/lib/types";

export async function getUserShortLinks(): Promise<ShortLinkFromRepository[]> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return shortLinksRepository.findByUserId(session.user.id);
}
