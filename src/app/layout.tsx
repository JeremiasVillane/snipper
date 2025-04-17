import Providers from "@/app/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/simple-toast";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snipper - Modern URL Shortener",
  description:
    "Shorten, customize, and track your links with advanced analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
          <Toaster
            defaultDuration={3000}
            defaultEnterAnimationType="slide-down"
            defaultPosition="top-right"
            defaultShowProgressBar
            defaultShowCloseButton
          />
        </Providers>
      </body>
    </html>
  );
}
