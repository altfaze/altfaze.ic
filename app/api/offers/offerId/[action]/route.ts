import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as offerService from '@/lib/services/offerService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/offers/[offerId]/accept
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { offerId: string; action: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'offer-action'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const { action } = params

    if (action === 'accept') {
      const result = await offerService.acceptOffer(params.offerId, userId)
      return successResponse(result, 200, 'Offer accepted')
    }

    if (action === 'reject') {
      const result = await offerService.rejectOffer(params.offerId, userId)
      return successResponse(result.offer, 200, 'Offer rejected')
    }

    return errorResponse(400, 'Invalid action')
  } catch (error) {
    console.error('[OFFER_ACTION]', error)
    return handleApiError(error)
  }
}
