"use client";

import { env } from "@/env.mjs";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { PostHogProvider } from "@/lib/posthog-provider";

const isPosthogConfigured =
  !!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST;

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NuqsAdapter>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </NuqsAdapter>
    </SessionProvider>
  );
}

function ProvidersWithPosthog({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <Providers>{children}</Providers>
    </PostHogProvider>
  );
}

export default isPosthogConfigured ? ProvidersWithPosthog : Providers;
