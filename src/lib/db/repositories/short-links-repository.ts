import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../prisma";

export const shortLinksRepository = {
  async create(
    data: Omit<Prisma.ShortLinkCreateInput, "createdAt" | "clicks"> & {
      createdAt?: Date;
      clicks?: number;
    }
  ) {
    const shortLink = await prisma.shortLink.create({
      data: {
        ...data,
        createdAt: data.createdAt || new Date(),
        clicks: data.clicks || 0,
      },
    });
    return shortLink;
  },

  async findById(id: string) {
    const shortLink = await prisma.shortLink.findUnique({
      where: { id },
      include: {
        linkTags: {
          include: { tag: true },
        },
      },
    });
    if (!shortLink) return null;
    return {
      ...shortLink,
      tags: shortLink.linkTags.map((lt) => lt.tag),
    };
  },

  async findByShortCode(shortCode: string) {
    return await prisma.shortLink.findUnique({
      where: { shortCode },
    });
  },

  async findByUserId(userId: string) {
    const shortLinks = await prisma.shortLink.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        linkTags: {
          include: { tag: true },
        },
      },
    });
    return shortLinks.map((link) => ({
      ...link,
      tags: link.linkTags.map((lt) => lt.tag),
    }));
  },

  async update(id: string, data: Partial<Prisma.ShortLinkUpdateInput>) {
    return await prisma.shortLink.update({
      where: { id },
      data,
    });
  },

  async incrementClicks(id: string) {
    await prisma.shortLink.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
    return true;
  },

  async delete(id: string) {
    await prisma.shortLink.delete({
      where: { id },
    });
    return true;
  },

  async cleanupExpired() {
    const now = new Date();
    const expiredLinks = await prisma.shortLink.findMany({
      where: {
        expiresAt: { not: null, lt: now },
      },
    });
    for (const link of expiredLinks) {
      await prisma.shortLink.delete({ where: { id: link.id } });
    }
    return expiredLinks.length;
  },

  async search(userId: string, query: string) {
    const searchPattern = `%${query}%`;
    const shortLinks = await prisma.shortLink.findMany({
      where: {
        userId,
        originalUrl: { contains: query, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        linkTags: {
          include: { tag: true },
        },
      },
    });
    return shortLinks.map((link) => ({
      ...link,
      tags: link.linkTags.map((lt) => lt.tag),
    }));
  },
};
