import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

/**
 * Enhanced Middleware with Strict Role-Based Access Control
 * Production-Grade Security Implementation
 */

export default withAuth(
  async function middleware(req: { nextUrl: { pathname: string; search: any }; url: string | URL | undefined }) {
    // ✅ FIXED: Handle JWT decryption errors gracefully
    let token
    try {
      // @ts-ignore
      token = await getToken({ req })
    } catch (error) {
      console.error('[MIDDLEWARE] JWT Error:', error)
      // If JWT fails, redirect to login to force re-authentication
      return NextResponse.redirect(new URL("/login?error=jwt_error", req.url))
    }

    const isAuth = !!token
    const userRole = token?.role as string | undefined
    const isSuspended = token?.isSuspended as boolean | undefined
    const userId = token?.sub as string | undefined

    // ✅ SECURITY: Reject suspended users immediately
    if (isSuspended) {
      console.warn(`[MIDDLEWARE_SECURITY] Suspended user attempt: ${userId}`)
      return NextResponse.redirect(new URL("/login?error=suspended", req.url))
    }

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
        return NextResponse.next()
      }
      // Redirect unauthenticated users to login from onboard
      if (req.nextUrl.pathname.startsWith("/onboard")) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      return NextResponse.next()
    }

    // ✅ FIXED: Direct bare path redirects to client/freelancer paths
    if (req.nextUrl.pathname === "/client") {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      if (userRole !== "CLIENT") {
        return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
      }
      // Redirect bare /client to /client/dashboard
      return NextResponse.redirect(new URL("/client/dashboard", req.url))
    }

    if (req.nextUrl.pathname === "/freelancer") {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      if (userRole !== "FREELANCER") {
        return NextResponse.redirect(new URL("/client/dashboard", req.url))
      }
      // Redirect bare /freelancer to /freelancer/my-dashboard
      return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
    }

    // ✅ FIXED: Proper role validation for CLIENT dashboard routes
    if (req.nextUrl.pathname.startsWith("/client/dashboard")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /client/dashboard access - redirecting to login')
        return NextResponse.redirect(new URL("/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to onboard')
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      if (userRole !== "CLIENT") {
        console.log('[MIDDLEWARE] Non-client user attempted access to /client/dashboard', { role: userRole })
        if (userRole === "FREELANCER") {
          return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      console.log('[MIDDLEWARE] ✅ CLIENT role verified for /client/dashboard route')
      return NextResponse.next()
    }

    // ✅ FIXED: Proper role validation for CLIENT routes starting with /client/ (but NOT dashboard)
    if (req.nextUrl.pathname.startsWith("/client/")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /client/ access - redirecting to login')
        return NextResponse.redirect(new URL("/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to onboard')
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      if (userRole !== "CLIENT") {
        console.log('[MIDDLEWARE] Non-client user attempted access to /client route', { role: userRole })
        if (userRole === "FREELANCER") {
          return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      console.log('[MIDDLEWARE] ✅ CLIENT role verified for /client route')
      return NextResponse.next()
    }

    // ✅ FIXED: Same for my-dashboard routes - FREELANCER dashboard
    if (req.nextUrl.pathname.startsWith("/freelancer/my-dashboard")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /freelancer/my-dashboard access - redirecting to login')
        return NextResponse.redirect(new URL("/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to onboard')
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      if (userRole !== "FREELANCER") {
        console.log('[MIDDLEWARE] Non-freelancer user attempted access to /freelancer/my-dashboard', { role: userRole })
        if (userRole === "CLIENT") {
          return NextResponse.redirect(new URL("/client/dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      console.log('[MIDDLEWARE] ✅ FREELANCER role verified for /freelancer/my-dashboard route')
      return NextResponse.next()
    }

    // ✅ FIXED: Proper role validation for FREELANCER routes starting with /freelancer/
    if (req.nextUrl.pathname.startsWith("/freelancer/")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /freelancer/ access - redirecting to login')
        return NextResponse.redirect(new URL("/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to onboard')
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      if (userRole !== "FREELANCER") {
        console.log('[MIDDLEWARE] Non-freelancer user attempted access to /freelancer route', { role: userRole })
        if (userRole === "CLIENT") {
          return NextResponse.redirect(new URL("/client/dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      
      console.log('[MIDDLEWARE] ✅ FREELANCER role verified for /freelancer route')
      return NextResponse.next()
    }

    // ✅ CLIENT-ONLY routes: /client/hire, /client/projects, /client/requests, /client/freelancers
    if (req.nextUrl.pathname.startsWith("/client/hire") || 
        req.nextUrl.pathname.startsWith("/client/projects") ||
        req.nextUrl.pathname.startsWith("/client/requests") ||
        req.nextUrl.pathname.startsWith("/client/freelancers")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      if (!userRole) {
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      if (userRole !== "CLIENT") {
        return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
      }
      return NextResponse.next()
    }

    // ✅ FREELANCER-ONLY routes: /freelancer/work, /freelancer/upload, /freelancer/my-requests
    if (req.nextUrl.pathname.startsWith("/freelancer/work") || 
        req.nextUrl.pathname.startsWith("/freelancer/upload") ||
        req.nextUrl.pathname.startsWith("/freelancer/my-requests")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      if (!userRole) {
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      if (userRole !== "FREELANCER") {
        return NextResponse.redirect(new URL("/client/dashboard", req.url))
      }
      return NextResponse.next()
    }

    // ✅ SHARED routes (both roles): /client/templates, /client/ai-help, /client/wallet, /client/offers, /client/settings, /client/profile
    // and /freelancer/templates, /freelancer/ai-help, /freelancer/wallet, /freelancer/offers, /freelancer/settings, /freelancer/profile
    if ((req.nextUrl.pathname.startsWith("/client/templates") ||
        req.nextUrl.pathname.startsWith("/client/ai-help") ||
        req.nextUrl.pathname.startsWith("/client/wallet") ||
        req.nextUrl.pathname.startsWith("/client/offers") ||
        req.nextUrl.pathname.startsWith("/client/settings") ||
        req.nextUrl.pathname.startsWith("/client/profile")) ||
        (req.nextUrl.pathname.startsWith("/freelancer/templates") ||
        req.nextUrl.pathname.startsWith("/freelancer/ai-help") ||
        req.nextUrl.pathname.startsWith("/freelancer/wallet") ||
        req.nextUrl.pathname.startsWith("/freelancer/offers") ||
        req.nextUrl.pathname.startsWith("/freelancer/settings") ||
        req.nextUrl.pathname.startsWith("/freelancer/profile"))) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
      if (!userRole) {
        return NextResponse.redirect(new URL("/onboard", req.url))
      }
      return NextResponse.next()
    }

    // Protect all other authenticated routes
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // ✅ DEFAULT: Allow authenticated users to proceed
    return NextResponse.next()
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
  matcher: [
    '/client/:path*',
    '/freelancer/:path*',
    '/login',
    '/register',
    '/onboard',
  ]
}