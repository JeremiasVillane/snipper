"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/libs";
import { currentUser, getServerSession } from "next-auth";

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  const user: currentUser | any = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      urls: true,
    },
  });

  return user;
}
