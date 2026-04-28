import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { toSafeNumber } from '@/lib/utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/clients/[id]
 * Get detailed public client profile with projects and reviews
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

    const clientId = params.id

    if (!clientId || typeof clientId !== 'string') {
      return errorResponse(400, 'Valid client ID is required')
    }

    // Get client profile with full details
    const user = await db.user.findUnique({
      where: { id: clientId },
      include: {
        client: {
          select: {
            id: true,
            company: true,
            description: true,
          },
        },
      },
    })

    if (!user || user.role !== 'CLIENT') {
      return errorResponse(404, 'Client not found')
    }

    if (!user.client) {
      return errorResponse(404, 'Client profile not found')
    }

    // Get projects posted by client
    const projects = await db.project.findMany({
      where: { creatorId: clientId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        status: true,
        category: true,
        createdAt: true,
      },
    })

    // Get reviews about client (from freelancers who worked with them)
    const reviews = await db.review.findMany({
      where: { targetId: clientId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })

    // Get project statistics
    const openProjects = await db.project.count({
      where: {
        creatorId: clientId,
        status: 'OPEN',
      },
    })

    const completedProjects = await db.project.count({
      where: {
        creatorId: clientId,
        status: 'COMPLETED',
      },
    })

    // Get total spent
    const totalSpent = await db.transaction.aggregate({
      where: {
        userId: clientId,
        type: 'PAYMENT',
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    })

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      company: user.client?.company,
      description: user.client?.description,
      isVerified: user.isVerified,
      projects: projects.map(p => ({
        ...p,
        budget: toSafeNumber(p.budget),
      })),
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0,
        totalProjects: projects.length,
        openProjects,
        completedProjects,
        totalSpent: toSafeNumber(totalSpent._sum.amount),
        joinedAt: user.createdAt,
      },
    }

    return successResponse({ client: profile }, 200, 'Client profile retrieved successfully')
  } catch (error) {
    console.error('[GET_CLIENT_ERROR]', error)
    return handleApiError(error)
  }
}
