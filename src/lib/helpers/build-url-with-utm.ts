import { UTMParam } from "@prisma/client";

/**
 * Builds a URL string by appending UTM parameters from a UTMParam object
 * to a base URL.
 * @param baseUrl The base URL (e.g., https://your.domain/shortcode)
 * @param utmParams The UTM parameters object.
 * @returns The URL string with UTM parameters appended.
 */
export function buildUrlWithUtm(baseUrl: string, utmParams: UTMParam): string {
  try {
    const url = new URL(baseUrl);

    if (utmParams.source) url.searchParams.set("utm_source", utmParams.source);
    if (utmParams.medium) url.searchParams.set("utm_medium", utmParams.medium);
    url.searchParams.set("utm_campaign", utmParams.campaign);
    if (utmParams.term) url.searchParams.set("utm_term", utmParams.term);
    if (utmParams.content)
      url.searchParams.set("utm_content", utmParams.content);

    return url.toString();
  } catch (error) {
    console.error("Error building URL with UTM:", error);
    return baseUrl;
  }
}
