import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import Stripe from 'stripe'

// Force dynamic rendering for checkout operations
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'checkout', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) return errorResponse(429, 'Rate limit exceeded')

    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { amount } = body

    if (!amount || amount < 5) {
      return errorResponse(400, 'Minimum amount is $5')
    }

    // Get or create Stripe customer
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: user.name || undefined,
        metadata: { userId, email: user.email || '' },
      } as any)
      customerId = customer.id

      // Save customer ID
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Add Funds to Wallet',
              description: `Add $${amount.toFixed(2)} to your ALTFaze wallet`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/add-funds?cancelled=true`,
      metadata: {
        userId,
        amount: amount.toString(),
      },
    })

    // Create pending transaction
    await db.transaction.create({
      data: {
        userId,
        type: 'PAYMENT',
        amount: amount,
        description: `Wallet top-up: $${amount.toFixed(2)}`,
        status: 'PENDING',
        stripeSessionId: session.id,
      },
    })

    return successResponse({ sessionId: session.id }, 201, 'Checkout session created')
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error)
    return handleApiError(error)
  }
}
