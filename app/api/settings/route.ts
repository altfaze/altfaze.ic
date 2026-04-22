import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

interface SettingsPayload {
  emailNotifications?: boolean
  smsNotifications?: boolean
  projectNotifications?: boolean
  messageNotifications?: boolean
  visibility?: 'public' | 'private'
  autoAcceptOffers?: boolean
  hourlyRate?: number
  bio?: string
  preferredCategories?: string[]
  isAvailable?: boolean
}

export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'settings_get'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests')
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      select: {
        id: true,
        role: true,
        freelancer: {
          select: {
            bio: true,
            hourlyRate: true,
            preferredCategories: true,
            isAvailable: true,
            status: true,
          },
        },
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Default settings
    const settings = {
      emailNotifications: true,
      smsNotifications: false,
      projectNotifications: true,
      messageNotifications: true,
      visibility: 'public' as const,
      autoAcceptOffers: false,
      hourlyRate: user.freelancer?.hourlyRate?.toNumber() || 0,
      bio: user.freelancer?.bio || '',
      preferredCategories: user.freelancer?.preferredCategories || [],
      isAvailable: user.freelancer?.isAvailable || false,
      status: user.freelancer?.status || 'OFFLINE',
    }

    return successResponse({ settings }, 200, 'Settings retrieved')
  } catch (error: any) {
    console.error('[SETTINGS_GET_ERROR]', error)
    return errorResponse(500, 'Failed to fetch settings')
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'settings_put'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests')
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const body: SettingsPayload = await req.json()

    const user = await db.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      include: { freelancer: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    if (!user.freelancer) {
      return errorResponse(400, 'User is not a freelancer')
    }

    // Update freelancer settings
    const updatedFreelancer = await db.freelancer.update({
      where: { userId: user.id },
      data: {
        ...(body.hourlyRate !== undefined && { hourlyRate: body.hourlyRate }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.preferredCategories !== undefined && { preferredCategories: body.preferredCategories }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.isAvailable !== undefined && {
          status: body.isAvailable ? 'ONLINE' : 'OFFLINE',
        }),
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'SETTINGS_UPDATED',
        description: 'Freelancer settings updated',
        metadata: JSON.parse(JSON.stringify(body)),
      },
    }).catch(err => console.error('[ACTIVITY_LOG]', err))

    return successResponse(
      {
        settings: {
          emailNotifications: body.emailNotifications ?? true,
          smsNotifications: body.smsNotifications ?? false,
          projectNotifications: body.projectNotifications ?? true,
          messageNotifications: body.messageNotifications ?? true,
          visibility: body.visibility ?? 'public',
          autoAcceptOffers: body.autoAcceptOffers ?? false,
          hourlyRate: updatedFreelancer.hourlyRate?.toNumber() || 0,
          bio: updatedFreelancer.bio || '',
          preferredCategories: updatedFreelancer.preferredCategories || [],
          isAvailable: updatedFreelancer.isAvailable,
          status: updatedFreelancer.status,
        },
      },
      200,
      'Settings updated successfully'
    )
  } catch (error: any) {
    console.error('[SETTINGS_PUT_ERROR]', error)
    return errorResponse(500, 'Failed to update settings')
  }
}
