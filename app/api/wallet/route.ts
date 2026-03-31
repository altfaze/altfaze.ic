import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, ValidationError } from '@/lib/api'
import { getUserActivityLogs } from '@/lib/activity'

/**
 * GET /api/wallet
 * Get user wallet details, balance, and transaction history
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Get user wallet data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        walletBalance: true,
        totalSpent: true,
        totalEarned: true,
        image: true,
      },
    })

    if (!user) {
      throw new ValidationError('User not found')
    }

    // Get transactions (payments and earnings)
    const transactions = await db.transaction.findMany({
      where: {
        OR: [{ userId }, { senderId: userId }, { receiverId: userId }],
      },
      select: {
        id: true,
        type: true,
        amount: true,
        netAmount: true,
        commission: true,
        status: true,
        description: true,
        createdAt: true,
        senderId: true,
        receiverId: true,
        projectId: true,
        templateId: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const transactionsTotal = await db.transaction.count({
      where: {
        OR: [{ userId }, { senderId: userId }, { receiverId: userId }],
      },
    })

    // Get recent activity
    const activities = await getUserActivityLogs(userId, 10, 0)

    return successResponse(
      {
        wallet: {
          userId: user.id,
          balance: user.walletBalance?.toNumber() || 0,
          totalSpent: user.totalSpent?.toNumber() || 0,
          totalEarned: user.totalEarned?.toNumber() || 0,
        },
        transactions: transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount?.toNumber() || 0,
          netAmount: t.netAmount?.toNumber() || null,
          commission: t.commission?.toNumber() || null,
          status: t.status,
          description: t.description,
          createdAt: t.createdAt,
          senderId: t.senderId,
          receiverId: t.receiverId,
          projectId: t.projectId,
          templateId: t.templateId,
        })),
        pagination: {
          page,
          limit,
          total: transactionsTotal,
          hasMore: offset + limit < transactionsTotal,
        },
        recentActivity: activities,
      },
      200,
      'Wallet retrieved'
    )
  } catch (error) {
    console.error('Get wallet error:', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/wallet/add-balance
 * Add funds to wallet (admin operation - in production, use Stripe)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { amount, description } = body

    if (!amount || amount <= 0) {
      throw new ValidationError('Invalid amount')
    }

    const user = await db.$transaction(async (tx) => {
      // Update wallet balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: amount },
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: 'EARNING',
          amount,
          status: 'COMPLETED',
          description: description || 'Wallet top-up',
        },
      })

      return updatedUser
    })

    return successResponse(
      {
        balance: user.walletBalance?.toNumber() || 0,
      },
      200,
      'Wallet balance updated'
    )
  } catch (error) {
    console.error('Add wallet balance error:', error)
    return handleApiError(error)
  }
}
