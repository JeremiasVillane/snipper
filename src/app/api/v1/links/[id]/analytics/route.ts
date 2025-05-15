import { NextResponse, type NextRequest } from "next/server";

import { calculateShortLinkAnalytics } from "@/lib/analytics";
import {
  clickEventsRepository,
  shortLinksRepository,
  usersRepository,
} from "@/lib/db/repositories";
import { validateApiKey } from "@/lib/helpers";
import { protectRequest } from "@/lib/security";
import { APIGetLinkAnalytics } from "@/lib/types";

// GET /api/v1/links/[id]/analytics - Get analytics for a specific link
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<APIGetLinkAnalytics | { error: string }>> {
  const decision = await protectRequest(
    req,
    {
      refillRate: 2,
      interval: 10,
      capacity: 100,
    },
    "api:get:analytics",
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
      analytics: {
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
      },
      remaining: decision.remaining,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get link analytics" },
      { status: 500 },
    );
  }
}
