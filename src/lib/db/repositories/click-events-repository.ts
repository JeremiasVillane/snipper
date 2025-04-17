import { prisma } from "@/lib/db/prisma";

import type { ClickEvent, Prisma } from "@prisma/client";

export const clickEventsRepository = {
  async create(data: Prisma.ClickEventCreateInput): Promise<ClickEvent> {
    const clickEvent = await prisma.clickEvent.create({
      data,
    });
    return clickEvent;
  },

  async findByShortLinkId(shortLinkId: string): Promise<ClickEvent[]> {
    return prisma.clickEvent.findMany({
      where: {
        shortLinkId: shortLinkId,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
  },

  async findByDateRange(
    shortLinkId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ClickEvent[]> {
    return prisma.clickEvent.findMany({
      where: {
        shortLinkId: shortLinkId,

        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });
  },
};
