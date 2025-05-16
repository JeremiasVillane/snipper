import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { publicUrl } from "@/env.mjs";

import { appName } from "@/lib/constants";
import { shortLinksRepository } from "@/lib/db/repositories";
import { buildShortUrl } from "@/lib/helpers";
import { PasswordProtection } from "@/components/shortCode/password-protection";

interface GenerateMetadataProps {
  params: Promise<{ shortCode: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { shortCode } = await params;

  const shortLink = await shortLinksRepository.findByShortCode(shortCode);

  if (!shortLink || (shortLink.expiresAt && shortLink.expiresAt < new Date())) {
    return {
      title: `Link Not Found - ${appName}`,
      description: "This short link could not be found or has expired.",
      robots: { index: false, follow: false },
    };
  }

  const protectedTitle = `Password Required - ${appName}`;
  const protectedDescription = `Enter the password to access this protected link via ${appName}.`;
  const genericProtectedImageUrl = `${publicUrl}/og-protected-link.png`;

  return {
    title: protectedTitle,
    description: protectedDescription,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Password Protected Link - ${appName}`,
      description: "Access to this link requires a password.",
      url: buildShortUrl(shortLink.shortCode, shortLink.customDomain?.domain),
      type: "website",
      images: [
        {
          url: genericProtectedImageUrl,
          width: 1200,
          height: 630,
          alt: "Password Protected Link",
        },
      ],
      siteName: appName,
    },
    twitter: {
      card: "summary_large_image",
      title: `Password Protected Link - ${appName}`,
      description: "Access to this link requires a password.",
      images: [genericProtectedImageUrl],
    },
  };
}

interface PasswordPageProps {
  params: Promise<{
    shortCode: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PasswordPage({
  params,
  searchParams,
}: PasswordPageProps) {
  const { shortCode } = await params;
  const resolvedSearchParams = await searchParams;

  const shortLink = await shortLinksRepository.findByShortCode(shortCode);

  if (!shortLink) notFound();

  if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
    notFound();
  }

  if (!shortLink.password) {
    redirect(`/${shortCode}`);
  }

  return <PasswordProtection {...{ shortCode, resolvedSearchParams }} />;
}
