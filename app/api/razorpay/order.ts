import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { createOrder } from '@/lib/razorpay'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering for payment operations
export const dynamic = 'force-dynamic'

/**
 * POST /api/razorpay/order
 * Create a new Razorpay order
 * Frontend calls this to initiate payment
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'payment', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Rate limit exceeded. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    const body = await req.json()
    const { 
      amount, 
      freelancerId, 
      projectId, 
      templateId, 
      description,
      receipt 
    } = body

    // Validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return errorResponse(400, 'Valid amount is required')
    }

    // Minimum amount: ₹1 (can adjust based on your business rules)
    if (amount < 1) {
      return errorResponse(400, 'Minimum amount is ₹1')
    }

    if (!freelancerId) {
      return errorResponse(400, 'Freelancer ID is required')
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        name: true,
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Verify freelancer exists
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
      select: { id: true, email: true, name: true },
    })

    if (!freelancer) {
      return errorResponse(404, 'Freelancer not found')
    }

    try {
      // Create Razorpay order
      const order = await createOrder({
        amount,
        currency: 'INR',
        receipt: receipt || `order_${userId}_${Date.now()}`,
        description: description || 'ALTFaze Project/Template Payment',
        customerName: user.name || 'Customer',
        customerEmail: user.email || '',
        customerId: userId,
      })

      // Create pending transaction record in database
      const transaction = await db.transaction.create({
        data: {
          userId,
          type: 'PAYMENT',
          amount: amount,
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
            clientEmail: user.email,
            freelancerEmail: freelancer.email,
          },
        },
      })

      return successResponse(
        {
          orderId: order.id,
          amount: amount,
          currency: 'INR',
          transactionId: transaction.id,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          customerName: user.name,
          customerEmail: user.email,
          description: description || 'Payment',
        },
        201,
        'Order created successfully'
      )
    } catch (razorpayError: any) {
      console.error('[RAZORPAY_ORDER_ERROR]', razorpayError)
      return errorResponse(500, 'Failed to create payment order. Please try again.')
    }
  } catch (error) {
    console.error('[RAZORPAY_ENDPOINT_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * GET /api/razorpay/order?orderId=...
 * Get order status
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'payment', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Rate limit exceeded')
    }

    const { userId } = await requireAuth(req)

    const orderId = req.nextUrl.searchParams.get('orderId')

    if (!orderId) {
      return errorResponse(400, 'Order ID is required')
    }

    // Get transaction by order ID with ownership verification
    const transaction = await db.transaction.findFirst({
      where: { 
        razorpayOrderId: orderId,
        userId: userId, // Verify user owns this transaction
      },
      select: {
        id: true,
        status: true,
        amount: true,
        description: true,
        createdAt: true,
        userId: true,
      },
    })

    if (!transaction) {
      return errorResponse(404, 'Transaction not found')
    }

    // Additional security check
    if (transaction.userId !== userId) {
      return errorResponse(403, 'Unauthorized: You do not have permission to access this transaction')
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
    console.error('[RAZORPAY_GET_ERROR]', error)
    return handleApiError(error)
  }
}
