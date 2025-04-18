"use server";

import { auth } from "@/lib/auth";
import { apiKeysRepository } from "@/lib/db/repositories";
import { revalidatePath } from "next/cache";

export async function deleteApiKey(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  await apiKeysRepository.delete(id);

  revalidatePath("/dashboard/api-keys");
  return { success: true };
}
