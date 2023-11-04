"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/libs";
import { Url } from "@prisma/client";
import { currentUser, getServerSession } from "next-auth";

export default async function getTotalClicks() {
  const session = await getServerSession(authOptions);

  const user: currentUser | any = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      urls: {
        select: {
          clicks: true,
        },
      },
    },
  });

  const totalClicks = user.urls.reduce(
    (acc: number, url: Url) => acc + url.clicks,
    0
  );

  return totalClicks;
}
