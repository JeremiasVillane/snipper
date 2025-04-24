"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { shortLinksRepository } from "@/lib/db/repositories";

export async function deleteShortLink(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (session.user.email === "demo@example.com") {
    throw new Error("Not available on demo account")
  }

  const shortLink = await shortLinksRepository.findById(id);
  if (!shortLink || shortLink.userId !== session.user.id) {
    throw new Error("Short link not found");
  }

  await shortLinksRepository.delete(id);
  revalidatePath("/dashboard");
}
