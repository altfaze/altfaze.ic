import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as orderService from '@/lib/services/orderService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/orders/[orderId]
 * Get order details
 */
export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const isRateLimited = !(await rateLimit(req, 'order-detail'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const order = await db.order.findUnique({
      where: { id: params.orderId },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } },
      },
    })

    if (!order) {
      return errorResponse(404, 'Order not found')
    }

    // Verify user is involved in this order
    if (order.senderId !== userId && order.receiverId !== userId) {
      return errorResponse(403, 'Unauthorized')
    }

    return successResponse(order, 200, 'Order details')
  } catch (error) {
    console.error('[ORDER_DETAIL_GET]', error)
    return handleApiError(error)
  }
}
