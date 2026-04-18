import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    // Verify admin access
    await requireAuthWithRole(req, 'ADMIN')

    // Get all statistics in parallel
    const [
      totalUsersResult,
      totalAdminsResult,
      totalClientsResult,
      totalFreelancersResult,
      totalProjectsResult,
      totalTransactionsResult,
      suspendedUsersResult,
      totalEarningsResult,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: 'ADMIN' } }),
      db.user.count({ where: { role: 'CLIENT' } }),
      db.user.count({ where: { role: 'FREELANCER' } }),
      db.project.count(),
      db.transaction.count(),
      db.user.count({ where: { isSuspended: true } }),
      db.transaction.aggregate({
        _sum: { amount: true },
      }),
    ])

    const stats = {
      totalUsers: totalUsersResult,
      totalAdmins: totalAdminsResult,
      totalClients: totalClientsResult,
      totalFreelancers: totalFreelancersResult,
      totalProjects: totalProjectsResult,
      totalTransactions: totalTransactionsResult,
      suspendedUsers: suspendedUsersResult,
      totalEarnings: totalEarningsResult._sum.amount?.toNumber() || 0,
    }

    return successResponse(stats, 200, 'Dashboard statistics retrieved')
  } catch (error) {
    console.error('[ADMIN_STATS]', error)
    return errorResponse(500, 'Failed to fetch dashboard statistics', error)
  }
}
