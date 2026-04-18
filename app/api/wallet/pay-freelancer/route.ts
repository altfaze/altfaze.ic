import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, isValidAmount } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/wallet/pay-freelancer
 * Transfer funds from client to freelancer (project payment)
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId: clientId } = await requireAuth(req)
    const body = await req.json()
    const { freelancerId, projectId, amount } = body

    // Validate amount
    if (!isValidAmount(amount, 0.5, 999999999)) {
      return errorResponse(400, 'Invalid amount')
    }

    // Get client wallet
    const client = await db.user.findUnique({
      where: { id: clientId },
      select: { walletBalance: true },
    })

    if (!client) {
      return errorResponse(404, 'Client not found')
    }

    const clientBalance = client.walletBalance.toNumber()
    if (clientBalance < amount) {
      return errorResponse(400, `Insufficient balance. Current: $${clientBalance}`)
    }

    // Get freelancer
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
      select: { id: true, email: true },
    })

    if (!freelancer) {
      return errorResponse(404, 'Freelancer not found')
    }

    // Verify project connection
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true, submiterId: true },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    if (project.creatorId !== clientId || project.submiterId !== freelancerId) {
      return errorResponse(403, 'Invalid project-user relationship')
    }

    // Create payment transaction
    const transaction = await db.transaction.create({
      data: {
        userId: clientId,
        senderId: clientId,
        receiverId: freelancerId,
        projectId,
        type: 'PAYMENT',
        amount,
        status: 'COMPLETED',
        description: `Payment to freelancer for project completion`,
      },
    })

    // Deduct from client
    await db.user.update({
      where: { id: clientId },
      data: {
        walletBalance: { decrement: amount },
        totalSpent: { increment: amount },
      },
    })

    // Add to freelancer
    await db.user.update({
      where: { id: freelancerId },
      data: {
        walletBalance: { increment: amount },
        totalEarned: { increment: amount },
      },
    })

    // Log activity (non-blocking - errors logged but don't affect transaction)
    Promise.all([
      db.activityLog.create({
        data: {
          userId: clientId,
          action: 'WALLET_UPDATED',
          description: `Paid $${amount} to freelancer`,
          metadata: { transactionId: transaction.id },
        },
      }).catch(err => console.error('[PAY_FREELANCER] Client activity log failed:', err)),
      db.activityLog.create({
        data: {
          userId: freelancerId,
          action: 'WALLET_UPDATED',
          description: `Received $${amount} payment`,
          metadata: { transactionId: transaction.id },
        },
      }).catch(err => console.error('[PAY_FREELANCER] Freelancer activity log failed:', err)),
    ])

    return successResponse(
      {
        transaction: {
          id: transaction.id,
          from: clientId,
          to: freelancerId,
          amount: transaction.amount.toNumber(),
          status: transaction.status,
        },
      },
      201,
      'Payment sent successfully'
    )
  } catch (error) {
    console.error('[PAYMENT_ERROR]', error)
    return handleApiError(error)
  }
}
