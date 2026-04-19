import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/clients
 * Get list of clients for freelancers to discover
 * Only shows clients who have posted projects
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    await requireAuth(req)

    const searchParams = req.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const offset = (page - 1) * limit
    const searchQuery = searchParams.get('search')?.trim()

    // Get clients who have posted projects, with their project count
    const clients = await db.user.findMany({
      where: {
        role: 'CLIENT',
        ...(searchQuery && {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { username: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }),
        projectsCreated: {
          some: {
            status: 'OPEN', // Only show clients with open projects
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            projectsCreated: {
              where: { status: 'OPEN' },
            },
            transactions: {
              where: { status: 'COMPLETED' },
            },
          },
        },
      },
      orderBy: {
        projectsCreated: {
          _count: 'desc',
        },
      },
      take: limit,
      skip: offset,
    })

    const total = await db.user.count({
      where: {
        role: 'CLIENT',
        ...(searchQuery && {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { username: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }),
        projectsCreated: {
          some: {
            status: 'OPEN',
          },
        },
      },
    })

    return successResponse(
      {
        clients: clients.map((client) => ({
          id: client.id,
          name: client.name,
          email: client.email,
          image: client.image,
          username: client.username,
          isVerified: client.isVerified,
          openProjectsCount: client._count.projectsCreated,
          completedTransactions: client._count.transactions,
          joinedAt: client.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasMore: offset + limit < total,
        },
      },
      200,
      'Clients retrieved successfully'
    )
  } catch (error: any) {
    console.error('[CLIENTS_GET_ERROR]', error)
    return handleApiError(error)
  }
}
