import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { verifyPaymentSignature, getPayment } from '@/lib/razorpay'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/razorpay/verify
 * 
 * CRITICAL: Verify payment signature on backend
 * Never trust payment success from frontend - always verify here!
 * 
 * Frontend sends:
 * - razorpay_order_id
 * - razorpay_payment_id
 * - razorpay_signature
 * 
 * Backend:
 * 1. Verifies HMAC SHA256 signature
 * 2. Confirms payment status
 * 3. Updates database
 * 4. Handles wallet/fund transfer
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'payment', API_RATE_LIMIT.limit * 2, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Rate limit exceeded')
    }

    const { userId } = await requireAuth(req)

    const body = await req.json()
    const { 
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse(400, 'Missing payment verification data')
    }

    // STEP 1: Verify signature using HMAC SHA256
    const isSignatureValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isSignatureValid) {
      console.warn('[PAYMENT_VERIFICATION_FAILED]', {
        userId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      })
      
      // Mark transaction as failed
      await db.transaction.updateMany({
        where: {
          razorpayOrderId: razorpay_order_id,
          userId,
        },
        data: {
          status: 'FAILED',
          metadata: {
            reason: 'Invalid payment signature',
            failedAt: new Date().toISOString(),
          },
        },
      })

      return errorResponse(401, 'Payment verification failed. Invalid signature.')
    }

    // STEP 2: Get payment details from Razorpay to confirm status
    let paymentDetails: any
    try {
      paymentDetails = await getPayment(razorpay_payment_id)
    } catch (error) {
      console.error('[PAYMENT_FETCH_ERROR]', error)
      return errorResponse(500, 'Could not verify payment status')
    }

    // Check if payment is captured/authorized
    if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
      console.warn('[PAYMENT_NOT_CAPTURED]', {
        paymentId: razorpay_payment_id,
        status: paymentDetails.status,
      })

      return errorResponse(
        400,
        `Payment not completed. Status: ${paymentDetails.status}`
      )
    }

    // STEP 3: Find transaction
    const transaction = await db.transaction.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    })

    if (!transaction) {
      return errorResponse(404, 'Transaction not found')
    }

    // Verify transaction belongs to current user
    if (transaction.userId !== userId) {
      console.warn('[UNAUTHORIZED_PAYMENT_VERIFICATION]', {
        userId,
        transactionUserId: transaction.userId,
      })
      return errorResponse(403, 'Unauthorized payment verification')
    }

    // STEP 4: Update transaction status to SUCCESS
    const updatedTransaction = await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'SUCCESS',
        razorpayPaymentId: razorpay_payment_id,
        metadata: {
          verifiedAt: new Date().toISOString(),
          paymentStatus: paymentDetails.status,
          amount: paymentDetails.amount,
          fee: paymentDetails.fee,
          tax: paymentDetails.tax,
        },
      },
    })

    // STEP 5: Handle fund transfer based on transaction type
    if (transaction.type === 'PAYMENT' && transaction.receiverId) {
      // Fetch receiver user for wallet update
      const receiverUser = await db.user.findUnique({
        where: { id: transaction.receiverId },
        select: { id: true, email: true },
      })

      if (receiverUser) {
        // Fetch sender for logging
        const senderUser = await db.user.findUnique({
          where: { id: transaction.userId },
          select: { email: true },
        })

        // Log the activity
        console.log('[PAYMENT_SUCCESS]', {
          transactionId: transaction.id,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: transaction.amount,
          sender: senderUser?.email,
          receiver: receiverUser.email,
        })
      }
    }

    return successResponse(
      {
        success: true,
        transactionId: transaction.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: transaction.amount.toNumber(),
        status: 'SUCCESS',
        message: 'Payment verified successfully',
      },
      200,
      'Payment verified and processed'
    )
  } catch (error) {
    console.error('[PAYMENT_VERIFICATION_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * GET /api/razorpay/verify?orderId=...&paymentId=...
 * Check payment status (read-only)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const orderId = req.nextUrl.searchParams.get('orderId')
    const paymentId = req.nextUrl.searchParams.get('paymentId')

    if (!orderId || !paymentId) {
      return errorResponse(400, 'Order ID and Payment ID are required')
    }

    // Get transaction
    const transaction = await db.transaction.findUnique({
      where: { razorpayOrderId: orderId },
      select: {
        id: true,
        userId: true,
        status: true,
        amount: true,
        createdAt: true,
      },
    })

    if (!transaction) {
      return errorResponse(404, 'Transaction not found')
    }

    // Verify ownership
    if (transaction.userId !== userId) {
      return errorResponse(403, 'Unauthorized')
    }

    return successResponse(
      {
        transactionId: transaction.id,
        status: transaction.status,
        amount: transaction.amount.toNumber(),
        createdAt: transaction.createdAt,
      },
      200,
      'Payment status retrieved'
    )
  } catch (error) {
    console.error('[VERIFY_GET_ERROR]', error)
    return handleApiError(error)
  }
}
