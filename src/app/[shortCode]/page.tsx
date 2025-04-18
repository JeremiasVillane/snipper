import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { shortLinksRepository } from "@/lib/db/repositories";
import { parseUserAgentImproved } from "@/lib/helpers";
import { recordClick } from "@/lib/actions/short-links";
import { PasswordProtection } from "@/components/shortCode/password-protection";

interface ShortCodePageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function ShortCodePage({ params }: ShortCodePageProps) {
  const { shortCode } = await params;

  const shortLink = await shortLinksRepository.findByShortCode(shortCode);

  if (!shortLink) notFound();

  if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
    notFound();
  }

  if (shortLink.password) {
    return <PasswordProtection shortCode={shortCode} />;
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const referrer = headersList.get("referer") || "";

  const xForwardedFor = headersList.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";

  const rawCountry = headersList.get("x-vercel-ip-country");
  const rawCity = headersList.get("x-vercel-ip-city");

  let country = "Unknown";
  let city = "Unknown";

  if (rawCountry) {
    try {
      country = decodeURIComponent(rawCountry);
    } catch (e) {
      console.error("Failed to decode country header:", rawCountry, e);
      country = rawCountry;
    }
  }

  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch (e) {
      console.error("Failed to decode city header:", rawCity, e);
      city = rawCity;
    }
  }

  const { browser, os, device } = parseUserAgentImproved(userAgent);

  recordClick(shortCode, {
    ipAddress: ip,
    userAgent,
    referrer,
    device,
    browser,
    os,
    country,
    city,
  }).catch(console.error);

  redirect(shortLink.originalUrl);
}
