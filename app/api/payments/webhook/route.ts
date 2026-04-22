import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * POST /api/payments/webhook
 * Razorpay webhook handler for payment confirmation
 * Validates signature and updates transaction status
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    // Validate webhook signature
    if (!signature) {
      console.warn('[WEBHOOK] Missing Razorpay signature')
      return errorResponse(401, 'Invalid signature')
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) {
      console.error('[WEBHOOK] RAZORPAY_WEBHOOK_SECRET not configured')
      return errorResponse(500, 'Webhook not configured')
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.warn('[WEBHOOK] Invalid signature for webhook')
      return errorResponse(401, 'Invalid signature')
    }

    const event = JSON.parse(body)
    console.log('[WEBHOOK] Event received:', event.event)

    // Handle payment.authorized event
    if (event.event === 'payment.authorized') {
      const payment = event.payload.payment.entity
      const razorpayOrderId = payment.order_id
      const razorpayPaymentId = payment.id
      const amount = payment.amount / 100 // Convert from paise to rupees
      const status = payment.status

      // Find transaction by razorpayOrderId
      const transaction = await db.transaction.findFirst({
        where: {
          razorpayOrderId: razorpayOrderId,
          status: 'PENDING',
        },
        include: {
          user: true,
        },
      })

      if (!transaction) {
        console.warn('[WEBHOOK] Transaction not found for order:', razorpayOrderId)
        return successResponse({ processed: false }, 200, 'Transaction not found')
      }

      if (status === 'captured' || status === 'authorized') {
        // Payment successful - update transaction
        const existingMetadata = typeof transaction.metadata === 'object' && transaction.metadata !== null 
          ? (transaction.metadata as Record<string, any>) 
          : {}

        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            razorpayPaymentId: razorpayPaymentId,
            metadata: {
              ...existingMetadata,
              razorpayPaymentId,
              webhookProcessedAt: new Date().toISOString(),
            },
          },
        })

        // Add funds to client wallet
        await db.user.update({
          where: { id: transaction.userId },
          data: {
            walletBalance: {
              increment: amount,
            },
          },
        })

        // Log activity
        await db.activityLog.create({
          data: {
            userId: transaction.userId,
            action: 'PAYMENT_RECEIVED',
            description: `Received ₹${amount} via Razorpay`,
            metadata: {
              amount,
              razorpayPaymentId,
              razorpayOrderId,
            },
          },
        }).catch((err: any) => console.error('[WEBHOOK_ACTIVITY_LOG]', err))

        console.log('[WEBHOOK] Payment confirmed:', {
          userId: transaction.userId,
          amount,
          razorpayPaymentId,
        })

        return successResponse({ processed: true }, 200, 'Payment processed')
      }

      if (status === 'failed') {
        // Payment failed - update transaction
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            razorpayPaymentId: razorpayPaymentId,
          },
        })

        console.log('[WEBHOOK] Payment failed:', {
          userId: transaction.userId,
          razorpayPaymentId,
        })

        return successResponse({ processed: true }, 200, 'Payment failure recorded')
      }
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      const razorpayOrderId = payment.order_id
      const razorpayPaymentId = payment.id

      const transaction = await db.transaction.findFirst({
        where: {
          razorpayOrderId: razorpayOrderId,
          status: 'PENDING',
        },
      })

      if (transaction) {
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            razorpayPaymentId: razorpayPaymentId,
          },
        })
      }

      return successResponse({ processed: true }, 200, 'Payment failure recorded')
    }

    // For other events, just acknowledge receipt
    return successResponse({ processed: false }, 200, 'Event acknowledged')
  } catch (error: any) {
    console.error('[WEBHOOK_ERROR]', error)
    // Always return 200 to Razorpay to prevent retries, but log the error
    return successResponse({ error: error.message }, 200, 'Error processing webhook')
  }
}
