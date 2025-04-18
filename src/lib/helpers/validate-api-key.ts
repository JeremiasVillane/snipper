import type { NextRequest } from "next/server";
import { apiKeysRepository } from "../db/repositories";

export async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const apiKey = authHeader.substring(7);
  const apiKeyRecord = await apiKeysRepository.findByKey(apiKey);

  if (!apiKeyRecord) {
    return null;
  }

  if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
    return null;
  }

  await apiKeysRepository.updateLastUsed(apiKeyRecord.id);

  return apiKeyRecord;
}
