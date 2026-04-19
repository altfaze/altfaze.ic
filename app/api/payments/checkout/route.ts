import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, isValidAmount } from '@/lib/api-utils'
import { createOrder } from '@/lib/razorpay'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering for payment operations
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    const body = await req.json()
    const { freelancerId, amount, projectId, templateId, description } = body

    // Validation
    if (!freelancerId) {
      return errorResponse(400, 'freelancerId is required')
    }

    if (!isValidAmount(amount, 1)) {
      return errorResponse(400, 'Valid amount is required (minimum ₹1)')
    }

    // Verify freelancer exists
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
      select: { id: true, email: true, name: true },
    })

    if (!freelancer) {
      return errorResponse(404, 'Freelancer not found')
    }

    // Verify client exists and get details
    const client = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    if (!client) {
      return errorResponse(404, 'Client not found')
    }

    try {
      // Create Razorpay order
      const order = await createOrder({
        amount: parseFloat(amount),
        currency: 'INR',
        receipt: `order_${userId}_${Date.now()}`,
        description: description || 'Payment for project/template',
        customerName: client.name || 'Customer',
        customerEmail: client.email || '',
        customerId: userId,
      })

      // Create pending transaction record
      await db.transaction.create({
        data: {
          userId: userId,
          type: 'PAYMENT',
          amount: parseFloat(amount),
          status: 'PENDING',
          razorpayOrderId: order.id,
          description: description || 'Payment for project/template',
          senderId: userId,
          receiverId: freelancerId,
          projectId: projectId || null,
          templateId: templateId || null,
          metadata: {
            razorpayOrderId: order.id,
            freelancerId,
            clientEmail: client.email,
            freelancerEmail: freelancer.email,
          },
        },
      })

      return successResponse(
        {
          orderId: order.id,
          amount: parseFloat(amount),
          description: description || 'Payment',
          currency: 'INR',
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          customerName: client.name,
          customerEmail: client.email,
        },
        200,
        'Order created successfully'
      )
    } catch (razorpayError: any) {
      console.error('[RAZORPAY_ERROR]', razorpayError)
      return errorResponse(500, 'Failed to create payment order. Please try again.')
    }
  } catch (error) {
    console.error('[PAYMENTS_CHECKOUT_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * GET /api/payments/checkout?orderId=...
 * Get checkout session status
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    const orderId = req.nextUrl.searchParams.get('orderId')

    if (!orderId) {
      return errorResponse(400, 'orderId is required')
    }

    // Get transaction by order ID
    const transaction = await db.transaction.findUnique({
      where: { razorpayOrderId: orderId },
      select: {
        id: true,
        status: true,
        amount: true,
        description: true,
        createdAt: true,
      },
    })

    if (!transaction) {
      return errorResponse(404, 'Transaction not found')
    }

    return successResponse(
      {
        transactionId: transaction.id,
        status: transaction.status,
        amount: transaction.amount.toNumber(),
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
      200,
      'Order retrieved'
    )
  } catch (error) {
    console.error('[PAYMENTS_GET_ERROR]', error)
    return handleApiError(error)
  }
}
