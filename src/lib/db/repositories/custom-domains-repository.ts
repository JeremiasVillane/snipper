import { CustomDomain, ShortLink } from "@prisma/client";

import { CustomDomainFromRepository } from "@/lib/types";

import { prisma } from "../prisma";

export const customDomainsRepository = {
  async create(
    {
      domain,
      isLinkHubEnabled,
      linkHubTitle,
      linkHubDescription,
      shortLinkIds,
    }: {
      domain: string;
      isLinkHubEnabled?: boolean;
      linkHubTitle?: string | null;
      linkHubDescription?: string | null;
      shortLinkIds: string[];
    },
    userId: string,
  ): Promise<CustomDomainFromRepository> {
    const existingDomain = await this.findByDomain(domain);

    if (existingDomain) {
      throw new Error(
        `The custom domain "${domain}" already exists. Please choose another one.`,
      );
    }

    try {
      const newDomain = await prisma.customDomain.create({
        data: {
          domain,
          isLinkHubEnabled,
          linkHubTitle,
          linkHubDescription,
          user: { connect: { id: userId } },
          shortLinks: {
            connect: shortLinkIds.map((id) => ({ id })),
          },
        },
        include: {
          shortLinks: true,
        },
      });
      return newDomain;
    } catch (error) {
      console.error("Error creating custom domain:", error);
      throw new Error("Failed to create custom domain and associate links");
    }
  },

  async findById(id: string): Promise<CustomDomainFromRepository | null> {
    return prisma.customDomain.findUnique({
      where: { id },
      include: { shortLinks: true },
    });
  },

  async findByUserId(userId: string): Promise<CustomDomainFromRepository[]> {
    return prisma.customDomain.findMany({
      where: { userId },
      include: { shortLinks: true },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async findByDomain(domain: string): Promise<CustomDomain | null> {
    return prisma.customDomain.findUnique({
      where: { domain },
    });
  },

  async findForeignDomain(
    domain: string,
    userId: string,
  ): Promise<CustomDomain | null> {
    return prisma.customDomain.findFirst({
      where: {
        domain,
        userId: { not: userId },
      },
    });
  },

  async findByDomainAndShortCode(
    domain: string,
    shortCode: string,
  ): Promise<CustomDomainFromRepository | null> {
    return prisma.customDomain.findFirst({
      where: {
        domain,
        shortLinks: { some: { shortCode } },
      },
      include: {
        shortLinks: {
          where: { shortCode },
        },
      },
    });
  },

  async getShortLinksByDomain(
    domain: string,
    userId: string,
  ): Promise<ShortLink[]> {
    return prisma.shortLink.findMany({
      where: {
        customDomain: { domain },
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async update(
    {
      id,
      domain,
      isLinkHubEnabled,
      linkHubTitle,
      linkHubDescription,
      shortLinkIds,
    }: {
      id: string;
      domain: string;
      isLinkHubEnabled?: boolean;
      linkHubTitle?: string | null;
      linkHubDescription?: string | null;
      shortLinkIds: string[];
    },
    userId: string,
  ): Promise<CustomDomainFromRepository> {
    const currentDomain = await prisma.customDomain.findUnique({
      where: { id, userId },
      include: { shortLinks: true },
    });

    if (!currentDomain) {
      throw new Error(
        `Custom domain "${domain}" not found or does not belong to this user.`,
      );
    }

    if (domain !== currentDomain.domain) {
      const foreignDomain = await this.findForeignDomain(domain, userId);
      if (foreignDomain) {
        throw new Error(
          `The custom domain "${domain}" already exists for another user. Please choose another one.`,
        );
      }
    }

    const currentLinkIds = currentDomain.shortLinks.map((link) => link.id);

    const linksToConnect = shortLinkIds.filter(
      (id) => !currentLinkIds.includes(id),
    );
    const linksToDisconnect = currentLinkIds.filter(
      (id) => !shortLinkIds.includes(id),
    );

    try {
      const updatedDomain = await prisma.customDomain.update({
        where: { id },
        data: {
          domain,
          isLinkHubEnabled,
          linkHubTitle,
          linkHubDescription,
          shortLinks: {
            disconnect: linksToDisconnect.map((id) => ({ id })),
            connect: linksToConnect.map((id) => ({ id })),
          },
        },
        include: { shortLinks: true },
      });

      return updatedDomain;
    } catch (error) {
      console.error(`Error updating custom domain ${id}:`, error);
      throw new Error("Failed to update custom domain and associated links");
    }
  },

  async delete(id: string, userId: string): Promise<{ message: string }> {
    try {
      const deleted = await prisma.customDomain.delete({
        where: { id, userId },
      });

      return {
        message: `Custom domain ${deleted.domain} deleted successfully`,
      };
    } catch (error) {
      console.error(`Error deleting custom domain ${id}:`, error);
      if (
        !!error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2025"
      ) {
        throw new Error(
          `Custom domain not found or does not belong to this user.`,
        );
      }
      throw new Error("Failed to delete custom domain");
    }
  },
};
