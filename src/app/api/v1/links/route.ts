import { shortLinksRepository, tagsRepository } from "@/lib/db/repositories";
import {
  buildShortUrl,
  generateQRCode,
  generateShortCode,
  validateApiKey,
} from "@/lib/helpers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url(),
  customAlias: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  password: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/v1/links - List all links for the authenticated user
export async function GET(request: NextRequest) {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await shortLinksRepository.findByUserId(apiKeyRecord.userId);

  const formattedLinks = links.map((link) => ({
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
    shortCode: link.shortCode,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt,
    clicks: link.clicks,
    tags: link.tags ?? [],
  }));

  return NextResponse.json({ links: formattedLinks });
}

// POST /api/v1/links - Create a new short link
export async function POST(request: NextRequest) {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createLinkSchema.parse(body);

    let shortCode = validatedData.customAlias;
    if (shortCode) {
      const existingLink = await shortLinksRepository.findByShortCode(
        shortCode
      );
      if (existingLink) {
        return NextResponse.json(
          { error: "Custom alias already taken" },
          { status: 400 }
        );
      }
    } else {
      shortCode = generateShortCode();
    }

    const qrCodeUrl = await generateQRCode(buildShortUrl(shortCode));

    const shortLink = await shortLinksRepository.create({
      originalUrl: validatedData.url,
      shortCode,
      expiresAt: validatedData.expiresAt || null,
      password: validatedData.password || null,
      user: { connect: { id: apiKeyRecord.userId } },
      qrCodeUrl,
    });

    let createdTags: string[] = [];

    if (validatedData.tags && validatedData.tags.length > 0) {
      const tagOperationsPromises = validatedData.tags.map(async (tagName) => {
        const tag = await tagsRepository.findOrCreate(
          tagName,
          apiKeyRecord.user.id
        );

        await tagsRepository.addTagToLink(shortLink.id, tag.id);
        return tag.name;
      });

      createdTags = await Promise.all(tagOperationsPromises);
    }

    return NextResponse.json({
      id: shortLink.id,
      originalUrl: shortLink.originalUrl,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${shortLink.shortCode}`,
      shortCode: shortLink.shortCode,
      createdAt: shortLink.createdAt,
      expiresAt: shortLink.expiresAt,
      qrCodeUrl: shortLink.qrCodeUrl,
      tags: createdTags,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create short link" },
      { status: 500 }
    );
  }
}
