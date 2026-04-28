import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * PUT /api/notifications/[notificationId]/read
 * Mark notification as read
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'notification-action'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)

    const notification = await db.notification.findUnique({
      where: { id: params.notificationId },
    })

    if (!notification) {
      return errorResponse(404, 'Notification not found')
    }

    if (notification.userId !== userId) {
      return errorResponse(403, 'Unauthorized')
    }

    const updated = await db.notification.update({
      where: { id: params.notificationId },
      data: { read: true },
    })

    return successResponse(updated, 200, 'Notification marked as read')
  } catch (error) {
    console.error('[NOTIFICATION_MARK_READ]', error)
    return handleApiError(error)
  }
}

/**
 * DELETE /api/notifications/[notificationId]
 * Delete a notification
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'notification-delete'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)

    const notification = await db.notification.findUnique({
      where: { id: params.notificationId },
    })

    if (!notification) {
      return errorResponse(404, 'Notification not found')
    }

    if (notification.userId !== userId) {
      return errorResponse(403, 'Unauthorized')
    }

    await db.notification.delete({
      where: { id: params.notificationId },
    })

    return successResponse(null, 200, 'Notification deleted')
  } catch (error) {
    console.error('[NOTIFICATION_DELETE]', error)
    return handleApiError(error)
  }
}
