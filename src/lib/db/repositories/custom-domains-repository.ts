import { prisma } from "../prisma";

export const customDomainsRepository = {
  async create({ domain }: { domain: string }, userId: string) {
    const existingDomain = await this.findByDomain(domain);

    if (existingDomain) {
      throw new Error("Custom domain already exists");
    }

    try {
      const newDomain = await prisma.customDomain.create({
        data: {
          domain,
          user: { connect: { id: userId } },
        },
      });
      return newDomain;
    } catch (error) {
      console.error("Error creating custom domain:", error);
      throw new Error("Failed to create custom domain");
    }
  },

  async findByUserId(userId: string) {
    return prisma.customDomain.findMany({
      where: { userId },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async findByDomain(domain: string) {
    return prisma.customDomain.findUnique({
      where: { domain },
    });
  },

  async findByDomainAndShortCode(domain: string, shortCode: string) {
    return prisma.customDomain.findFirst({
      where: {
        domain,
        user: { shortLinks: { some: { shortCode } } },
      },
    });
  },

  async getShortLinksByDomain(domain: string, userId: string) {
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

  async delete(id: string, userId: string) {
    await prisma.customDomain.delete({
      where: { id, userId },
    });
    return true;
  },
};
