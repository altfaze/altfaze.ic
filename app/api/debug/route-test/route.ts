import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Debug endpoint to test routing and authentication
 * URL: /api/debug/route-test
 */
export async function GET(req: Request) {
  try {
    console.log('🔧 [ROUTE_TEST] DEBUG endpoint called')

    // Get session
    const session = await getAuthSession()
    console.log('📋 [ROUTE_TEST] Session:', session ? '✅ Present' : '❌ Missing')

    // Get JWT token
    let token
    try {
      // @ts-ignore
      token = await getToken({ req })
      console.log('🎫 [ROUTE_TEST] JWT Token:', token ? '✅ Present' : '❌ Missing')
    } catch (tokenErr) {
      console.error('❌ [ROUTE_TEST] JWT Error:', tokenErr)
    }

    // Get user from database
    let dbUser = null
    if (session?.user?.email) {
      dbUser = await db.user.findUnique({
        where: { email: session.user.email.toLowerCase().trim() },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      console.log('🗄️  [ROUTE_TEST] DB User:', dbUser ? '✅ Found' : '❌ Not found')
    }

    // Test redirect paths
    const redirectUrls = {
      clientDashboard: '/client/dashboard',
      freelancerDashboard: '/freelancer/my-dashboard',
    }

    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      diagnostics: {
        sessionPresent: !!session,
        sessionUser: session?.user ? {
          email: session.user.email,
          name: session.user.name,
          role: (session.user as any).role,
        } : null,
        jwtPresent: !!token,
        jwtRole: token?.role as string | undefined,
        dbUser: dbUser ? {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          createdAt: dbUser.createdAt,
        } : null,
        roleConsistency: {
          sessionRole: (session?.user as any)?.role,
          jwtRole: token?.role,
          dbRole: dbUser?.role,
          isConsistent:
            (session?.user as any)?.role === token?.role &&
            token?.role === dbUser?.role,
        },
      },
      redirectUrls,
      nextSteps: dbUser?.role
        ? dbUser.role === 'CLIENT'
          ? `Redirect to ${redirectUrls.clientDashboard}`
          : `Redirect to ${redirectUrls.freelancerDashboard}`
        : 'User has no role - go to /onboard',
      message: 'Use browser DevTools > Console to check logs',
    })
  } catch (error: any) {
    console.error('[ROUTE_TEST] Error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
