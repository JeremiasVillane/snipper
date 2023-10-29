import { prisma, urlSnipper } from "@/libs";
import { NextRequest, NextResponse } from "next/server";
import { isWebUri } from "valid-url";

interface UrlRequest extends NextRequest {
  url: string;
}

export async function POST(request: UrlRequest) {
  const { url } = await request.json(); // JSON.parse(request.body)
  const host = process.env.NEXT_PUBLIC_API_URL;
  const { urlCode, shortUrl } = urlSnipper(host!);

  if (!isWebUri(url)) {
    return NextResponse.json({
      stausCode: 400,
      error: {
        message: "Invalid URL",
      },
      data: null,
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    const originalUrl = await tx.url.findFirst({
      where: {
        originalUrl: url,
      },
    });

    if (originalUrl) return originalUrl;

    const newUrl = await tx.url.create({
      data: {
        originalUrl: url,
        shortUrl,
        urlCode,
      },
    });

    await tx.urlAnalytic.create({
      data: {
        clicked: 0,
        url: {
          connect: {
            id: newUrl.id,
          },
        },
      },
    });

    return newUrl;
  });

  return NextResponse.json({
    statusCode: 200,
    error: null,
    data: {
      originalUrl: result.originalUrl,
      shortUrl: result.shortUrl,
      urlCode: result.urlCode,
    },
  });
}
