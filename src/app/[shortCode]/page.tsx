import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { shortLinksRepository } from "@/lib/db/repositories";
import { parseUserAgentImproved } from "@/lib/helpers";
import { recordClick } from "@/actions";
import { PasswordProtection } from "@/components/shortCode/password-protection";

interface ShortCodePageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function ShortCodePage({ params }: ShortCodePageProps) {
  const { shortCode } = await params;

  const shortLink = await shortLinksRepository.findByShortCode(shortCode);

  if (!shortLink) {
    notFound();
  }

  if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
    notFound();
  }

  if (shortLink.password) {
    return <PasswordProtection shortCode={shortCode} />;
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const referer = headersList.get("referer") || "";
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

  const { browser, os, device } = parseUserAgentImproved(userAgent);

  recordClick(shortCode, {
    ipAddress: ip,
    userAgent,
    referrer: referer,
    device,
    browser,
    os,
    country: "Unknown",
    city: "Unknown",
  }).catch(console.error);

  redirect(shortLink.originalUrl);
}
