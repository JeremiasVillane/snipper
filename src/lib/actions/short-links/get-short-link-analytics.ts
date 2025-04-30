"use server";

import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";
import { ShortLinkAnalyticsData } from "@/lib/types";
import { ClickEvent } from "@prisma/client";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const getAnalyticsSchema = z.object({
  id: z.string().min(1, "Short link ID is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getShortLinkAnalytics = authActionClient({})
  .metadata({
    name: "get-short-link-analytics",
  })
  .schema(getAnalyticsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, startDate, endDate } = parsedInput;
    const { userId } = ctx;

    try {
      const shortLink = await shortLinksRepository.findById(id);
      if (!shortLink || shortLink.userId !== userId) {
        throw new Error("Short link not found or you don't have permission.");
      }

      let clickEvents: ClickEvent[];

      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        clickEvents = await clickEventsRepository.findByDateRange(
          id,
          startDate,
          adjustedEndDate
        );
      } else {
        clickEvents = await clickEventsRepository.findByShortLinkId(id);
      }

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

      const clicksByReferrer = clickEvents.reduce((acc, click) => {
        const referrer = click.referrer || "Direct";
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {} as ShortLinkAnalyticsData["clicksByReferrer"]);

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
      };

      return analyticsData;
    } catch (error) {
      console.error("Error fetching or processing analytics:", error);
      throw error;
    }
  });
