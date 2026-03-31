import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, ValidationError } from '@/lib/api'
import { createCheckoutSession } from '@/lib/stripe'
import { logPaymentCompletion } from '@/lib/activity'
import { validateAmount } from '@/lib/commission'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const body = await req.json()
    const { freelancerId, amount, projectId, templateId, description } = body

    // Validation
    if (!freelancerId) throw new ValidationError('freelancerId is required')
    if (!amount) throw new ValidationError('amount is required')

    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) {
      throw new ValidationError(amountValidation.error || 'Invalid amount')
    }

    // Verify freelancer exists
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
    })
    if (!freelancer) {
      throw new ValidationError('Freelancer not found')
    }

    // Verify client has sufficient balance or is a new client
    const client = await db.user.findUnique({
      where: { id: userId },
    })
    if (!client) {
      throw new ValidationError('Client not found')
    }

    // Create Stripe checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCheckoutSession({
      clientId: userId,
      freelancerId: freelancerId,
      amount: parseFloat(amount),
      projectId,
      templateId,
      description,
      successUrl: `${appUrl}/payment-success?sessionId={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/payment-cancelled`,
    })

    // Create pending transaction record
    await db.transaction.create({
      data: {
        userId: userId,
        type: 'PAYMENT',
        amount: parseFloat(amount),
        status: 'PENDING',
        stripeSessionId: session.id,
        description: description || 'Payment for project/template',
        senderId: userId,
        receiverId: freelancerId,
        projectId: projectId || null,
        templateId: templateId || null,
        metadata: {
          checkoutSessionId: session.id,
          freelancerId,
        },
      },
    })

    return successResponse(
      {
        sessionId: session.id,
        url: session.url,
        amount,
        description,
      },
      200,
      'Checkout session created'
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      throw new ValidationError('sessionId query parameter is required')
    }

    // Fetch transaction details
    const transaction = await db.transaction.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!transaction) {
      throw new ValidationError('Transaction not found')
    }

    if (transaction.userId !== userId) {
      throw new ValidationError('Unauthorized to view this transaction')
    }

    return successResponse(
      {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        netAmount: transaction.netAmount,
        commission: transaction.commission,
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
      200,
      'Transaction retrieved'
    )
  } catch (error) {
    console.error('Get checkout error:', error)
    return handleApiError(error)
  }
}
