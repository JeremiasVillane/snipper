import { prisma } from "@/libs";
import { NextResponse } from "next/server";

interface Params {
  code: string;
}

export async function GET(request: undefined, { params }: { params: Params }) {
  const { code } = params;

  if (typeof code !== "string") return null;

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

  if (!result) {
    return NextResponse.json({
      statusCode: 400,
      error: {
        message: "Invalid short URL code!",
      },
      data: null,
    });
  }

  return NextResponse.redirect(result.originalUrl);
}
