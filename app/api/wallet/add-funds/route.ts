import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, isValidAmount } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { calculateNetAmount, calculateCommission } from '@/lib/commission'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/wallet/add-funds
 * Add funds to wallet
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { amount, stripeSessionId } = body

    // Validate amount
    if (!isValidAmount(amount, 1, 999999999)) {
      return errorResponse(400, 'Invalid amount. Minimum $1, Maximum $999,999,999')
    }

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        userId,
        type: 'PAYMENT',
        amount,
        status: 'COMPLETED',
        description: `Added $${amount} to wallet`,
        metadata: {
          stripeSessionId,
          source: 'wallet_topup',
          completedAt: new Date().toISOString(),
        },
      },
    })

    // Update wallet balance
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        walletBalance: {
          increment: amount,
        },
        totalSpent: {
          increment: amount,
        },
      },
      select: {
        id: true,
        walletBalance: true,
        totalSpent: true,
        totalEarned: true,
      },
    })

    // Log activity (non-blocking - errors logged but don't affect transaction)
    try {
      await db.activityLog.create({
        data: {
          userId,
          action: 'WALLET_UPDATED',
          description: `Added $${amount} to wallet`,
          metadata: { transactionId: transaction.id, amount },
        },
      })
    } catch (logError) {
      console.error('[WALLET_ADD_FUNDS] Activity log creation failed:', logError)
      // Continue - activity log failure shouldn't block transaction
    }

    return successResponse(
      {
        transaction: {
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount.toNumber(),
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
        wallet: {
          balance: updatedUser.walletBalance.toNumber(),
          totalSpent: updatedUser.totalSpent.toNumber(),
          totalEarned: updatedUser.totalEarned.toNumber(),
        },
      },
      201,
      'Funds added successfully'
    )
  } catch (error) {
    console.error('[ADD_FUNDS_ERROR]', error)
    return handleApiError(error)
  }
}
