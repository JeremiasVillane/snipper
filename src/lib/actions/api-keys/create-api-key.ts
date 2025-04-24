"use server";

import { auth } from "@/lib/auth";
import { apiKeysRepository } from "@/lib/db/repositories";
import { generateApiKey } from "@/lib/helpers";
import { revalidatePath } from "next/cache";

export async function createApiKey(data: { name: string; expiresAt?: Date }) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (session.user.email === "demo@example.com") {
    throw new Error("Not available on demo account");
  }

  const key = generateApiKey();

  const apiKey = await apiKeysRepository.create({
    user: { connect: { id: session.user.id } },
    name: data.name,
    key,
    expiresAt: data.expiresAt || null,
  });

  revalidatePath("/dashboard/api-keys");
  return { id: apiKey.id, key };
}
