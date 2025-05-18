import { CustomDomain, UTMParam } from "@prisma/client";
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
      let isUnique = false;

      while (!isUnique) {
        shortCode = generateShortCode();
        const existingLink = await this.findByShortCode(shortCode);
        isUnique = !existingLink;
      }
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
          originalUrl: data.originalUrl,
          shortCode,
          title: data.title,
          expiresAt: data.expiresAt,
          password,
          clicks: 0,
          user: { connect: { id: userId } },
          customOgImageUrl: data.customOgImageUrl,
          customOgTitle: data.customOgTitle,
          customOgDescription: data.customOgDescription,
          shortLinkIcon: data.shortLinkIcon,
        },
        include: {
          customDomain: true,
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
          console.info(
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
        console.info(
          `Created ${createdUtmParams.length} UTMParam sets for link ${shortLink.id}`,
        );
      }

      let createdCustomDomain: CustomDomain | null = null;
      if (!!data.customDomain) {
        const existingCustomDomain = await tx.customDomain.findFirst({
          where: {
            domain: data.customDomain,
            userId: { not: userId },
          },
        });

        if (existingCustomDomain) {
          throw new Error(
            `The custom domain "${data.customDomain}" already exists. Please choose another one.`,
          );
        }

        createdCustomDomain = await tx.customDomain.findFirst({
          where: { domain: data.customDomain, userId },
        });

        if (!createdCustomDomain) {
          createdCustomDomain = await tx.customDomain.create({
            data: {
              domain: data.customDomain,
              isLinkHubEnabled: data.isLinkHubEnabled,
              linkHubTitle: data.linkHubTitle,
              linkHubDescription: data.linkHubDescription,
              user: { connect: { id: userId } },
            },
          });

          console.info(
            `Created custom domain ${createdCustomDomain.domain} for link ${shortLink.id}`,
          );
        }

        await tx.shortLink.update({
          where: { id: shortLink.id },
          data: {
            customDomainId: createdCustomDomain.id,
          },
        });
      }

      return {
        ...shortLink,
        tags: createdTags.map((t) => t.name),
        utmParams: createdUtmParams,
        customDomain: createdCustomDomain,
        isPasswordEnabled: !!shortLink.password,
        isExpirationEnabled: !!shortLink.expiresAt,
        isCustomOgEnabled:
          !!shortLink.customOgImageUrl ||
          !!shortLink.customOgTitle ||
          !!shortLink.customOgDescription,
        isLinkHubEnabled: !!shortLink.customDomain?.isLinkHubEnabled,
        linkHubTitle: shortLink.customDomain?.linkHubTitle ?? null,
        linkHubDescription: shortLink.customDomain?.linkHubDescription ?? null,
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
        customDomain: true,
      },
    });
    if (!shortLink) return null;
    return {
      id: shortLink.id,
      originalUrl: shortLink.originalUrl,
      shortCode: shortLink.shortCode,
      title: shortLink.title,
      customDomain: shortLink.customDomain,
      createdAt: shortLink.createdAt,
      expiresAt: shortLink.expiresAt,
      expirationUrl: shortLink.expirationUrl,
      userId: shortLink.userId,
      clicks: shortLink.clicks,
      tags: shortLink.linkTags.map((lt) => lt.tag.name),
      utmParams: shortLink.utmParams,
      customOgImageUrl: shortLink.customOgImageUrl,
      customOgTitle: shortLink.customOgTitle,
      customOgDescription: shortLink.customOgDescription,
      isPasswordEnabled: !!shortLink.password,
      isExpirationEnabled: !!shortLink.expiresAt,
      isCustomOgEnabled:
        !!shortLink.customOgImageUrl ||
        !!shortLink.customOgTitle ||
        !!shortLink.customOgDescription,
      isLinkHubEnabled: !!shortLink.customDomain?.isLinkHubEnabled,
      linkHubTitle: shortLink.customDomain?.linkHubTitle ?? null,
      linkHubDescription: shortLink.customDomain?.linkHubDescription ?? null,
      shortLinkIcon: shortLink.shortLinkIcon,
    };
  },

  async findByShortCode(shortCode: string) {
    return await prisma.shortLink.findUnique({
      where: { shortCode },
      include: { customDomain: true },
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
        customDomain: true,
      },
    });
    return shortLinks.map((link) => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      title: link.title,
      customDomain: link.customDomain,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      expirationUrl: link.expirationUrl,
      userId: link.userId,
      clicks: link.clicks,
      tags: link.linkTags.map((lt) => lt.tag.name),
      utmParams: link.utmParams,
      customOgImageUrl: link.customOgImageUrl,
      customOgTitle: link.customOgTitle,
      customOgDescription: link.customOgDescription,
      isPasswordEnabled: !!link.password,
      isExpirationEnabled: !!link.expiresAt,
      isCustomOgEnabled:
        !!link.customOgImageUrl ||
        !!link.customOgTitle ||
        !!link.customOgDescription,
      isLinkHubEnabled: !!link.customDomain?.isLinkHubEnabled,
      linkHubTitle: link.customDomain?.linkHubTitle ?? null,
      linkHubDescription: link.customDomain?.linkHubDescription ?? null,
      shortLinkIcon: link.shortLinkIcon,
    }));
  },

  async findByShortCodeAndDomain(shortCode: string, domainId: string) {
    return prisma.shortLink.findFirst({
      where: {
        shortCode,
        AND: [
          { customDomainId: domainId },
          { user: { customDomains: { some: { id: domainId } } } },
        ],
      },
    });
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

    const result = await prisma.$transaction(async (tx) => {
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
          expiresAt: data.expiresAt,
          expirationUrl: data.expirationUrl,
          password,
          customOgTitle: data.customOgTitle,
          customOgDescription: data.customOgDescription,
          customOgImageUrl: data.customOgImageUrl,
          shortLinkIcon: data.shortLinkIcon,
          title: data.title,
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
          console.info(`Synced ${createdTags.length} tags for link ${linkId}`);
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
        console.info(
          `Synced ${utmParamsToCreate.length} UTMParam sets for link ${linkId}`,
        );
      }

      let createdCustomDomain: CustomDomain | null = null;
      if (!!data.customDomain) {
        const existingCustomDomain = await tx.customDomain.findFirst({
          where: { domain: data.customDomain, userId: { not: userId } },
        });

        if (!!existingCustomDomain) {
          throw new Error(
            "You don't have permission to modify this custom domain.",
          );
        }

        createdCustomDomain = await tx.customDomain.upsert({
          where: { domain: data.customDomain },
          create: {
            domain: data.customDomain,
            isLinkHubEnabled: data.isLinkHubEnabled,
            linkHubTitle: data.linkHubTitle,
            linkHubDescription: data.linkHubDescription,
            user: { connect: { id: userId } },
          },
          update: {
            isLinkHubEnabled: data.isLinkHubEnabled,
            linkHubTitle: data.linkHubTitle,
            linkHubDescription: data.linkHubDescription,
          },
        });

        if (shortLink.customDomain?.domain !== data.customDomain) {
          await tx.shortLink.update({
            where: { id: linkId },
            data: { customDomain: { connect: { id: createdCustomDomain.id } } },
          });
        }
        console.info(
          `Created custom domain ${createdCustomDomain.domain} for link ${linkId}`,
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
        customDomain: createdCustomDomain ?? shortLink.customDomain,
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
