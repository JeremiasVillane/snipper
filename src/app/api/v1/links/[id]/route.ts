import { shortLinksRepository, tagsRepository } from "@/lib/db/repositories";
import { buildShortUrl, generateQRCode, validateApiKey } from "@/lib/helpers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateLinkSchema = z.object({
  customAlias: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
  password: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/v1/links/[id] - Get a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  return NextResponse.json({
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: buildShortUrl(link.shortCode),
    shortCode: link.shortCode,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt,
    clicks: link.clicks,
    tags: link.tags ?? [],
    qrCodeUrl: link.qrCodeUrl,
  });
}

// PATCH /api/v1/links/[id] - Update a specific link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const link = await shortLinksRepository.findById(id);
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== apiKeyRecord.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateLinkSchema.parse(body);

    if (
      validatedData.customAlias &&
      validatedData.customAlias !== link.shortCode
    ) {
      const existingLink = await shortLinksRepository.findByShortCode(
        validatedData.customAlias
      );
      if (existingLink && existingLink.id !== id) {
        return NextResponse.json(
          { error: "Custom alias already taken" },
          { status: 400 }
        );
      }
    }

    const updatedLink = await shortLinksRepository.update(id, {
      shortCode: validatedData.customAlias,
      expiresAt: validatedData.expiresAt,
      password: validatedData.password,
    });

    if (
      validatedData.customAlias &&
      validatedData.customAlias !== link.shortCode
    ) {
      const qrCodeUrl = await generateQRCode(
        buildShortUrl(validatedData.customAlias)
      );
      await shortLinksRepository.update(id, { qrCodeUrl });
    }

    if (validatedData.tags) {
      const tagIdPromises = validatedData.tags.map(async (tagName) => {
        const tag = await tagsRepository.findOrCreate(
          tagName,
          apiKeyRecord.user.id
        );
        return tag.id;
      });

      const tagIds = await Promise.all(tagIdPromises);
      await tagsRepository.updateLinkTags(id, tagIds);
    }

    return NextResponse.json({
      id: updatedLink.id,
      originalUrl: updatedLink.originalUrl,
      shortUrl: buildShortUrl(updatedLink.shortCode),
      shortCode: updatedLink.shortCode,
      createdAt: updatedLink.createdAt,
      expiresAt: updatedLink.expiresAt,
      qrCodeUrl: updatedLink.qrCodeUrl,
      tags: validatedData.tags || updatedLink.tags,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/links/[id] - Delete a specific link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  return NextResponse.json({ success: true });
}
