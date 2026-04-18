import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as reviewService from '@/lib/services/reviewService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/reviews?userId=...
 * Get reviews for a freelancer
 */
export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'reviews-get'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const statsOnly = searchParams.get('stats') === 'true'

    if (!userId) {
      return errorResponse(400, 'userId parameter required')
    }

    if (statsOnly) {
      const result = await reviewService.getReviewStats(userId)
      return successResponse(result.stats, 200)
    }

    const result = await reviewService.getUserReviews(userId)
    return successResponse(result.reviews, 200, 'Reviews retrieved')
  } catch (error) {
    console.error('[REVIEWS_GET]', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'reviews-create'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json()

    const { targetId, rating, comment, orderId } = body

    if (!targetId || !rating) {
      return errorResponse(400, 'Missing required fields')
    }

    const result = await reviewService.createReview({
      authorId: userId,
      targetId,
      rating: parseInt(rating),
      comment,
      orderId,
    })

    return successResponse(result.review, 201, 'Review created')
  } catch (error) {
    console.error('[REVIEWS_CREATE]', error)
    return handleApiError(error)
  }
}
