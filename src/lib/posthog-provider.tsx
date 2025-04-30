"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { usePostHog } from "posthog-js/react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { env } from "@/env.mjs";

const isPosthogConfigured =
  !!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    isPosthogConfigured
      ? posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: env.NEXT_PUBLIC_POSTHOG_HOST!,
          person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
          capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        })
      : null;
  }, []);

  return isPosthogConfigured ? (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  ) : (
    <></>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  // Track pageviews
  useEffect(() => {
    if (isPosthogConfigured && pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return isPosthogConfigured ? (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  ) : null;
}
