import { UTMParam } from "@prisma/client";
import bcrypt from "bcryptjs";

import { generateShortCode } from "@/lib/helpers";
import { CreateLinkFormData, UpdateLinkFormData } from "@/lib/schemas";
import { ShortLinkFromRepository } from "@/lib/types";

import { prisma } from "../prisma";

export const shortLinksRepository = {
  async create(data: CreateLinkFormData, userId: string) {
    let shortCode: string;
    if (data.shortCode) {
      const existingLink = await this.findByShortCode(data.shortCode);
      if (existingLink) {
        throw new Error(
          `The alias "${data.shortCode}" is already taken. Please choose another one.`,
        );
      }
      shortCode = data.shortCode;
    } else {
      shortCode = generateShortCode();
    }

    const existingUrl = await this.findByOriginalUrl(data.originalUrl, userId);
    if (existingUrl) {
      throw new Error(
        `The url "${data.originalUrl}" already exists in your dashboard. Please add another one or use the existing shortlink.`,
      );
    }

    const password = !!data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;

    const result = await prisma.$transaction(async (tx) => {
      const shortLink = await tx.shortLink.create({
        data: {
          ...data,
          shortCode,
          password,
          clicks: 0,
          user: { connect: { id: userId } },
        },
      });

      let createdTags: { id: string; name: string }[] = [];
      if (data.tags && data.tags.length > 0) {
        const tagOperations = data.tags.map(async (tagName) => {
          return await tx.tag.upsert({
            where: {
              userId_name: { userId, name: tagName.trim() },
            },
            update: {},
            create: { name: tagName.trim(), userId },
            select: { id: true, name: true },
          });
        });
        createdTags = await Promise.all(tagOperations);

        if (createdTags.length > 0) {
          await tx.linkTag.createMany({
            data: createdTags.map((tag) => ({
              linkId: shortLink.id,
              tagId: tag.id,
            })),
            skipDuplicates: true,
          });
          console.log(
            `Associated ${createdTags.length} tags with link ${shortLink.id}`,
          );
        }
      }

      let createdUtmParams: UTMParam[] = [];
      if (data.utmSets && data.utmSets.length > 0) {
        const utmParamsToCreate = data.utmSets.map((utmSet) => ({
          shortLinkId: shortLink.id,
          source: utmSet.source || null,
          medium: utmSet.medium || null,
          campaign: utmSet.campaign,
          term: utmSet.term || null,
          content: utmSet.content || null,
        }));

        const createUtmPromises = utmParamsToCreate.map((utmData) =>
          tx.uTMParam.create({ data: utmData }),
        );
        createdUtmParams = await Promise.all(createUtmPromises);
        console.log(
          `Created ${createdUtmParams.length} UTMParam sets for link ${shortLink.id}`,
        );
      }

      return {
        ...shortLink,
        tags: createdTags.map((t) => t.name),
        utmParams: createdUtmParams,
      };
    });

    return result;
  },

  async findById(id: string): Promise<ShortLinkFromRepository | null> {
    const shortLink = await prisma.shortLink.findUnique({
      where: { id },
      include: {
        linkTags: {
          include: { tag: true },
        },
        utmParams: true,
      },
    });
    if (!shortLink) return null;
    return {
      id: shortLink.id,
      originalUrl: shortLink.originalUrl,
      shortCode: shortLink.shortCode,
      createdAt: shortLink.createdAt,
      expiresAt: shortLink.expiresAt,
      userId: shortLink.userId,
      clicks: shortLink.clicks,
      tags: shortLink.linkTags.map((lt) => lt.tag.name),
      utmParams: shortLink.utmParams,
      isPasswordEnabled: !!shortLink.password,
    };
  },

  async findByShortCode(shortCode: string) {
    return await prisma.shortLink.findUnique({
      where: { shortCode },
    });
  },

  async findByOriginalUrl(originalUrl: string, userId: string) {
    return await prisma.shortLink.findFirst({
      where: { originalUrl, userId },
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
        utmParams: true,
      },
    });
    return shortLinks.map((link) => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      userId: link.userId,
      clicks: link.clicks,
      tags: link.linkTags.map((lt) => lt.tag.name),
      utmParams: link.utmParams,
      isPasswordEnabled: !!link.password,
    }));
  },

  async update(linkId: string, userId: string, data: UpdateLinkFormData) {
    const shortLink = await this.findById(linkId);
    if (!shortLink) {
      throw new Error("Link not found");
    }

    if (shortLink.userId !== userId) {
      throw new Error("You don't have permission to edit this link");
    }

    const password = !!data.password
      ? await bcrypt.hash(data.password, 12)
      : null;

    const result = await prisma?.$transaction(async (tx) => {
      if (data.shortCode && data.shortCode !== shortLink.shortCode) {
        try {
          const existingLink = await shortLinksRepository.findByShortCode(
            data.shortCode,
          );
          if (existingLink && existingLink.id !== linkId) {
            throw new Error("This custom alias is already taken");
          }
        } catch (error) {
          throw error;
        }
      }

      await tx.shortLink.update({
        where: { id: linkId },
        data: {
          originalUrl: data.originalUrl,
          expiresAt: data.expiresAt,
          password,
        },
      });

      let createdTags: { id: string; name: string }[] = [];
      if (data.tags && data.tags.length > 0) {
        await tx.linkTag.deleteMany({ where: { linkId } });
        const tagOperations = data.tags.map(async (tagName) => {
          return await tx.tag.upsert({
            where: {
              userId_name: { userId, name: tagName.trim() },
            },
            update: {},
            create: { name: tagName.trim(), userId },
            select: { id: true, name: true },
          });
        });
        createdTags = await Promise.all(tagOperations);

        if (createdTags.length > 0) {
          await tx.linkTag.createMany({
            data: createdTags.map((tag) => ({ linkId, tagId: tag.id })),
            skipDuplicates: true,
          });
          console.log(`Synced ${createdTags.length} tags for link ${linkId}`);
        }
      }

      let createdUtmParams: UTMParam[] = [];
      if (data.utmSets && data.utmSets.length > 0) {
        await tx.uTMParam.deleteMany({ where: { shortLinkId: linkId } });
        const utmParamsToCreate = data.utmSets.map((utmSet) => ({
          shortLinkId: linkId,
          source: utmSet.source || null,
          medium: utmSet.medium || null,
          campaign: utmSet.campaign,
          term: utmSet.term || null,
          content: utmSet.content || null,
        }));

        const createUtmPromises = utmParamsToCreate.map((utmData) =>
          tx.uTMParam.create({ data: utmData }),
        );
        createdUtmParams = await Promise.all(createUtmPromises);
        console.log(
          `Synced ${utmParamsToCreate.length} UTMParam sets for link ${linkId}`,
        );
      }

      return {
        ...shortLink,
        tags:
          createdTags.length > 0
            ? createdTags.map((t) => t.name)
            : (shortLink.tags ?? []),
        utmParams:
          createdUtmParams.length > 0
            ? createdUtmParams
            : (shortLink.utmParams ?? []),
      };
    });

    return result;
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
