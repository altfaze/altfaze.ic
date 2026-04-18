import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/freelancers/[id]
 * Get detailed public freelancer profile with projects and reviews
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const freelancerId = params.id

    if (!freelancerId || typeof freelancerId !== 'string') {
      return errorResponse(400, 'Valid freelancer ID is required')
    }

    // Get freelancer profile with full details
    const user = await db.user.findUnique({
      where: { id: freelancerId },
      include: {
        freelancer: {
          select: {
            id: true,
            title: true,
            bio: true,
            skills: true,
            portfolio: true,
            hourlyRate: true,
            rating: true,
            reviewCount: true,
          },
        },
      },
    })

    if (!user || user.role !== 'FREELANCER') {
      return errorResponse(404, 'Freelancer not found')
    }

    // Get recent templates/projects
    const templates = await db.template.findMany({
      where: { uploaderId: freelancerId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    })

    // Get reviews
    const reviews = await db.review.findMany({
      where: { targetId: freelancerId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    // Get project statistics
    const activeProjects = await db.request.count({
      where: {
        receiverId: freelancerId,
        status: 'ACCEPTED',
      },
    })

    const completedProjects = await db.request.count({
      where: {
        receiverId: freelancerId,
        status: 'COMPLETED',
      },
    })

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      title: user.freelancer?.title,
      bio: user.freelancer?.bio,
      skills: user.freelancer?.skills || [],
      portfolio: user.freelancer?.portfolio || [],
      hourlyRate: user.freelancer?.hourlyRate || 0,
      rating: user.freelancer?.rating || 0,
      reviewCount: user.freelancer?.reviewCount || 0,
      templates,
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: user.freelancer?.rating || 0,
        totalProjects: templates.length,
        activeProjects,
        completedProjects,
        joinedAt: user.createdAt,
      },
    }

    return successResponse(profile, 200, 'Freelancer profile retrieved successfully')
  } catch (error) {
    console.error('[GET_FREELANCER_ERROR]', error)
    return handleApiError(error)
  }
}
