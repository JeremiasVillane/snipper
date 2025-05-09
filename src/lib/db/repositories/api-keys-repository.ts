import type { ApiKey, Prisma, User } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type ApiKeyWithUser = ApiKey & { user: User };

export const apiKeysRepository = {
  async create(data: Prisma.ApiKeyCreateInput): Promise<ApiKey> {
    const apiKey = await prisma.apiKey.create({
      data,
    });
    return apiKey;
  },

  async findByUserId(userId: string): Promise<ApiKey[]> {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async findByKey(key: string): Promise<ApiKeyWithUser | null> {
    const apiKeyWithUser = await prisma.apiKey.findFirst({
      where: { key },
      include: {
        user: true,
      },
    });

    return apiKeyWithUser;
  },

  async updateLastUsed(id: string): Promise<boolean> {
    await prisma.apiKey.update({
      where: { id },
      data: { lastUsed: new Date() },
    });

    return true;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    await prisma.apiKey.delete({
      where: { id, userId },
    });

    return true;
  },
};
