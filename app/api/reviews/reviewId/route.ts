import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as reviewService from '@/lib/services/reviewService'

export const dynamic = 'force-dynamic'

/**
 * DELETE /api/reviews/[reviewId]
 * Delete a review
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'review-delete'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)

    const result = await reviewService.deleteReview(params.reviewId, userId)

    return successResponse(null, 200, 'Review deleted')
  } catch (error) {
    console.error('[REVIEW_DELETE]', error)
    return handleApiError(error)
  }
}
