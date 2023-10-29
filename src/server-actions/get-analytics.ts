"use server";

import { prisma } from "@/libs";

export default async function getAnalytics(code: string) {
  if (typeof code !== "string") return null;

  const analytic = await prisma.urlAnalytic.findFirst({
    where: {
      url: {
        urlCode: code,
      },
    },
    include: {
      url: true,
    },
  });

  if (!analytic) {
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
      clicked: analytic.clicked,
      url: {
        originalUrl: analytic.url.originalUrl,
        shortUrl: analytic.url.shortUrl,
        urlCode: analytic.url.urlCode,
      },
    },
  };
}
