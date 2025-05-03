import { PasswordProtection } from "@/components/shortCode/password-protection";
import { shortLinksRepository } from "@/lib/db/repositories";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { publicUrl } from "@/env.mjs";
import { buildShortUrl } from "@/lib/helpers";

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
      title: "Link Not Found - Snipper",
      description: "This short link could not be found or has expired.",
      robots: { index: false, follow: false },
    };
  }

  const protectedTitle = "Password Required - Snipper";
  const protectedDescription =
    "Enter the password to access this protected link via Snipper.";
  const genericProtectedImageUrl = `${publicUrl}/og-protected-link.png`;

  return {
    title: protectedTitle,
    description: protectedDescription,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: "Password Protected Link - Snipper",
      description: "Access to this link requires a password.",
      url: buildShortUrl(shortCode),
      type: "website",
      images: [
        {
          url: genericProtectedImageUrl,
          width: 1200,
          height: 630,
          alt: "Password Protected Link",
        },
      ],
      siteName: "Snipper",
    },
    twitter: {
      card: "summary_large_image",
      title: "Password Protected Link - Snipper",
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
