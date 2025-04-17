import { prisma } from "@/lib/db/prisma";
import type { Prisma, User } from "@prisma/client";

export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    return user;
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        password: data.password,
      },
    });
    return user;
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: data,
    });
    return updatedUser;
  },

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({
      where: { id: id },
    });

    return true;
  },
};
