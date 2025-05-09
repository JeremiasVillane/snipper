"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { parseUserAgentImproved } from "@/lib/helpers";
import { shortCodeSchema } from "@/lib/schemas";

import { noauthActionClient } from "../safe-action";
import { recordClick } from "./record-click";

const processShortLinkSchema = z.object({
  shortCode: shortCodeSchema,
  resolvedSearchParams: z.record(
    z.union([z.string(), z.array(z.string()), z.undefined()]),
  ),
});

export const processShortLink = noauthActionClient
  .metadata({ name: "process-short-link" })
  .schema(processShortLinkSchema)
  .action(async ({ parsedInput }) => {
    const { shortCode, resolvedSearchParams } = parsedInput;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const referrer = headersList.get("referer") || "";

    const xForwardedFor = headersList.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rawCountry = headersList.get("x-vercel-ip-country");
    const rawCity = headersList.get("x-vercel-ip-city");

    let country = "Unknown",
      city = "Unknown";

    if (rawCountry) {
      try {
        country = decodeURIComponent(rawCountry);
      } catch (e) {
        country = rawCountry;
      }
    } else {
      try {
        const realIP = await fetch("https://api.ipify.org/?format=json")
          .then((res) => res.json())
          .then((res) => res?.ip);
        const res = await fetch(`http://ip-api.com/json/${realIP}`)
          .then((res) => res.json())
          .then((res) => res);
        country = res?.countryCode ?? "Unknown";
      } catch (e) {
        country = "Unknown";
      }
    }
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity);
      } catch (e) {
        city = rawCity;
      }
    } else {
      try {
        const realIP = await fetch("https://api.ipify.org/?format=json")
          .then((res) => res.json())
          .then((res) => res?.ip);
        const res = await fetch(`http://ip-api.com/json/${realIP}`)
          .then((res) => res.json())
          .then((res) => res);
        city = decodeURIComponent(res?.city ?? "Unknown");
      } catch (e) {
        city = "Unknown";
      }
    }

    const { browser, os, device } = parseUserAgentImproved(userAgent);

    const getQueryParam = (key: string): string | undefined => {
      const value = resolvedSearchParams[key];
      return Array.isArray(value) ? value[0] : value;
    };

    const utmSource = getQueryParam("utm_source");
    const utmMedium = getQueryParam("utm_medium");
    const utmCampaign = getQueryParam("utm_campaign");
    const utmTerm = getQueryParam("utm_term");
    const utmContent = getQueryParam("utm_content");

    recordClick({
      shortCode,
      data: {
        ipAddress: ip,
        userAgent,
        referrer,
        device,
        browser,
        os,
        country,
        city,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      },
    }).catch(console.error);
  });
