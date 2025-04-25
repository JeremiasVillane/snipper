"use server";

import { auth } from "@/lib/auth";
import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";
import { ShortLinkAnalyticsData } from "@/lib/types";

export async function getShortLinkAnalytics(
  id: string
): Promise<ShortLinkAnalyticsData> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  const shortLink = await shortLinksRepository.findById(id);
  if (!shortLink || shortLink.userId !== session.user.id) {
    throw new Error("Short link not found");
  }

  const clickEvents = await clickEventsRepository.findByShortLinkId(id);

  const totalClicks = clickEvents.length;

  const clicksByDate = clickEvents.reduce((acc, click) => {
    const date = click.timestamp.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as ShortLinkAnalyticsData["clicksByDate"]);

  const clicksByCountry = clickEvents.reduce((acc, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as ShortLinkAnalyticsData["clicksByCountry"]);

  const clicksByCity = clickEvents.reduce((acc, click) => {
    const city = click.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as ShortLinkAnalyticsData["clicksByCity"]);

  const clicksByCountryWithCities = clickEvents.reduce((acc, click) => {
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
  }, {} as ShortLinkAnalyticsData["clicksByCountryWithCities"]);

  const clicksByDevice = clickEvents.reduce((acc, click) => {
    const device = click.device || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as ShortLinkAnalyticsData["clicksByDevice"]);

  const clicksByBrowser = clickEvents.reduce((acc, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as ShortLinkAnalyticsData["clicksByBrowser"]);

  const clicksByOS = clickEvents.reduce((acc, click) => {
    const os = click.os || "Unknown";
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {} as ShortLinkAnalyticsData["clicksByOS"]);

  return {
    totalClicks,
    clicksByDate,
    clicksByCountry,
    clicksByCity,
    clicksByCountryWithCities,
    clicksByDevice,
    clicksByBrowser,
    clicksByOS,
    recentClicks: clickEvents.slice(0, 10),
  };
}
