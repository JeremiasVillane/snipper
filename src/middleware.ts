import withAuth from "next-auth/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default withAuth(
  // function middleware(req: NextRequest, token) {
  //   const { pathname } = req.nextUrl;

  //   if (pathname.startsWith("/signin")) {
  //     if (token) {
  //       return NextResponse.redirect(`${req.nextUrl.origin}/profile`);
  //     }
  //   }
  //   return NextResponse.next();
  // },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        // if (req.nextUrl.pathname.startsWith("/admin")) {
        //   return token?.role === "admin";
        // }
        // if (req.nextUrl.pathname.startsWith("/signin")) {
        //   if (token) return false;
        //   else return true;
        // }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin:path*", "/profile"],
};
