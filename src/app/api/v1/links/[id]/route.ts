import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { buildShortUrl, generateQRCode, validateApiKey } from "@/lib/helpers";
import { updateLinksSchemaAPI } from "@/lib/schemas";
import { checkURLReputation, protectRequest } from "@/lib/security";
import { APIDeleteLink, APIGetLink } from "@/lib/types";

// GET /api/v1/links/[id] - Get a specific link
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIGetLink | { error: string }>> {
  const decision = await protectRequest(
    req,
    {
      refillRate: 5,
      interval: 10,
      capacity: 100,
    },
    "api:get:link",
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

  const { id } = await params;

  const shortLink = await shortLinksRepository.findById(id);
  if (!shortLink) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  if (shortLink.userId !== apiKeyRecord.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const shortUrl = buildShortUrl(
    shortLink.shortCode,
    shortLink.customDomain?.domain,
  );
  const qrCodeUrl = await generateQRCode(shortUrl);

  return NextResponse.json({
    link: {
      ...shortLink,
      shortUrl,
      qrCodeUrl,
    },
    remaining: decision.remaining,
  } satisfies APIGetLink);
}

// PATCH /api/v1/links/[id] - Update a specific link
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIGetLink | { error: string }>> {
  const decision = await protectRequest(
    req,
    {
      refillRate: 1,
      interval: 10,
      capacity: 100,
    },
    "api:patch:link",
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

  const { id } = await params;

  try {
    const body = await req.json();
    const validatedData = updateLinksSchemaAPI.parse(body);

    if (validatedData.originalUrl) {
      const urlIsSafe = await checkURLReputation(validatedData.originalUrl);

      if (!urlIsSafe) {
        return NextResponse.json(
          { error: "The URL you provided is not safe." },
          { status: 400 },
        );
      }
    }

    if (validatedData.shortCode) {
      const existingLink = await shortLinksRepository.findByShortCode(
        validatedData.shortCode,
      );

      if (existingLink && existingLink.id !== id) {
        return NextResponse.json(
          { error: "Short code already exists." },
          { status: 400 },
        );
      }
    }

    const updatedLink = await shortLinksRepository.update(
      id,
      apiKeyRecord.userId,
      validatedData,
    );

    const shortUrl = buildShortUrl(
      updatedLink.shortCode,
      updatedLink.customDomain?.domain,
    );
    const qrCodeUrl = await generateQRCode(shortUrl);

    return NextResponse.json({
      link: {
        id: updatedLink.id,
        userId: updatedLink.userId,
        originalUrl: updatedLink.originalUrl,
        shortUrl,
        shortCode: updatedLink.shortCode,
        clicks: updatedLink.clicks,
        createdAt: updatedLink.createdAt,
        expiresAt: updatedLink.expiresAt,
        tags: updatedLink.tags,
        utmParams: updatedLink.utmParams,
        qrCodeUrl,
        customOgImageUrl: updatedLink.customOgImageUrl,
        customOgTitle: updatedLink.customOgTitle,
        customOgDescription: updatedLink.customOgDescription,
      },
      remaining: decision.remaining,
    } satisfies APIGetLink);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join("; ") },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 },
    );
  }
}

// DELETE /api/v1/links/[id] - Delete a specific link
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIDeleteLink | { error: string }>> {
  const decision = await protectRequest(
    req,
    {
      refillRate: 1,
      interval: 10,
      capacity: 10,
    },
    "api:delete:link",
  );

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": decision.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(
            decision.reset.getTime() / 10,
          ).toString(),
        },
      },
    );
  }

  const apiKeyRecord = await validateApiKey(req);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const link = await shortLinksRepository.findById(id);
  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  if (link.userId !== apiKeyRecord.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await shortLinksRepository.delete(id);

  return NextResponse.json({
    success: true,
    remaining: decision.remaining,
  } satisfies APIDeleteLink);
}
