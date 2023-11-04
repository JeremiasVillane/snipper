"use server";

import { prisma, urlSnipper } from "@/libs";

const host = process.env.NEXT_PUBLIC_APP_URL;

export default async function createUrl(url: string, userEmail: string) {
  const { urlCode, shortUrl } = urlSnipper(host!);

  const result = await prisma.$transaction(async (tx) => {
    const currentUser = await tx.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    const originalUrl = await tx.url.findFirst({
      where: {
        originalUrl: url,
        userId: currentUser?.id,
      },
    });

    if (originalUrl) return originalUrl;

    const newUrl = await tx.url.create({
      data: {
        originalUrl: url,
        shortUrl,
        urlCode,
        userId: currentUser?.id,
        clicks: 0,
      },
    });

    return newUrl;
  });

  if (!result) {
    return {
      stausCode: 400,
      error: {
        message: "Database error. Please try again.",
      },
      data: null,
    };
  }

  return {
    statusCode: 200,
    error: null,
    data: {
      originalUrl: result.originalUrl,
      shortUrl: result.shortUrl,
      urlCode: result.urlCode,
    },
  };
}
