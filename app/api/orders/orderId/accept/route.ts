import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as orderService from '@/lib/services/orderService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/orders/[orderId]/accept
 * Freelancer accepts an order
 */
export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const isRateLimited = !(await rateLimit(req, 'order-action'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)

    // Service handles authorization check
    const result = await orderService.acceptOrder(params.orderId, userId)

    return successResponse(result.order, 200, 'Order accepted successfully')
  } catch (error: any) {
    console.error('[ORDER_ACCEPT_POST]', error)
    if (error.message?.includes('Unauthorized')) {
      return errorResponse(403, error.message)
    }
    if (error.message?.includes('not found')) {
      return errorResponse(404, error.message)
    }
    return handleApiError(error)
  }
}
