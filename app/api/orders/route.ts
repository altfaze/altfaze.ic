import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as orderService from '@/lib/services/orderService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/orders
 * Fetch user's orders (sent or received)
 */
export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'orders-get'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const searchParams = req.nextUrl.searchParams
    const type = (searchParams.get('type') || 'all') as 'sent' | 'received' | 'all'

    const result = await orderService.getUserOrders(userId, type)

    return successResponse(result, 200, 'Orders fetched')
  } catch (error) {
    console.error('[ORDERS_GET]', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'orders-create'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json()
    
    const { receiverId, title, description, amount, deadline } = body

    if (!receiverId || !title || !amount) {
      return errorResponse(400, 'Missing required fields')
    }

    const result = await orderService.createOrder({
      senderId: userId,
      receiverId,
      title,
      description,
      amount,
      deadline: deadline ? new Date(deadline) : undefined,
    })

    return successResponse(result.order, 201, 'Order created successfully')
  } catch (error) {
    console.error('[ORDERS_CREATE]', error)
    return handleApiError(error)
  }
}
