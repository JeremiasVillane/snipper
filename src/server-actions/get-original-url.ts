"use server";

import { prisma } from "@/libs";

export default async function getOriginalUrl(code: string) {
  const result = await prisma.$transaction(async (tx) => {
    const url = await tx.url.findUnique({
      where: {
        urlCode: code,
      },
    });

    if (!url) return null;

    await tx.urlAnalytic.update({
      where: {
        url_id: url.id,
      },
      data: {
        clicked: {
          increment: 1,
        },
      },
    });

    return url;
  });

  if (!result) return null;

  return result.originalUrl;
}
