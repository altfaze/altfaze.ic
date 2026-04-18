import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as offerService from '@/lib/services/offerService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/offers
 * Get user's offers (sent or received)
 */
export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'offers-get'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const searchParams = req.nextUrl.searchParams
    const type = (searchParams.get('type') || 'all') as 'sent' | 'received' | 'all'

    const result = await offerService.getUserOffers(userId, type)

    return successResponse(result.offers, 200, 'Offers retrieved')
  } catch (error) {
    console.error('[OFFERS_GET]', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/offers
 * Create a new offer (freelancer → client)
 */
export async function POST(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'offers-create'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json()

    const { receiverId, title, description, amount, deadline } = body

    if (!receiverId || !title || !amount) {
      return errorResponse(400, 'Missing required fields')
    }

    const result = await offerService.createOffer({
      senderId: userId,
      receiverId,
      title,
      description,
      amount,
      deadline: deadline ? new Date(deadline) : undefined,
    })

    return successResponse(result.offer, 201, 'Offer sent successfully')
  } catch (error) {
    console.error('[OFFERS_CREATE]', error)
    return handleApiError(error)
  }
}
