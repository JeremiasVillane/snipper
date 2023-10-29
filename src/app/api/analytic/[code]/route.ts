import { prisma } from "@/libs";
import { NextResponse } from "next/server";

interface Params {
  code: string;
}

export async function GET(request: undefined, { params }: { params: Params }) {
  const { code } = params;

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
    return NextResponse.json({
      statusCode: 400,
      error: {
        message: "Analytic not found!",
      },
      data: null,
    });
  }

  return NextResponse.json({
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
  });
}
