/**
 * Notifications API
 * Get user notifications
 */

import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    // For now, fetch unread activities/requests
    const [pendingRequests, recentActivity] = await Promise.all([
      db.request.findMany({
        where: {
          receiverId: userId,
          status: 'PENDING',
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          sender: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.activityLog.findMany({
        where: { userId },
        select: {
          id: true,
          action: true,
          description: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    return successResponse(
      {
        unread: pendingRequests.map(r => ({
          id: r.id,
          message: `New bid from ${r.sender.name}: ${r.title}`,
          type: 'info',
          createdAt: r.createdAt,
        })),
        recent: recentActivity.map(a => ({
          id: a.id,
          message: a.description,
          type: a.action.includes('ERROR') ? 'error' : 'info',
          createdAt: a.createdAt,
        })),
      },
      200,
      'Notifications retrieved'
    )
  } catch (error) {
    console.error('[NOTIFICATIONS_ERROR]', error)
    return handleApiError(error)
  }
}
