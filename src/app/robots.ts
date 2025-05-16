import type { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/"],
    },

    sitemap: `${publicUrl}/sitemap.xml`,
  };
}
