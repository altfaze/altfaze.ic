import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { errorResponse, successResponse } from '@/lib/api-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/razorpay/webhook
 * 
 * Razorpay webhook handler
 * Receives events from Razorpay for real-time payment updates
 * 
 * IMPORTANT: Verify webhook signature to ensure authenticity
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
    
    if (!webhookSecret) {
      console.warn('[WEBHOOK] Razorpay webhook secret not configured')
      return errorResponse(500, 'Webhook not configured')
    }

    // Create HMAC SHA256 hash
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    // Verify signature
    if (generatedSignature !== signature) {
      console.warn('[WEBHOOK_VERIFICATION_FAILED]', {
        expected: generatedSignature,
        received: signature,
      })
      return errorResponse(401, 'Invalid webhook signature')
    }

    // Parse webhook payload
    const event = JSON.parse(body)
    
    console.log('[WEBHOOK_RECEIVED]', event.event)

    // Handle different event types
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity)
        break

      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break

      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break

      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity)
        break

      default:
        console.log('[WEBHOOK_UNHANDLED]', event.event)
    }

    return successResponse({ received: true }, 200, 'Webhook processed')
  } catch (error) {
    console.error('[WEBHOOK_ERROR]', error)
    return errorResponse(500, 'Webhook processing failed')
  }
}

/**
 * Handle payment.authorized event
 * Payment has been authorized but not yet captured
 */
async function handlePaymentAuthorized(payment: any) {
  try {
    console.log('[PAYMENT_AUTHORIZED]', payment.id)
    
    // Find transaction by order ID
    const transaction = await db.transaction.findUnique({
      where: { razorpayOrderId: payment.order_id },
    })

    if (transaction) {
      // Update transaction with payment details
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          razorpayPaymentId: payment.id,
          metadata: {
            status: 'authorized',
            amount: payment.amount,
            method: payment.method,
          },
        },
      })
    }
  } catch (error) {
    console.error('[HANDLE_PAYMENT_AUTHORIZED_ERROR]', error)
  }
}

/**
 * Handle payment.captured event
 * Payment has been successfully captured
 */
async function handlePaymentCaptured(payment: any) {
  try {
    console.log('[PAYMENT_CAPTURED]', payment.id)
    
    // Find transaction by order ID
    const transaction = await db.transaction.findUnique({
      where: { razorpayOrderId: payment.order_id },
    })

    if (transaction && transaction.status !== 'SUCCESS') {
      // Update transaction to SUCCESS
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: payment.id,
          metadata: {
            status: 'captured',
            amount: payment.amount,
            method: payment.method,
            capturedAt: new Date().toISOString(),
          },
        },
      })

      console.log('[PAYMENT_CAPTURED_PROCESSED]', {
        transactionId: transaction.id,
        amount: transaction.amount,
      })
    }
  } catch (error) {
    console.error('[HANDLE_PAYMENT_CAPTURED_ERROR]', error)
  }
}

/**
 * Handle payment.failed event
 * Payment has failed
 */
async function handlePaymentFailed(payment: any) {
  try {
    console.log('[PAYMENT_FAILED]', payment.id)
    
    // Find transaction
    const transaction = await db.transaction.findUnique({
      where: { razorpayOrderId: payment.order_id },
    })

    if (transaction && transaction.status !== 'FAILED') {
      // Update transaction to FAILED
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          razorpayPaymentId: payment.id,
          metadata: {
            failureReason: payment.description || payment.error_reason,
            failedAt: new Date().toISOString(),
          },
        },
      })

      console.log('[PAYMENT_FAILED_PROCESSED]', {
        transactionId: transaction.id,
        reason: payment.description,
      })
    }
  } catch (error) {
    console.error('[HANDLE_PAYMENT_FAILED_ERROR]', error)
  }
}

/**
 * Handle refund.created event
 * A refund has been initiated
 */
async function handleRefundCreated(refund: any) {
  try {
    console.log('[REFUND_CREATED]', refund.id)
    
    // Find transaction by payment ID
    const transaction = await db.transaction.findUnique({
      where: { razorpayPaymentId: refund.payment_id },
    })

    if (transaction) {
      // Create refund transaction
      await db.transaction.create({
        data: {
          userId: transaction.userId,
          type: 'REFUND',
          amount: refund.amount / 100, // Convert from paise to INR
          status: refund.status === 'processed' ? 'SUCCESS' : 'PENDING',
          description: `Refund for order ${transaction.razorpayOrderId}`,
          razorpayRefundId: refund.id,
          razorpayOrderId: transaction.razorpayOrderId,
          senderId: transaction.receiverId,
          receiverId: transaction.senderId,
          metadata: {
            originalTransactionId: transaction.id,
            refundStatus: refund.status,
          },
        },
      }).catch(err => {
        console.error('[CREATE_REFUND_TRANSACTION_ERROR]', err)
      })

      console.log('[REFUND_PROCESSED]', {
        refundId: refund.id,
        paymentId: refund.payment_id,
      })
    }
  } catch (error) {
    console.error('[HANDLE_REFUND_ERROR]', error)
  }
}

/**
 * Handle order.paid event
 * Order has been paid
 */
async function handleOrderPaid(order: any) {
  try {
    console.log('[ORDER_PAID]', order.id)
    
    // This is a high-level event indicating order is fully paid
    // Most logic is already handled by payment.captured
  } catch (error) {
    console.error('[HANDLE_ORDER_PAID_ERROR]', error)
  }
}
