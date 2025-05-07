import { isSpoofedBot } from "@arcjet/inspect";
import { ArcjetDecision } from "@arcjet/next";
import withAuth, { type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { aj } from "./lib/arcjet";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    if (!!aj) {
      try {
        const decision: ArcjetDecision = await aj.protect(req, {
          requested: 5,
        });

        if (decision.isDenied()) {
          if (decision.reason.isRateLimit()) {
            return NextResponse.json(
              { error: "Too Many Requests", reason: decision.reason },
              { status: 429 }
            );
          } else if (decision.reason.isBot()) {
            return NextResponse.json(
              { error: "No bots allowed", reason: decision.reason },
              { status: 403 }
            );
          } else {
            return NextResponse.json(
              { error: "Forbidden", reason: decision.reason },
              { status: 403 }
            );
          }
        }

        // https://docs.arcjet.com/bot-protection/reference#bot-verification
        if (decision.results.some(isSpoofedBot)) {
          return NextResponse.json(
            { error: "Forbidden", reason: decision.reason },
            { status: 403 }
          );
        }
      } catch (error) {
        console.error("Arcjet middleware error:", error);
        return NextResponse.json(
          { error: "Security check failed" },
          { status: 500 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
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
  }
);

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
