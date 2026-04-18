/**
 * Notifications API - Get and manage user notifications
 */

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/notifications
 * Get user's notifications with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'notifications'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const searchParams = req.nextUrl.searchParams
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const notificationType = searchParams.get('type')

    const notifications = await db.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
        ...(notificationType && { type: notificationType }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const unreadCount = await db.notification.count({
      where: { userId, read: false },
    })

    return successResponse(
      { notifications, unreadCount },
      200,
      'Notifications retrieved'
    )
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/notifications
 * [Internal only] Create a new notification
 */
export async function POST(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'notification-create'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const body = await req.json()
    const { userId, type, title, message, relatedResourceType, relatedResourceId } = body

    if (!userId || !type || !title || !message) {
      return errorResponse(400, 'Missing required fields')
    }

    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedResourceType,
        relatedResourceId,
      },
    })

    return successResponse(notification, 201, 'Notification created')
  } catch (error) {
    console.error('[NOTIFICATION_CREATE]', error)
    return handleApiError(error)
  }
}
