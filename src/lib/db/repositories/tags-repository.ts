import { prisma } from "../prisma";
import { Tag } from "@prisma/client";

export const tagsRepository = {
  async create(data: Tag) {
    return await prisma.tag.create({
      data,
    });
  },

  async findByUserId(userId: string) {
    return await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  },

  async findByName(name: string, userId: string) {
    return await prisma.tag.findFirst({
      where: { name, userId },
    });
  },

  async findOrCreate(name: string, userId: string) {
    const existingTag = await this.findByName(name, userId);
    if (existingTag) {
      return existingTag;
    }
    return await this.create({
      id: crypto.randomUUID(),
      name,
      userId,
    } as Tag);
  },

  async addTagToLink(linkId: string, tagId: string) {
    try {
      await prisma.linkTag.create({
        data: {
          linkId,
          tagId,
        },
      });
      return true;
    } catch (error: any) {
      // Ignore duplicate key errors (Prisma throws a known error code for unique constraint violations)
      if (error.code === "P2002") {
        return false;
      }
      throw error;
    }
  },

  async removeTagFromLink(linkId: string, tagId: string) {
    await prisma.linkTag.delete({
      where: {
        linkId_tagId: {
          linkId,
          tagId,
        },
      },
    });
    return true;
  },

  async updateLinkTags(linkId: string, tagIds: string[]) {
    await prisma.linkTag.deleteMany({
      where: { linkId },
    });

    if (tagIds.length > 0) {
      await prisma.linkTag.createMany({
        data: tagIds.map((tagId) => ({ linkId, tagId })),
        skipDuplicates: true,
      });
    }

    return true;
  },
};
