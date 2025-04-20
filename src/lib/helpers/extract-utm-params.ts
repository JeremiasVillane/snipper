import { UtmParams } from "../schemas";

export function extractUtmParams(urlString: string | undefined): UtmParams {
  const utmResult: UtmParams = {
    source: undefined,
    medium: undefined,
    campaign: undefined,
    term: undefined,
    content: undefined,
  };

  if (!urlString) return utmResult;

  try {
    const parsedUrl = new URL(urlString);
    const searchParams = parsedUrl.searchParams;

    utmResult.source = searchParams.get("utm_source") ?? undefined;
    utmResult.medium = searchParams.get("utm_medium") ?? undefined;
    utmResult.campaign = searchParams.get("utm_campaign") ?? undefined;
    utmResult.term = searchParams.get("utm_term") ?? undefined;
    utmResult.content = searchParams.get("utm_content") ?? undefined;
  } catch (error) {
    console.warn(`Invalid URL: "${urlString}". Error: ${error}`);
  }

  return utmResult;
}
