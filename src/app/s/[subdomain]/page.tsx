import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { iconOptions } from "@/data/shortlink-icons";
import { publicUrl } from "@/env.mjs";
import { ExternalLink } from "lucide-react";

import { appName } from "@/lib/constants";
import { usersRepository } from "@/lib/db/repositories";
import { buildShortUrl } from "@/lib/helpers";
import { Card } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { AppLogo } from "../../../../public/app-logo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;

  const userData = await usersRepository.findByCustomDomain(subdomain);

  return {
    title: `Link Hub - ${userData?.name || appName} ${!!userData?.name ? `| ${appName}` : ""}`,
    description: `Link Hub for ${userData?.name || appName} ${!!userData?.name ? `| ${appName}` : ""}`,
    keywords: [
      appName,
      "Link Tracker",
      "Link Tracking",
      "Link Management",
      "Campaign Tracking",
      "Link Management System",
      "Link Management Software",
      "Link Management Tool",
      "Link Management Platform",
      "Link Management Service",
      "Link Management Solutions",
      "Marketing Links",
      "Link Management API",
      "Link Hub",
      "Link Shortener",
      "URL Shortener",
      "Custom Domain",
      "Analytics",
    ],
    openGraph: {
      title: `Link Hub - ${userData?.name || appName} ${!!userData?.name ? `| ${appName}` : ""}`,
      url: `${publicUrl}/${subdomain}`,
      description: `Link Hub for ${userData?.name || appName} ${!!userData?.name ? `| ${appName}` : ""}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Link Hub - ${userData?.name || appName} ${!!userData?.name ? `| ${appName}` : ""}`,
      description: `Link Hub for ${userData?.name || appName} ${!!userData?.name ? `| ${appName}` : ""}`,
      images: [`${publicUrl}/app-logo.png`],
    },
    icons: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        rel: "apple-touch-icon",
      },
      {
        sizes: "96x96",
        url: "/favicon-96x96.png",
        type: "image/png",
        rel: "icon",
      },
    ],
    alternates: {
      canonical: `${publicUrl}/${subdomain}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    themeColor: "#ffffff",
    metadataBase: new URL(publicUrl),
  };
}

interface SubdomainPage {
  params: Promise<{ subdomain: string }>;
}

export default async function SubdomainPage({ params }: SubdomainPage) {
  const { subdomain } = await params;

  const userData = await usersRepository.findByCustomDomain(subdomain);
  if (!userData) return notFound();

  console.log("userData:", userData)

  const userSubdomain = userData.customDomains[0];
  if (!userSubdomain.isLinkHubEnabled) return notFound();
  if (userData.shortLinks.length < 1) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">No links found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <article className="flex flex-col items-center justify-center space-y-6 pb-24">
          {/* Profile Header */}
          <header className="flex flex-col items-center space-y-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                src={userData.image || "/placeholder.svg"}
                alt={userData.name || "User Image"}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {userSubdomain.linkHubTitle ?? `${userData.name}'s Link Hub`}
              </h1>
              <p className="text-gray-600">
                {userSubdomain.linkHubDescription ?? `@${subdomain}`}
              </p>
            </div>
            {!!userData.bio && (
              <p className="max-w-md text-center text-gray-600">
                {userData.bio}
              </p>
            )}
          </header>

          {/* Links */}
          <List variant="none" spacing="loose" className="w-full">
            {userData.shortLinks.map((link) => {
              const SelectedIcon = link.shortLinkIcon
                ? iconOptions[link.shortLinkIcon]
                : iconOptions.default;

              return (
                <ListItem key={link.id}>
                  <Link
                    href={buildShortUrl(
                      link.shortCode,
                      link.customDomain?.domain,
                    )}
                  >
                    <Card className="group flex w-full items-center justify-between border-gray-100 bg-white p-4 transition-all hover:scale-[1.01] hover:shadow-md">
                      <div className="group-dark:hover:text-primary flex items-center gap-3 font-medium text-gray-600 group-hover:text-primary dark:text-gray-600">
                        <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                          <SelectedIcon width={20} height={20} />
                        </div>

                        {link.title ?? link.originalUrl}
                      </div>
                      <ExternalLink
                        size={16}
                        className="text-gray-400 group-hover:scale-110"
                      />
                    </Card>
                  </Link>
                </ListItem>
              );
            })}
          </List>

          {/* Footer */}
          <section className="absolute bottom-10 flex flex-col items-center space-y-2 pt-4 text-center text-sm text-gray-500">
            <p>
              Powered by{" "}
              <Link
                href={publicUrl}
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                <AppLogo className="mb-0.5 mr-0.5 inline size-4 text-primary" />
                Snippr
              </Link>
              <span className="text-gray-400"> | </span>©{" "}
              {new Date().getFullYear()}. All rights reserved.
            </p>
            <p className="mt-2 border-gray-300 bg-transparent">
              Create your own Link Hub and track your links.
              <Link
                href={publicUrl}
                className="ml-1 font-semibold text-primary underline-offset-2 hover:underline"
              >
                Get Started
              </Link>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
