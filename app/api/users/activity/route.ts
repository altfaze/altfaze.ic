import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/users/activity
 * Get user activity log
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req)

    const searchParams = req.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const offset = (page - 1) * limit

    const [activities, total] = await Promise.all([
      db.activityLog.findMany({
        where: { userId },
        select: {
          id: true,
          action: true,
          description: true,
          resourceType: true,
          resourceId: true,
          createdAt: true,
          metadata: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.activityLog.count({ where: { userId } }),
    ])

    return successResponse(
      {
        activities: activities.map(a => ({
          id: a.id,
          action: a.action,
          description: a.description,
          resourceType: a.resourceType,
          resourceId: a.resourceId,
          createdAt: a.createdAt,
          metadata: a.metadata,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasMore: offset + limit < total,
        },
      },
      200,
      'Activity retrieved'
    )
  } catch (error) {
    console.error('[ACTIVITY_ERROR]', error)
    return handleApiError(error)
  }
}
