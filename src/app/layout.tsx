import Providers from "@/app/providers";
import { SiteHeader } from "@/components/layout/header/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/simple-toast";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { PageTracker } from "react-page-tracker";

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
          <SiteHeader />

          <div className="fixed top-16 bottom-0 left-0 right-0 overflow-y-auto">
            <div className="min-h-[calc(100vh-4rem)] flex flex-col">
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
