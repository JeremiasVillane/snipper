"use server";

import { auth } from "@/lib/auth";
import { shortLinksRepository } from "@/lib/db/repositories";

export async function getUserShortLinks() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return shortLinksRepository.findByUserId(session.user.id);
}
