import { publicUrl } from "@/env.mjs";

export function extractSubdomainFromHost(host: string): string | null {
  const rootDomain = new URL(publicUrl).hostname;
  const hostname = host.split(":")[0];

  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return null;
  }

  if (hostname.endsWith(`.${rootDomain}`)) {
    return hostname.replace(`.${rootDomain}`, "");
  }

  return null;
}
