import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering - always get fresh data from DB
// Critical for payment routes - never cache!
export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/checkout
 * Initialize Stripe checkout session
 * 
 * SECURITY: This is a CRITICAL payment route
 * - Must never be cached
 * - Must validate user session
 * - Must validate amount
 * - Must create proper audit trail
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, type, itemId } = await req.json()

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, stripeCustomerId: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is suspended
    const userStatus = await db.user.findUnique({
      where: { id: user.id },
      select: { isSuspended: true }
    })

    if (userStatus?.isSuspended) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 })
    }

    // In production, create actual Stripe checkout session
    // For now, we'll return a mock URL for development
    const checkoutUrl = `${process.env.NEXTAUTH_URL}/payment/success?amount=${amount}`

    console.log('[STRIPE_CHECKOUT]', { userId: user.id, amount, type, itemId })

    return NextResponse.json({ url: checkoutUrl }, { status: 200 })
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
