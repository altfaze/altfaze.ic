import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/clients/me/profile
 * Get current client's profile
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { client: true },
    })

    if (!user || user.role !== 'CLIENT') {
      return errorResponse(403, 'Not a client')
    }

    if (!user.client) {
      return errorResponse(404, 'Client profile not found')
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
        client: user.client,
      },
      200,
      'Profile retrieved'
    )
  } catch (error) {
    console.error('[GET_CLIENT_PROFILE_ERROR]', error)
    return errorResponse(500, 'Failed to fetch profile')
  }
}

/**
 * PUT /api/clients/me/profile
 * Update client profile
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await req.json()
    const { name, image, company, description } = body

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user || user.role !== 'CLIENT') {
      return errorResponse(403, 'Not a client')
    }

    // Update user data
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      include: { client: true },
    })

    // Update client profile
    const updatedClient = await db.client.update({
      where: { userId: user.id },
      data: {
        ...(company && { company }),
        ...(description && { description }),
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'PROFILE_UPDATED',
        description: 'Client profile updated',
      },
    }).catch(err => console.error('[PROFILE_UPDATE_LOG_ERROR]', err))

    return successResponse(
      {
        user: updatedUser,
        client: updatedClient,
      },
      200,
      'Profile updated successfully'
    )
  } catch (error) {
    console.error('[UPDATE_CLIENT_PROFILE_ERROR]', error)
    return errorResponse(500, 'Failed to update profile', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
