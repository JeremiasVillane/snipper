import { NextResponse, type NextRequest } from "next/server";

import { calculateShortLinkAnalytics } from "@/lib/analytics";
import {
  clickEventsRepository,
  shortLinksRepository,
  usersRepository,
} from "@/lib/db/repositories";
import { validateApiKey } from "@/lib/helpers";
import { APIGetLinkAnalytics } from "@/lib/types";

// GET /api/v1/links/[id]/analytics - Get analytics for a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIGetLinkAnalytics | { error: string }>> {
  const apiKeyRecord = await validateApiKey(request);
  if (!apiKeyRecord) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const shortLink = await shortLinksRepository.findById(id);
    if (!shortLink || shortLink.userId !== apiKeyRecord.userId) {
      throw new Error("Short link not found or you don't have permission");
    }

    const clickEvents = await clickEventsRepository.findByShortLinkId(id);

    const dbUser = await usersRepository.findById(apiKeyRecord.userId);

    if (!dbUser) throw new Error("User not found");

    const isPremiumOrDemoUser =
      dbUser.subscriptions
        .filter((sub) => ["ACTIVE", "TRIALING"].includes(sub.status))
        .map((s) => s.plan)
        .some((p) => p.type === "PAID") || dbUser?.role === "DEMO";

    const data = await calculateShortLinkAnalytics(
      shortLink,
      clickEvents,
      isPremiumOrDemoUser,
    );

    return NextResponse.json({
      totalClicks: data.totalClicks,
      clicksByDate: data.clicksByDate,
      clicksByCountry: data.clicksByCountry,
      clicksByCity: data.clicksByCity,
      clicksByCountryWithCities: data.clicksByCountryWithCities,
      clicksByDevice: data.clicksByDevice,
      clicksByBrowser: data.clicksByBrowser,
      clicksByOS: data.clicksByOS,
      clicksByReferrer: data.clicksByReferrer,
      clicksByCampaign: data.clicksByCampaign,
      clicksBySource: data.clicksBySource,
      clicksByMedium: data.clicksByMedium,
      clicksByTerm: data.clicksByTerm,
      clicksByContent: data.clicksByContent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get link analytics" },
      { status: 500 },
    );
  }
}
