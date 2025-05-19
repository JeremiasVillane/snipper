import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { buildShortUrl, generateQRCode, validateApiKey } from "@/lib/helpers";
import { createLinksSchemaAPI } from "@/lib/schemas";
import { checkURLReputation, protectRequest } from "@/lib/security";
import { APIGetAllLinks, APIPostLink } from "@/lib/types";

// GET /api/v1/links - List all links for the authenticated user
export async function GET(
  req: NextRequest,
): Promise<NextResponse<APIGetAllLinks | { error: string }>> {
  const decision = await protectRequest(
    req,
    {
      refillRate: 5,
      interval: 15,
      capacity: 100,
    },
    "api:get:links",
  );

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": decision.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(
            decision.reset.getTime() / 100,
          ).toString(),
        },
      },
    );
  }

  const apiKeyRecord = await validateApiKey(req);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await shortLinksRepository.findByUserId(apiKeyRecord.userId);

  const formattedLinks = links.map((link) => ({
    id: link.id,
    userId: link.userId,
    originalUrl: link.originalUrl,
    shortUrl: buildShortUrl(link.shortCode, link.customDomain?.domain),
    shortCode: link.shortCode,
    title: link.title,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt,
    expirationUrl: link.expirationUrl,
    clicks: link.clicks,
    tags: link.tags ?? [],
    utmParams: link.utmParams ?? [],
    customOgImageUrl: link.customOgImageUrl,
    customOgTitle: link.customOgTitle,
    customOgDescription: link.customOgDescription,
  }));

  return NextResponse.json({
    links: formattedLinks,
    remaining: decision.remaining,
  } satisfies APIGetAllLinks);
}

// POST /api/v1/links - Create a new short link
export async function POST(
  req: NextRequest,
): Promise<NextResponse<APIPostLink | { error: string }>> {
  const decision = await protectRequest(
    req,
    {
      refillRate: 1,
      interval: 10,
      capacity: 100,
    },
    "api:post:link",
  );

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": decision.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(
            decision.reset.getTime() / 100,
          ).toString(),
        },
      },
    );
  }

  const apiKeyRecord = await validateApiKey(req);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = createLinksSchemaAPI.parse(body);

    const { isSafe, isUp } = await checkURLReputation(
      validatedData.originalUrl.replace(/^https?:\/\//, ""),
    );

    if (!isSafe) {
      return NextResponse.json(
        { error: "The URL you provided is not safe." },
        { status: 400 },
      );
    }

    if (!isUp) {
      return NextResponse.json(
        { error: "The URL you provided is not reachable." },
        { status: 400 },
      );
    }

    if (validatedData.shortCode) {
      const existingLink = await shortLinksRepository.findByShortCode(
        validatedData.shortCode,
      );
      if (existingLink) {
        return NextResponse.json(
          { error: "Short code already exists." },
          { status: 400 },
        );
      }
    }

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
      link: {
        id: shortLink.id,
        originalUrl: shortLink.originalUrl,
        shortUrl: buildShortUrl(shortLink.shortCode),
        shortCode: shortLink.shortCode,
        title: shortLink.title,
        createdAt: shortLink.createdAt,
        expiresAt: shortLink.expiresAt,
        expirationUrl: shortLink.expirationUrl,
        tags: shortLink.tags,
        utmParams: shortLink.utmParams,
        qrCodeUrl,
      },
      remaining: decision.remaining,
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
