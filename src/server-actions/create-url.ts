"use server";

import { prisma, urlSnipper } from "@/libs";
import { isWebUri } from "valid-url";

const host = process.env.NEXT_PUBLIC_APP_URL;

export default async function createUrl(url: string, userEmail: string) {
  const { urlCode, shortUrl } = urlSnipper(host!);

  if (!isWebUri(url)) {
    return {
      stausCode: 400,
      error: {
        message: "Invalid URL",
      },
      data: null,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const originalUrl = await tx.url.findFirst({
      where: {
        originalUrl: url,
      },
    });

    if (originalUrl) return originalUrl;

    const currentUser = await tx.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    const newUrl = await tx.url.create({
      data: {
        originalUrl: url,
        shortUrl,
        urlCode,
        userId: currentUser?.id,
      },
    });

    await tx.urlAnalytics.create({
      data: {
        clicks: 0,
        url: {
          connect: {
            id: newUrl.id,
          },
        },
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
