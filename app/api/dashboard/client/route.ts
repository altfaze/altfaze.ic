import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/client
 * Get complete client dashboard data
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'CLIENT')

    // Get user wallet
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        walletBalance: true,
        totalSpent: true,
      },
    })

    // Get all projects
    const [openProjects, inProgressProjects, completedProjects] = await Promise.all([
      db.project.count({ where: { creatorId: userId, status: 'OPEN' } }),
      db.project.count({ where: { creatorId: userId, status: 'IN_PROGRESS' } }),
      db.project.count({ where: { creatorId: userId, status: 'COMPLETED' } }),
    ])

    // Get recent projects
    const recentProjects = await db.project.findMany({
      where: { creatorId: userId },
      select: {
        id: true,
        title: true,
        budget: true,
        status: true,
        category: true,
        createdAt: true,
        submitter: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get pending requests (bids)
    const pendingRequests = await db.request.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      select: {
        id: true,
        title: true,
        amount: true,
        description: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            freelancer: { select: { rating: true, reviewCount: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get transaction summary
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        type: true,
        amount: true,
        status: true,
        description: true,
        createdAt: true,
      },
    })

    return successResponse(
      {
        user: {
          name: user?.name,
          email: user?.email,
          image: user?.image,
          walletBalance: user?.walletBalance.toNumber() || 0,
          totalSpent: user?.totalSpent.toNumber() || 0,
        },
        projects: {
          open: openProjects,
          inProgress: inProgressProjects,
          completed: completedProjects,
          recent: recentProjects.map(p => ({
            ...p,
            budget: p.budget?.toNumber() || 0,
          })),
        },
        requests: {
          pending: pendingRequests.length,
          list: pendingRequests.map(r => ({
            ...r,
            amount: r.amount?.toNumber() || 0,
          })),
        },
        transactions: transactions.map(t => ({
          ...t,
          amount: t.amount.toNumber(),
        })),
      },
      200,
      'Dashboard data retrieved'
    )
  } catch (error) {
    console.error('[CLIENT_DASHBOARD_ERROR]', error)
    return handleApiError(error)
  }
}
