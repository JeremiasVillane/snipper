import { NextResponse, type NextRequest } from "next/server";

import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";
import { validateApiKey } from "@/lib/helpers";

// GET /api/v1/links/[id]/analytics - Get analytics for a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

  const clickEvents = await clickEventsRepository.findByShortLinkId(id);

  const totalClicks = clickEvents.length;

  const clicksByDate = clickEvents.reduce(
    (acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const clicksByCountry = clickEvents.reduce(
    (acc, click) => {
      const country = click.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const clickByCity = clickEvents.reduce(
    (acc, click) => {
      const city = click.city || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const clicksByDevice = clickEvents.reduce(
    (acc, click) => {
      const device = click.device || "Unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const clicksByBrowser = clickEvents.reduce(
    (acc, click) => {
      const browser = click.browser || "Unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const clicksByOS = clickEvents.reduce(
    (acc, click) => {
      const os = click.os || "Unknown";
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return NextResponse.json({
    totalClicks,
    clicksByDate,
    clicksByCountry,
    clickByCity,
    clicksByDevice,
    clicksByBrowser,
    clicksByOS,
  });
}
