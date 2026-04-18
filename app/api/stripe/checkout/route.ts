import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

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
      return errorResponse(401, "Unauthorized")
    }

    const { amount, type, itemId } = await req.json()

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return errorResponse(400, "Invalid amount provided")
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, stripeCustomerId: true }
    })

    if (!user) {
      return errorResponse(404, "User not found")
    }

    // Check if user is suspended
    const userStatus = await db.user.findUnique({
      where: { id: user.id },
      select: { isSuspended: true }
    })

    if (userStatus?.isSuspended) {
      return errorResponse(403, "Account suspended")
    }

    // In production, create actual Stripe checkout session
    // For now, we'll return a mock URL for development
    const checkoutUrl = `${process.env.NEXTAUTH_URL}/payment/success?amount=${amount}`

    console.log('[STRIPE_CHECKOUT]', { userId: user.id, amount, type, itemId })

    return successResponse({ url: checkoutUrl }, 200, "Checkout session created")
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error)
    return errorResponse(500, "Internal server error", error)
  }
}
