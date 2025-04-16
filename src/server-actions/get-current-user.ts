"use server";

import { prisma } from "@/libs";
import { authOptions } from "@/libs/auth";
import { Url } from "@prisma/client";
import { currentUser, getServerSession } from "next-auth";

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  const user: currentUser | any = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      urls: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const totalClicks = user.urls.reduce(
    (acc: number, url: Url) => acc + url.clicks,
    0
  );

  return { user, totalClicks };
}
