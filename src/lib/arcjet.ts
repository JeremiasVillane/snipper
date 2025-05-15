import { env } from "@/env.mjs";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

export const aj = env.ARCJET_KEY
  ? arcjet({
      // Get your site key from https://app.arcjet.com
      // and set it as an environment variable rather than hard coding.
      // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
      key: env.ARCJET_KEY,
      characteristics: ["ip.src"], // Track requests by IP address
      rules: [
        // Arcjet Shield provides automated threat protection
        shield({ mode: "LIVE" }), // LIVE mode blocks threats, MONITOR only logs

        // Bot detection rule
        detectBot({
          mode: "LIVE",
          allow: [
            // Allow specific categories of known good bots
            "CATEGORY:SEARCH_ENGINE", // Google, Bing, DuckDuckGo, etc.
            "CATEGORY:MONITOR", // Uptime monitoring services (UptimeRobot, etc.)
            "CATEGORY:PREVIEW", // Link previews (Slack, Discord, Twitter, etc.)
            "CATEGORY:VERCEL", // Vercel infrastructure bots
          ],
        }),
      ],
    })
  : null;
