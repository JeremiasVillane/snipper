import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { buildShortUrl, generateQRCode, validateApiKey } from "@/lib/helpers";
import { createLinksSchemaAPI } from "@/lib/schemas";
import { APIGetAllLinks, APIPostLink } from "@/lib/types";

// GET /api/v1/links - List all links for the authenticated user
export async function GET(
  request: NextRequest,
): Promise<NextResponse<APIGetAllLinks | { error: string }>> {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await shortLinksRepository.findByUserId(apiKeyRecord.userId);

  const formattedLinks = links.map((link) => ({
    id: link.id,
    userId: link.userId,
    originalUrl: link.originalUrl,
    shortUrl: buildShortUrl(link.shortCode),
    shortCode: link.shortCode,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt,
    clicks: link.clicks,
    tags: link.tags ?? [],
    utmParams: link.utmParams ?? [],
    customOgImageUrl: link.customOgImageUrl,
    customOgTitle: link.customOgTitle,
    customOgDescription: link.customOgDescription,
  }));

  return NextResponse.json({ links: formattedLinks } satisfies APIGetAllLinks);
}

// POST /api/v1/links - Create a new short link
export async function POST(
  request: NextRequest,
): Promise<NextResponse<APIPostLink | { error: string }>> {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createLinksSchemaAPI.parse(body);

    const shortLink = await shortLinksRepository.create(
      {
        originalUrl: validatedData.originalUrl,
        shortCode: validatedData.shortCode,
        tags: validatedData.tags,
        expiresAt: validatedData.expiresAt || null,
        password: validatedData.password || null,
      },
      apiKeyRecord.userId,
    );

    const qrCodeUrl = await generateQRCode(buildShortUrl(shortLink.shortCode));

    return NextResponse.json({
      id: shortLink.id,
      originalUrl: shortLink.originalUrl,
      shortUrl: buildShortUrl(shortLink.shortCode),
      shortCode: shortLink.shortCode,
      createdAt: shortLink.createdAt,
      expiresAt: shortLink.expiresAt,
      tags: shortLink.tags,
      utmParams: shortLink.utmParams,
      qrCodeUrl,
    } satisfies APIPostLink);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join("; ") },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create short link" },
      { status: 500 },
    );
  }
}
