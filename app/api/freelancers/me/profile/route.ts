import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/freelancers/me/profile
 * Get current freelancer's profile
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { freelancer: true },
    })

    if (!user || user.role !== 'FREELANCER') {
      return errorResponse(403, 'Not a freelancer')
    }

    if (!user.freelancer) {
      return errorResponse(404, 'Freelancer profile not found')
    }

    return successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        },
        freelancer: user.freelancer,
      },
      200,
      'Profile retrieved'
    )
  } catch (error) {
    console.error('[GET_FREELANCER_PROFILE_ERROR]', error)
    return errorResponse(500, 'Failed to fetch profile')
  }
}

/**
 * PUT /api/freelancers/me/profile
 * Update freelancer profile
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await req.json()
    const {
      name,
      image,
      title,
      bio,
      skills,
      portfolio,
      hourlyRate,
    } = body

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user || user.role !== 'FREELANCER') {
      return errorResponse(403, 'Not a freelancer')
    }

    // Update user data
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      include: { freelancer: true },
    })

    // Update freelancer profile
    const updatedFreelancer = await db.freelancer.update({
      where: { userId: user.id },
      data: {
        ...(title && { title }),
        ...(bio && { bio }),
        ...(skills && { skills: Array.isArray(skills) ? skills : [skills] }),
        ...(portfolio && { portfolio }),
        ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) }),
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'PROFILE_UPDATED',
        description: 'Freelancer profile updated',
      },
    }).catch(err => console.error('[PROFILE_UPDATE_LOG_ERROR]', err))

    return successResponse(
      {
        user: updatedUser,
        freelancer: updatedFreelancer,
      },
      200,
      'Profile updated successfully'
    )
  } catch (error) {
    console.error('[UPDATE_FREELANCER_PROFILE_ERROR]', error)
    return errorResponse(500, 'Failed to update profile', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
