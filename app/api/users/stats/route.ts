import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/users/stats
 * Get user statistics (projects, earnings, etc.)
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId, role } = await requireAuthWithRole(req)

    if (role === 'CLIENT') {
      // Client stats
      const [projectsCreated, projectsCompleted, totalSpent] = await Promise.all([
        db.project.count({ where: { creatorId: userId } }),
        db.project.count({ where: { creatorId: userId, status: 'COMPLETED' } }),
        db.user.findUnique({
          where: { id: userId },
          select: { totalSpent: true },
        }),
      ])

      const requests = await db.request.findMany({
        where: { receiverId: userId },
        select: { status: true },
      })

      return successResponse(
        {
          role: 'CLIENT',
          stats: {
            projectsCreated,
            projectsCompleted,
            totalSpent: totalSpent?.totalSpent.toNumber() || 0,
            requests: {
              pending: requests.filter(r => r.status === 'PENDING').length,
              accepted: requests.filter(r => r.status === 'ACCEPTED').length,
              rejected: requests.filter(r => r.status === 'REJECTED').length,
            },
          },
        },
        200,
        'Client stats retrieved'
      )
    } else {
      // Freelancer stats
      const [projectsCompleted, requests, totalEarned, avgRating] = await Promise.all([
        db.project.count({ where: { submiterId: userId, status: 'COMPLETED' } }),
        db.request.count({
          where: { senderId: userId, status: 'ACCEPTED' },
        }),
        db.user.findUnique({
          where: { id: userId },
          select: { totalEarned: true },
        }),
        db.freelancer.findUnique({
          where: { userId },
          select: { rating: true },
        }),
      ])

      const applications = await db.request.findMany({
        where: { senderId: userId },
        select: { status: true },
      })

      return successResponse(
        {
          role: 'FREELANCER',
          stats: {
            projectsCompleted,
            ongoingProjects: requests,
            totalEarned: totalEarned?.totalEarned.toNumber() || 0,
            avgRating: avgRating?.rating.toNumber() || 0,
            applications: {
              pending: applications.filter(a => a.status === 'PENDING').length,
              accepted: applications.filter(a => a.status === 'ACCEPTED').length,
              rejected: applications.filter(a => a.status === 'REJECTED').length,
            },
          },
        },
        200,
        'Freelancer stats retrieved'
      )
    }
  } catch (error) {
    console.error('[STATS_ERROR]', error)
    return handleApiError(error)
  }
}
