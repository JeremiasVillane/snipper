import { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  return [
    {
      url: publicUrl,
      changeFrequency: "monthly",
      priority: 1,
      lastModified,
    },
    {
      url: `${publicUrl}/features`,
      changeFrequency: "monthly",
      priority: 1,
      lastModified,
    },
    {
      url: `${publicUrl}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified,
    },
    {
      url: `${publicUrl}/api-docs`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified,
    },
    {
      url: `${publicUrl}/login`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified,
    },
    {
      url: `${publicUrl}/register`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified,
    },
  ];
}
