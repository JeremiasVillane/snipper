"use server";

import { prisma } from "@/libs";

export default async function getAnalytics(code: string) {
  if (typeof code !== "string") return null;

  const analytics = await prisma.urlAnalytics.findFirst({
    where: {
      url: {
        urlCode: code,
      },
    },
    include: {
      url: true,
    },
  });

  if (!analytics) {
    return {
      statusCode: 400,
      error: {
        message: "Analytics not found!",
      },
      data: null,
    };
  }

  return {
    statusCode: 200,
    error: null,
    data: {
      clicks: analytics.clicks,
      url: {
        originalUrl: analytics.url.originalUrl,
        shortUrl: analytics.url.shortUrl,
        urlCode: analytics.url.urlCode,
      },
    },
  };
}
