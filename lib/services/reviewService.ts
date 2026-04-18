/**
 * Reviews Service - Handle ratings and reviews for freelancers
 */

import { db } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateReviewInput {
  authorId: string
  targetId: string
  rating: number
  comment?: string
  orderId?: string
}

/**
 * Create or update a review
 */
export async function createReview(input: CreateReviewInput) {
  const { authorId, targetId, rating, comment, orderId } = input

  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    if (authorId === targetId) {
      throw new Error('Cannot review yourself')
    }

    // Check if review already exists for this order
    if (orderId) {
      const existingReview = await db.review.findFirst({
        where: { orderId },
      })
      if (existingReview) {
        throw new Error('Review already exists for this order')
      }
    }

    const review = await db.review.create({
      data: {
        authorId,
        targetId,
        rating,
        comment,
        orderId,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    // Update target freelancer's rating
    await updateFreelancerRating(targetId)

    return { success: true, review }
  } catch (error: any) {
    console.error('[REVIEW_CREATE]', error.message)
    throw error
  }
}

/**
 * Get reviews for a user (as target)
 */
export async function getUserReviews(userId: string, limit = 10) {
  try {
    const reviews = await db.review.findMany({
      where: { targetId: userId },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return { success: true, reviews }
  } catch (error: any) {
    console.error('[GET_REVIEWS]', error.message)
    throw error
  }
}

/**
 * Get review statistics for a user
 */
export async function getReviewStats(userId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { targetId: userId },
    })

    if (reviews.length === 0) {
      return {
        success: true,
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      }
    }

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    const ratingBreakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }

    return {
      success: true,
      stats: {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingBreakdown,
      },
    }
  } catch (error: any) {
    console.error('[REVIEW_STATS]', error.message)
    throw error
  }
}

/**
 * Update freelancer rating based on reviews (helper)
 */
async function updateFreelancerRating(freelancerId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { targetId: freelancerId },
    })

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

    // Update user's freelancer profile
    await db.freelancer.update({
      where: { userId: freelancerId },
      data: {
        rating: new Decimal(Math.round(averageRating * 10) / 10),
        reviewCount: reviews.length,
      },
    })
  } catch (error: any) {
    console.error('[UPDATE_RATING]', error.message)
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string, userId: string) {
  try {
    const review = await db.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      throw new Error('Review not found')
    }

    if (review.authorId !== userId) {
      throw new Error('Unauthorized')
    }

    await db.review.delete({
      where: { id: reviewId },
    })

    // Update freelancer rating
    await updateFreelancerRating(review.targetId)

    return { success: true }
  } catch (error: any) {
    console.error('[REVIEW_DELETE]', error.message)
    throw error
  }
}
