import { ClickEvent, UTMParam } from "@prisma/client";

import { aggregateUtmParam } from "./helpers";
import { ShortLinkAnalyticsData, ShortLinkFromRepository } from "./types";

export async function calculateShortLinkAnalytics(
  shortLink: ShortLinkFromRepository,
  clickEvents: ClickEvent[],
  isPremiumOrDemoUser: boolean,
) {
  const definedCampaigns: UTMParam[] = shortLink.utmParams;
  const totalClicks = clickEvents.length;

  const clicksByDate = clickEvents.reduce(
    (acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as ShortLinkAnalyticsData["clicksByDate"],
  );

  const clicksByCountry = clickEvents.reduce(
    (acc, click) => {
      const country = click.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as ShortLinkAnalyticsData["clicksByCountry"],
  );

  const clicksByCity = isPremiumOrDemoUser
    ? clickEvents.reduce(
        (acc, click) => {
          const city = click.city || "Unknown";
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        },
        {} as ShortLinkAnalyticsData["clicksByCity"],
      )
    : {};

  const clicksByCountryWithCities = isPremiumOrDemoUser
    ? clickEvents.reduce(
        (acc, click) => {
          const country = click.country || "Unknown";
          const city = click.city || "Unknown";

          if (!acc[country]) {
            acc[country] = {
              totalClicks: 0,
              cities: {},
            };
          }
          acc[country].totalClicks += 1;
          if (!acc[country].cities[city]) {
            acc[country].cities[city] = 0;
          }
          acc[country].cities[city] += 1;
          return acc;
        },
        {} as ShortLinkAnalyticsData["clicksByCountryWithCities"],
      )
    : {};

  const clicksByDevice = clickEvents.reduce(
    (acc, click) => {
      const device = click.device || "Unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    },
    {} as ShortLinkAnalyticsData["clicksByDevice"],
  );

  const clicksByBrowser = isPremiumOrDemoUser
    ? clickEvents.reduce(
        (acc, click) => {
          const browser = click.browser || "Unknown";
          acc[browser] = (acc[browser] || 0) + 1;
          return acc;
        },
        {} as ShortLinkAnalyticsData["clicksByBrowser"],
      )
    : {};

  const clicksByOS = isPremiumOrDemoUser
    ? clickEvents.reduce(
        (acc, click) => {
          const os = click.os || "Unknown";
          acc[os] = (acc[os] || 0) + 1;
          return acc;
        },
        {} as ShortLinkAnalyticsData["clicksByOS"],
      )
    : {};

  const clicksByReferrer = isPremiumOrDemoUser
    ? clickEvents.reduce(
        (acc, click) => {
          const referrer = click.referrer || "Direct";
          acc[referrer] = (acc[referrer] || 0) + 1;
          return acc;
        },
        {} as ShortLinkAnalyticsData["clicksByReferrer"],
      )
    : {};

  const clicksByCampaign = isPremiumOrDemoUser
    ? aggregateUtmParam(clickEvents, "utmCampaign")
    : {};
  const clicksBySource = isPremiumOrDemoUser
    ? aggregateUtmParam(clickEvents, "utmSource")
    : {};
  const clicksByMedium = isPremiumOrDemoUser
    ? aggregateUtmParam(clickEvents, "utmMedium")
    : {};
  const clicksByTerm = isPremiumOrDemoUser
    ? aggregateUtmParam(clickEvents, "utmTerm")
    : {};
  const clicksByContent = isPremiumOrDemoUser
    ? aggregateUtmParam(clickEvents, "utmContent")
    : {};

  const recentClicks = clickEvents
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  const analyticsData: ShortLinkAnalyticsData = {
    totalClicks,
    clicksByDate,
    clicksByCountry,
    clicksByCity,
    clicksByCountryWithCities,
    clicksByDevice,
    clicksByBrowser,
    clicksByOS,
    clicksByReferrer,
    recentClicks,
    definedCampaigns,
    clicksByCampaign,
    clicksBySource,
    clicksByMedium,
    clicksByTerm,
    clicksByContent,
  };

  return analyticsData;
}
