import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { ShortLinkFromRepository } from "@/lib/types";

export const shortLinksRepository = {
  async create(data: Prisma.ShortLinkCreateInput) {
    const shortLink = await prisma.shortLink.create({
      data: {
        ...data,
        clicks: data.clicks || 0,
      },
    });
    return shortLink;
  },

  async findById(id: string): Promise<ShortLinkFromRepository | null> {
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
      tags: shortLink.linkTags.map((lt) => lt.tag.name),
    };
  },

  async findByShortCode(shortCode: string) {
    return await prisma.shortLink.findUnique({
      where: { shortCode },
    });
  },

  async findByUserId(userId: string): Promise<ShortLinkFromRepository[]> {
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
      tags: link.linkTags.map((lt) => lt.tag.name),
    }));
  },

  async update(id: string, data: Prisma.ShortLinkUpdateInput) {
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
      tags: link.linkTags.map((lt) => lt.tag.name),
    }));
  },
};
