import { publicUrl } from "@/env.mjs";

export function buildShortUrl(
  shortCode: string,
  customSubdomain?: string,
): string {
  if (customSubdomain) {
    const url = new URL(publicUrl);
    const protocol = url.protocol;
    const host = url.host;

    return `${protocol}//${customSubdomain}.${host}/${shortCode}`;
  }

  return `${publicUrl}/${shortCode}`;
}
