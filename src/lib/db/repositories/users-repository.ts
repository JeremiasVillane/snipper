import type { Prisma, User } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email },
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
