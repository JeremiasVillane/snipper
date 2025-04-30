import { env } from "@/env.mjs";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const config =
  env.SENTRY_ORG && env.SENTRY_PROJECT && env.SENTRY_AUTH_TOKEN
    ? withSentryConfig(nextConfig, {
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        // Only print logs for uploading source maps in CI
        // Set to `true` to suppress logs
        silent: !process.env.CI,
        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,
      })
    : nextConfig;

export default config;
