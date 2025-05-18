import { publicUrl } from "@/env.mjs";

export function buildCustomDomainUrl(customSubdomain: string): string {
  const url = new URL(publicUrl);
  const protocol = url.protocol;
  const host = url.host;

  return `${protocol}//${customSubdomain}.${host}`;
}
