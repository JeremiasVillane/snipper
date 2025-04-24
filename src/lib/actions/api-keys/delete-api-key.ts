"use server";

import { auth } from "@/lib/auth";
import { apiKeysRepository } from "@/lib/db/repositories";
import { revalidatePath } from "next/cache";

export async function deleteApiKey(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (session.user.email === "demo@example.com") {
    throw new Error("Not available on demo account")
  }

  await apiKeysRepository.delete(id);

  revalidatePath("/dashboard/api-keys");
  return { success: true };
}
