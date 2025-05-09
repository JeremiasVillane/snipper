"use server";

import { ClickEvent } from "@prisma/client";
import { z } from "zod";

import { calculateShortLinkAnalytics } from "@/lib/analytics";
import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";
import { ShortLinkAnalyticsData } from "@/lib/types";

import { authActionClient } from "../safe-action";

const getAnalyticsSchema = z.object({
  id: z.string().min(1, "Short link ID is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getShortLinkAnalytics = authActionClient({})
  .metadata({ name: "get-short-link-analytics" })
  .schema(getAnalyticsSchema)
  .action(async ({ parsedInput, ctx }): Promise<ShortLinkAnalyticsData> => {
    const { id, startDate, endDate } = parsedInput;
    const { userId } = ctx;

    try {
      const shortLink = await shortLinksRepository.findById(id);
      if (!shortLink || shortLink.userId !== userId) {
        throw new Error("Short link not found or you don't have permission");
      }

      let clickEvents: ClickEvent[];

      if (startDate && endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        clickEvents = await clickEventsRepository.findByDateRange(
          id,
          startDate,
          adjustedEndDate,
        );
      } else {
        clickEvents = await clickEventsRepository.findByShortLinkId(id);
      }

      return await calculateShortLinkAnalytics(shortLink, clickEvents);
    } catch (error) {
      console.error(`Error fetching analytics for link ${id}:`, error);
      if (error instanceof Error) {
        throw new Error(`Failed to get analytics: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while fetching analytics.");
    }
  });
