import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { shortLinksRepository } from "@/lib/db/repositories";
import { buildShortUrl, generateQRCode, validateApiKey } from "@/lib/helpers";
import { updateLinksSchemaAPI } from "@/lib/schemas";
import { APIDeleteLink, APIGetLink } from "@/lib/types";

// GET /api/v1/links/[id] - Get a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIGetLink | { error: string }>> {
  const apiKeyRecord = await validateApiKey(request);
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

  const shortUrl = buildShortUrl(shortLink.shortCode);
  const qrCodeUrl = await generateQRCode(shortUrl);

  return NextResponse.json({
    ...shortLink,
    shortUrl,
    qrCodeUrl,
  } satisfies APIGetLink);
}

// PATCH /api/v1/links/[id] - Update a specific link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIGetLink | { error: string }>> {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const validatedData = updateLinksSchemaAPI.parse(body);

    const updatedLink = await shortLinksRepository.update(
      id,
      apiKeyRecord.userId,
      validatedData,
    );

    const shortUrl = buildShortUrl(updatedLink.shortCode);
    const qrCodeUrl = await generateQRCode(shortUrl);

    return NextResponse.json({
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIDeleteLink | { error: string }>> {
  const apiKeyRecord = await validateApiKey(request);
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

  return NextResponse.json({ success: true } satisfies APIDeleteLink);
}
