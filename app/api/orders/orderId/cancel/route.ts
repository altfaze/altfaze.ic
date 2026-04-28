import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as orderService from '@/lib/services/orderService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/orders/[orderId]/cancel
 * Client cancels an order (only if not yet accepted or completed)
 */
export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const isRateLimited = !(await rateLimit(req, 'order-action'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json().catch(() => ({}))
    const reason = body.reason || 'User cancelled'

    // Service handles authorization check
    const result = await orderService.cancelOrder(params.orderId, userId, reason)

    return successResponse(result.order, 200, 'Order cancelled successfully')
  } catch (error: any) {
    console.error('[ORDER_CANCEL_POST]', error)
    if (error.message?.includes('Unauthorized')) {
      return errorResponse(403, error.message)
    }
    if (error.message?.includes('not found')) {
      return errorResponse(404, error.message)
    }
    return handleApiError(error)
  }
}
