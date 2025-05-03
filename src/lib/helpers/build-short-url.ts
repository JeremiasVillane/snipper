import { publicUrl } from "@/env.mjs";

export function buildShortUrl(shortCode: string): string {
  return `${publicUrl}/${shortCode}`;
}
