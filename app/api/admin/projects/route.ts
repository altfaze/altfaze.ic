import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    // Verify admin access
    await requireAuthWithRole(req, 'ADMIN')

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status && ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      where.status = status
    }

    // Get projects and total count
    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          status: true,
          category: true,
          creator: {
            select: { name: true, email: true },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.project.count({ where }),
    ])

    const formattedProjects = projects.map(p => ({
      ...p,
      budget: p.budget?.toNumber() || 0,
    }))

    return successResponse(
      {
        data: formattedProjects,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      200,
      'Projects retrieved'
    )
  } catch (error) {
    console.error('[ADMIN_PROJECTS_GET]', error)
    return errorResponse(500, 'Failed to fetch projects', error)
  }
}
