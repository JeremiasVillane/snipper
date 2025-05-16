import { NextRequest, NextResponse } from "next/server";
import withAuth, { type NextRequestWithAuth } from "next-auth/middleware";

import { publicUrl } from "./env.mjs";
import { publicPaths, reservedWords } from "./lib/constants";
import { getRootUrl } from "./lib/helpers";
import { checkIpReputation } from "./lib/security";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const rootDomain = new URL(publicUrl).host;

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

const TRUSTED_IPS = new Set(["127.0.0.1"]);

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const subdomain = extractSubdomain(req);

    if (subdomain) {
      if (pathname === "/") {
        return NextResponse.rewrite(new URL(`/s/${subdomain}`, req.url));
      }

      const rootUrl = getRootUrl(req);

      if (reservedWords.includes(pathname.slice(1))) {
        return NextResponse.redirect(new URL(pathname.slice(1), rootUrl));
      }

      return NextResponse.next();
    }

    if (pathname.startsWith("/api")) {
      try {
        let ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

        if (!ip && process.env.NODE_ENV === "development") {
          const response = await fetch("https://api.ipify.org?format=json");
          ip = (await response.json()).ip;
        }

        if (ip && !TRUSTED_IPS.has(ip)) {
          const isBadIp = await checkIpReputation(ip);

          if (isBadIp) {
            console.warn(`IP bloqueada: ${ip}`, {
              path: pathname,
              ua: req.headers.get("user-agent"),
            });

            return new NextResponse(
              JSON.stringify({ error: "Access denied", code: "IP_BLOCKED" }),
              { status: 403, headers: { "Content-Type": "application/json" } },
            );
          }
        }
      } catch (error) {
        console.error("IP verification failed:", error);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const subdomain = extractSubdomain(req);

        // Allow public access only to short code paths in subdomains
        // and to login/register paths in the main domain
        if (subdomain && pathname.match(/^\/[a-zA-Z0-9_-]+$/)) {
          return true;
        }

        if (pathname === "/") return true;

        if (publicPaths.some((path) => pathname.startsWith(`/${path}`))) {
          return true;
        }

        // if (pathname.startsWith("/admin")) { return token?.role === "admin"; }
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/auth/error",
    },
  },
);

export const config = {
  /*
   * Match all paths except for:
   * 1. /_next (Next.js internals)
   * 2. all root files inside /public (e.g. /favicon.ico)
   */
  matcher: "/((?!_next|[\\w-]+\\.\\w+).*)",
};
