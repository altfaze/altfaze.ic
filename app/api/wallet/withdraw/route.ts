import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, isValidAmount } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/wallet/withdraw
 * Request withdrawal from wallet
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'FREELANCER')
    const body = await req.json()
    const { amount } = body

    // Validate amount
    if (!isValidAmount(amount, 10, 999999999)) {
      return errorResponse(400, 'Invalid amount. Minimum $10, Maximum $999,999,999')
    }

    // Get user wallet
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true, id: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    const balance = user.walletBalance.toNumber()
    if (balance < amount) {
      return errorResponse(400, `Insufficient balance. Current: $${balance}`)
    }

    // Create withdrawal request
    const transaction = await db.transaction.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        amount,
        status: 'PENDING', // Admin approval needed
        description: `Withdrawal request for $${amount}`,
      },
    })

    // Deduct from wallet immediately (held pending approval)
    await db.user.update({
      where: { id: userId },
      data: {
        walletBalance: {
          decrement: amount,
        },
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'WALLET_UPDATED',
        description: `Requested withdrawal of $${amount}`,
        metadata: { transactionId: transaction.id, amount },
      },
    }).catch(() => {})

    return successResponse(
      {
        transaction: {
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount.toNumber(),
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
        message: 'Withdrawal request submitted. Admin approval pending.',
      },
      201,
      'Withdrawal request created'
    )
  } catch (error) {
    console.error('[WITHDRAWAL_ERROR]', error)
    return handleApiError(error)
  }
}
