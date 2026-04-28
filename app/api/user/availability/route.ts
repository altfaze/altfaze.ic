import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/user/availability
 * Toggle freelancer availability status
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req, 'FREELANCER')

    const body = await req.json()
    const { isAvailable } = body

    if (typeof isAvailable !== 'boolean') {
      return errorResponse(400, 'isAvailable must be a boolean')
    }

    // Update freelancer availability
    const freelancer = await db.freelancer.update({
      where: { userId },
      data: {
        isAvailable,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return successResponse(
      {
        freelancer: {
          ...freelancer,
          isAvailable: freelancer.isAvailable,
        },
      },
      200
    )
  } catch (error) {
    console.error('[AVAILABILITY_UPDATE_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * GET /api/user/availability
 * Get current availability status
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req, 'FREELANCER')

    const freelancer = await db.freelancer.findUnique({
      where: { userId },
      select: {
        isAvailable: true,
        status: true,
      },
    })

    if (!freelancer) {
      return errorResponse(404, 'Freelancer profile not found')
    }

    return successResponse(
      {
        isAvailable: freelancer.isAvailable,
        status: freelancer.status,
      },
      200
    )
  } catch (error) {
    console.error('[AVAILABILITY_GET_ERROR]', error)
    return handleApiError(error)
  }
}
