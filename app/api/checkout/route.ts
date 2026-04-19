import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { createOrder } from '@/lib/razorpay'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering for checkout operations
export const dynamic = 'force-dynamic'

/**
 * POST /api/checkout
 * Redirects to Razorpay payment flow
 * Creates order and returns order details for frontend
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'checkout', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) return errorResponse(429, 'Rate limit exceeded')

    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { amount } = body

    if (!amount || amount < 1) {
      return errorResponse(400, 'Minimum amount is ₹1')
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    try {
      // Create Razorpay order for wallet top-up
      const order = await createOrder({
        amount,
        currency: 'INR',
        receipt: `wallet_${userId}_${Date.now()}`,
        description: `Add ₹${amount} to ALTFaze wallet`,
        customerName: user.name || 'Customer',
        customerEmail: user.email || '',
        customerId: userId,
      })

      // Create pending transaction
      const transaction = await db.transaction.create({
        data: {
          userId,
          type: 'PAYMENT',
          amount: amount,
          description: `Wallet top-up: ₹${amount}`,
          status: 'PENDING',
          razorpayOrderId: order.id,
          metadata: {
            walletTopup: true,
          },
        },
      })

      return successResponse(
        {
          orderId: order.id,
          amount,
          currency: 'INR',
          transactionId: transaction.id,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          customerName: user.name,
          customerEmail: user.email,
        },
        201,
        'Checkout order created'
      )
    } catch (razorpayError: any) {
      console.error('[RAZORPAY_ERROR]', razorpayError)
      return errorResponse(500, 'Failed to create payment order. Please try again.')
    }
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error)
    return handleApiError(error)
  }
}
