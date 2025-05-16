import type {
  CustomDomain,
  Plan,
  Prisma,
  ShortLink,
  Subscription,
  User,
} from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export const usersRepository = {
  async findById(id: string): Promise<
    | (User & {
        subscriptions: (Subscription & { plan: Plan })[];
        _count: { shortLinks: number };
      })
    | null
  > {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { shortLinks: true } },
        subscriptions: {
          include: { plan: true },
        },
      },
    });
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user;
  },

  async findByCustomDomain(domain: string) {
    const user = await prisma.user.findFirst({
      where: {
        customDomains: {
          some: {
            domain,
          },
        },
      },
      include: {
        shortLinks: {
          where: { customDomain: { domain } },
          include: { customDomain: { select: { domain: true } } },
        },
      },
    });

    return user;
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });
    return user;
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser;
  },

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({
      where: { id },
    });

    return true;
  },
};
