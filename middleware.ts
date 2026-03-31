import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req: { nextUrl: { pathname: string; search: any }; url: string | URL | undefined }) {
    {/* @ts-ignore */}
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname.startsWith("/onboard")

    if (isAuthPage) {
      if (isAuth) {
        if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
          return NextResponse.redirect(new URL("/onboard", req.url))
        }
        // Allow access to /onboard if authenticated
        return null
      }
      // Redirect unauthenticated users to login from onboard
      if (req.nextUrl.pathname.startsWith("/onboard")) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export const config = {
    matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/register", "/onboard"],
}