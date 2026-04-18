import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is not defined in production environment variables')
  }
  console.warn('⚠️ STRIPE_SECRET_KEY is not defined - Stripe operations will fail')
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-04-10',
    })
  : null

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: stripeSecretKey || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  isConfigured: !!stripeSecretKey,
}

/**
 * Create payment checkout session
 * Returns Stripe Session ID for redirect
 */
export async function createCheckoutSession(params: {
  clientId: string
  freelancerId: string
  amount: number
  projectId?: string
  templateId?: string
  description?: string
  successUrl: string
  cancelUrl: string
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: params.description || 'ALTFaze Project/Template Payment',
            description: `Payment from ${params.clientId} to ${params.freelancerId}`,
          },
          unit_amount: Math.round(params.amount * 100), // Amount in paise (cents)
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: '', // Will be set by caller if needed
    metadata: {
      clientId: params.clientId,
      freelancerId: params.freelancerId,
      projectId: params.projectId || '',
      templateId: params.templateId || '',
      amount: params.amount.toString(),
    },
  })

  return session
}

/**
 * Retrieve session details from Stripe
 */
export async function getSession(sessionId: string) {
  if (!stripe) throw new Error('Stripe is not configured')
  return await stripe.checkout.sessions.retrieve(sessionId)
}

/**
 * Get payment intent details
 */
export async function getPaymentIntent(intentId: string) {
  if (!stripe) throw new Error('Stripe is not configured')
  return await stripe.paymentIntents.retrieve(intentId)
}

/**
 * Refund a payment
 */
export async function refundPayment(chargeId: string, amount?: number) {
  if (!stripe) throw new Error('Stripe is not configured')
  return await stripe.refunds.create({
    charge: chargeId,
    amount: amount ? Math.round(amount * 100) : undefined,
  })
}

/**
 * Verify webhook signature
 * Always use raw body for signature verification
 */
export function verifyWebhookSignature(
  body: string | Buffer,
  signature: string,
  secret: string
): boolean {
  if (!stripe) return false
  try {
    stripe.webhooks.constructEvent(body, signature, secret)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Parse webhook event safely
 */
export function constructWebhookEvent(body: string | Buffer, signature: string, secret: string) {
  if (!stripe) throw new Error('Stripe is not configured')
  return stripe.webhooks.constructEvent(body, signature, secret)
}
