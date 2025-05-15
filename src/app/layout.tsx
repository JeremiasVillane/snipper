import { publicUrl } from "@/env.mjs";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/simple-toast";
import { SiteHeader } from "@/components/layout/header/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Providers from "@/app/providers";

import "@/styles/globals.css";

import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { headers } from "next/headers";
import { PageTracker } from "react-page-tracker";
import { WebSite, WithContext } from "schema-dts";

import { extractSubdomainFromHost } from "@/lib/helpers";

const nunito = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snipper - Modern Open Source URL Shortener",
  description:
    "Shorten, customize, and track your links with advanced analytics",
  keywords: [
    "URL Shortener",
    "Short Link",
    "Open Source Link Shortener",
    "URL Shortener with Analytics",
    "UTM Campaign Tracker",
    "Self-Hosted URL Shortener",
    "Link Analytics Tool",
    "Custom Domain Link Shortener",
    "Link Shortener API",
    "Open Source Link Tracking",
    "Track Link Clicks Software",
    "Branded Links Open Source",
    "Campaign Tracking Link Shortener",
    "Free URL Shortener Analytics",
  ],
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
  openGraph: {
    title: "Snipper - Open Source URL Shortener",
    description: "URL Shortener with Analytics and UTM Campaign Tracker",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        height: 630,
        width: 1200,
        alt: "URL Shortener with Analytics and UTM Campaign Tracker",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host") || "";
  const subdomain = extractSubdomainFromHost(host);

  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Snipper - URL Shortener",
    url: publicUrl,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(nunito.className, "antialiased")}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <Providers>
          {!subdomain && <SiteHeader />}

          <div className="fixed bottom-0 left-0 right-0 top-16 overflow-y-auto">
            <div className="flex min-h-[calc(100vh-4rem)] flex-col">
              {children}
              <SiteFooter />
            </div>
          </div>

          <Toaster
            defaultDuration={3000}
            defaultEnterAnimationType="slide-down"
            defaultPosition="top-right"
            defaultShowProgressBar
            defaultShowCloseButton
          />
          <PageTracker enableStrictModeHandler={false} />
        </Providers>
      </body>
    </html>
  );
}
