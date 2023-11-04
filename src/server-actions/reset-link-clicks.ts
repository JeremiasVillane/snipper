"use server";

import { prisma } from "@/libs";

export default async function resetLinkClicks(id: string) {
  const result = await prisma.$transaction(async (tx) => {
    const url = await tx.url.findUnique({
      where: {
        id,
      },
    });

    if (!url) return null;

    await tx.url.update({
      where: {
        id,
      },
      data: {
        clicks: 0,
      },
    });
  });

  if (!result) return null;
}
