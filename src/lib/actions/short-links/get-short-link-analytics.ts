"use server";

import { auth } from "@/lib/auth";
import {
  clickEventsRepository,
  shortLinksRepository,
} from "@/lib/db/repositories";

export async function getShortLinkAnalytics(id: string) {
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
  }, {} as Record<string, number>);

  const clicksByCountry = clickEvents.reduce((acc, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clicksByDevice = clickEvents.reduce((acc, click) => {
    const device = click.device || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clicksByBrowser = clickEvents.reduce((acc, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clicksByOS = clickEvents.reduce((acc, click) => {
    const os = click.os || "Unknown";
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalClicks,
    clicksByDate,
    clicksByCountry,
    clicksByDevice,
    clicksByBrowser,
    clicksByOS,
    recentClicks: clickEvents.slice(0, 10),
  };
}
