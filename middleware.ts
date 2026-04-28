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
      return NextResponse.redirect(new URL("/auth/login?error=jwt_error", req.url))
    }

    const isAuth = !!token
    const userRole = token?.role as string | undefined
    const isSuspended = token?.isSuspended as boolean | undefined
    const userId = token?.sub as string | undefined

    // ✅ SECURITY: Reject suspended users immediately
    if (isSuspended) {
      console.warn(`[MIDDLEWARE_SECURITY] Suspended user attempt: ${userId}`)
      return NextResponse.redirect(new URL("/auth/login?error=suspended", req.url))
    }

    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname.startsWith("/auth/") ||
      req.nextUrl.pathname.startsWith("/select-role") ||
      req.nextUrl.pathname.startsWith("/onboard")

    // ✅ FIXED: Handle root path for authenticated users without role after OAuth
    if (req.nextUrl.pathname === "/") {
      if (isAuth && !userRole) {
        console.log('[MIDDLEWARE] Authenticated user without role landed on homepage - redirecting to select-role')
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      // Allow unauthenticated users and authenticated users with role to view homepage
      return NextResponse.next()
    }

    if (isAuthPage) {
      if (isAuth) {
        // If user is authenticated and on login/register pages, redirect appropriately
        if (req.nextUrl.pathname.startsWith("/login") || 
            req.nextUrl.pathname.startsWith("/register") ||
            req.nextUrl.pathname.startsWith("/auth/login") ||
            req.nextUrl.pathname.startsWith("/auth/register")) {
          // If they have a role, send to dashboard; if not, send to select-role
          if (!userRole) {
            return NextResponse.redirect(new URL("/select-role", req.url))
          }
          if (userRole === "FREELANCER") {
            return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
          } else {
            return NextResponse.redirect(new URL("/client/dashboard", req.url))
          }
        }
        
        // If user is on /select-role but already has a role, redirect to dashboard
        if (req.nextUrl.pathname.startsWith("/select-role")) {
          if (userRole) {
            // User already has role - redirect from /select-role to dashboard
            if (userRole === "FREELANCER") {
              return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
            } else {
              return NextResponse.redirect(new URL("/client/dashboard", req.url))
            }
          }
          // Allow authenticated users without role to access /select-role
          return NextResponse.next()
        }
        
        // Allow access to /onboard and /auth/ if authenticated (legacy support)
        return NextResponse.next()
      }
      
      // Unauthenticated users
      if (req.nextUrl.pathname.startsWith("/select-role") || req.nextUrl.pathname.startsWith("/onboard")) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      return NextResponse.next()
    }

    // ✅ FIXED: Direct bare path redirects to client/freelancer paths
    if (req.nextUrl.pathname.startsWith("/client")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      if (userRole !== "CLIENT") {
        // Non-client trying to access client routes
        return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
      }
      return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith("/freelancer")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      if (userRole !== "FREELANCER") {
        // Non-freelancer trying to access freelancer routes
        return NextResponse.redirect(new URL("/client/dashboard", req.url))
      }
      return NextResponse.next()
    }

    // ✅ FIXED: Proper role validation for CLIENT dashboard routes
    if (req.nextUrl.pathname.startsWith("/client/dashboard")) {
      if (!isAuth) {
        // Unauthenticated /client/dashboard access - redirect to login
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to select-role')
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      if (userRole !== "CLIENT") {
        // Non-client user attempted access to /client/dashboard
        if (userRole === "FREELANCER") {
          return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      // CLIENT role verified for /client/dashboard route
      return NextResponse.next()
    }

    // ✅ FIXED: Proper role validation for CLIENT routes starting with /client/ (but NOT dashboard)
    if (req.nextUrl.pathname.startsWith("/client/")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /client/ access - redirecting to login')
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to select-role')
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      if (userRole !== "CLIENT") {
        console.log('[MIDDLEWARE] Non-client user attempted access to /client route', { role: userRole })
        if (userRole === "FREELANCER") {
          return NextResponse.redirect(new URL("/freelancer/my-dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      console.log('[MIDDLEWARE] ✅ CLIENT role verified for /client route')
      return NextResponse.next()
    }

    // ✅ FIXED: Same for my-dashboard routes - FREELANCER dashboard
    if (req.nextUrl.pathname.startsWith("/freelancer/my-dashboard")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /freelancer/my-dashboard access - redirecting to login')
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to select-role')
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      if (userRole !== "FREELANCER") {
        console.log('[MIDDLEWARE] Non-freelancer user attempted access to /freelancer/my-dashboard', { role: userRole })
        if (userRole === "CLIENT") {
          return NextResponse.redirect(new URL("/client/dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      console.log('[MIDDLEWARE] ✅ FREELANCER role verified for /freelancer/my-dashboard route')
      return NextResponse.next()
    }

    // ✅ FIXED: Proper role validation for FREELANCER routes starting with /freelancer/
    if (req.nextUrl.pathname.startsWith("/freelancer/")) {
      if (!isAuth) {
        console.log('[MIDDLEWARE] Unauthenticated /freelancer/ access - redirecting to login')
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
      
      if (!userRole) {
        console.log('[MIDDLEWARE] No role set for authenticated user - redirecting to select-role')
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      
      if (userRole !== "FREELANCER") {
        console.log('[MIDDLEWARE] Non-freelancer user attempted access to /freelancer route', { role: userRole })
        if (userRole === "CLIENT") {
          return NextResponse.redirect(new URL("/client/dashboard", req.url))
        }
        return NextResponse.redirect(new URL("/select-role", req.url))
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
        return NextResponse.redirect(new URL("/select-role", req.url))
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
        return NextResponse.redirect(new URL("/select-role", req.url))
      }
      if (userRole !== "FREELANCER") {
        return NextResponse.redirect(new URL("/client/dashboard", req.url))
      }
      return NextResponse.next()
    }

    // ✅ CLIENT routes: /client/templates, /client/ai-help, /client/wallet, /client/offers, /client/settings
    // ✅ FREELANCER routes: /freelancer/templates, /freelancer/ai-help, /freelancer/wallet, /freelancer/offers, /freelancer/settings, /freelancer/profile
    if ((req.nextUrl.pathname.startsWith("/client/templates") ||
        req.nextUrl.pathname.startsWith("/client/ai-help") ||
        req.nextUrl.pathname.startsWith("/client/wallet") ||
        req.nextUrl.pathname.startsWith("/client/offers") ||
        req.nextUrl.pathname.startsWith("/client/settings")) ||
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
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
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
    '/',
    '/client/:path*',
    '/freelancer/:path*',
    '/auth/:path*',
    '/login',
    '/register',
    '/select-role',
    '/onboard',
  ]
}