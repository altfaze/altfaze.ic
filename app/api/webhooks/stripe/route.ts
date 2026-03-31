import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { constructWebhookEvent, STRIPE_CONFIG } from '@/lib/stripe'
import { calculateCommission, calculateNetAmount } from '@/lib/commission'
import { logPaymentCompletion } from '@/lib/activity'

/**
 * Stripe Webhook Handler
 * Processes payment events from Stripe
 * Verifies webhook signature for security
 */
export async function POST(req: NextRequest) {
  // Get the raw body for signature verification
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: any

  try {
    // Verify webhook signature
    event = constructWebhookEvent(body, sig, STRIPE_CONFIG.webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object)
        break

      case 'charge.dispute.created':
        await handleChargeDisputed(event.data.object)
        break

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Return 200 to prevent Stripe from retrying
    // but log the error for investigation
    return NextResponse.json(
      { error: 'Webhook processing failed', received: true },
      { status: 200 }
    )
  }
}

/**
 * Handle successful checkout session
 * This is the main endpoint where payment completion is processed
 */
async function handleCheckoutSessionCompleted(session: any) {
  const sessionId = session.id
  const metadata = session.metadata || {}

  // Find the transaction record
  const transaction = await db.transaction.findUnique({
    where: { stripeSessionId: sessionId },
  })

  if (!transaction) {
    console.error(`Transaction not found for session: ${sessionId}`)
    return
  }

  // Skip if already processed
  if (transaction.status === 'COMPLETED') {
    console.log(`Transaction already completed: ${transaction.id}`)
    return
  }

  try {
    // Use Prisma transaction for atomic operations
    await db.$transaction(async (tx) => {
      const totalAmount = transaction.amount.toNumber()
      const commission = calculateCommission(totalAmount)
      const netAmount = calculateNetAmount(totalAmount)
      const clientId = transaction.senderId
      const freelancerId = transaction.receiverId

      if (!clientId || !freelancerId) {
        throw new Error('Invalid transaction: missing clientId or freelancerId')
      }

      // Update transaction as completed
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          commission: commission,
          netAmount: netAmount,
        },
      })

      // Update client wallet (decrease balance, increase totalSpent)
      await tx.user.update({
        where: { id: clientId },
        data: {
          walletBalance: {
            decrement: totalAmount,
          },
          totalSpent: {
            increment: totalAmount,
          },
        },
      })

      // Update freelancer wallet (increase balance, increase totalEarned)
      if (freelancerId) {
        await tx.user.update({
          where: { id: freelancerId },
          data: {
            walletBalance: {
              increment: netAmount,
            },
            totalEarned: {
              increment: netAmount,
            },
          },
        })
      }

      // Create earning transaction for freelancer
      if (freelancerId) {
        await tx.transaction.create({
          data: {
            userId: freelancerId,
            type: 'EARNING',
            amount: netAmount,
            commission: commission,
            description: `Earned from project/template (after 5% commission)`,
            status: 'COMPLETED',
            stripeTransactionId: session.payment_intent,
            senderId: clientId,
            receiverId: freelancerId,
            projectId: transaction.projectId,
            templateId: transaction.templateId,
            metadata: {
              parentTransactionId: transaction.id,
              commission,
              totalAmount,
            },
          },
        })
      }

      // Log activity
      await logPaymentCompletion(
        clientId,
        totalAmount,
        `Payment processed successfully`,
        transaction.id
      )

      if (freelancerId) {
        await logPaymentCompletion(
          freelancerId,
          netAmount,
          `Received payment (₹${commission} commission deducted)`,
          transaction.id
        )
      }
    })

    console.log(`Payment processed successfully: ${transaction.id}`)
  } catch (error) {
    console.error(`Error processing payment for session ${sessionId}:`, error)
    // Update transaction as failed
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'FAILED',
      },
    })
    throw error
  }
}

/**
 * Handle successful payment intent
 * Fallback if checkout session is not received
 */
async function handlePaymentSucceeded(paymentIntent: any) {
  console.log(`Payment intent succeeded: ${paymentIntent.id}`)
  // This can be used as a backup for payment confirmation
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: any) {
  const metadata = charge.metadata || {}

  // Find transaction with this Stripe ID
  const transaction = await db.transaction.findFirst({
    where: {
      stripeTransactionId: charge.id,
    },
  })

  if (!transaction) {
    console.error(`Refund: Transaction not found for charge: ${charge.id}`)
    return
  }

  try {
    await db.$transaction(async (tx) => {
      const totalAmount = transaction.amount.toNumber()
      const refundAmount = (charge.amount_refunded / 100).toFixed(2) // Convert from cents

      // Update transaction as refunded
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED', // Mark as failed since refunded
        },
      })

      // Reverse wallet updates
      if (transaction.senderId) {
        await tx.user.update({
          where: { id: transaction.senderId },
          data: {
            walletBalance: {
              increment: parseFloat(refundAmount),
            },
            totalSpent: {
              decrement: parseFloat(refundAmount),
            },
          },
        })
      }

      if (transaction.receiverId) {
        const netAmount = calculateNetAmount(parseFloat(refundAmount))
        await tx.user.update({
          where: { id: transaction.receiverId },
          data: {
            walletBalance: {
              decrement: netAmount,
            },
            totalEarned: {
              decrement: netAmount,
            },
          },
        })
      }

      console.log(`Refund processed: ${transaction.id}`)
    })
  } catch (error) {
    console.error(`Error processing refund for charge ${charge.id}:`, error)
  }
}

/**
 * Handle disputed charge
 */
async function handleChargeDisputed(charge: any) {
  console.log(`Charge disputed: ${charge.id}`)
  // TODO: Implement dispute handling logic
  // For now, just log the event
}
