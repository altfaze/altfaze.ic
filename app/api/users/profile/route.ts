import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'

// Force dynamic rendering - always get fresh data from DB
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'user_profile_get'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        walletBalance: true,
        totalSpent: true,
        totalEarned: true,
        razorpayCustomerId: true,
        razorpayContactId: true,
        razorpayFundAccountId: true,
        freelancer: {
          select: {
            title: true,
            bio: true,
            hourlyRate: true,
            skills: true,
            rating: true,
          },
        },
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    return successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          walletBalance: user.walletBalance?.toNumber() || 0,
          totalSpent: user.totalSpent?.toNumber() || 0,
          totalEarned: user.totalEarned?.toNumber() || 0,
          razorpayCustomerId: user.razorpayCustomerId,
          razorpayContactId: user.razorpayContactId,
          razorpayFundAccountId: user.razorpayFundAccountId,
          freelancer: user.freelancer,
        },
      },
      200,
      'Profile retrieved successfully'
    )
  } catch (error: any) {
    console.error('[USER_PROFILE_GET_ERROR]', error)
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'user_profile_put'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { name, email, freelancer } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return errorResponse(400, 'Name is required')
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        freelancer: freelancer
          ? {
              update: {
                title: freelancer.title || '',
                bio: freelancer.bio || '',
                hourlyRate: freelancer.hourlyRate || 0,
                skills: freelancer.skills || [],
              },
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        walletBalance: true,
        razorpayCustomerId: true,
        razorpayContactId: true,
        razorpayFundAccountId: true,
        freelancer: {
          select: {
            title: true,
            bio: true,
            hourlyRate: true,
            skills: true,
            rating: true,
          },
        },
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATED',
        resourceType: 'USER',
        resourceId: userId,
        metadata: { updatedFields: Object.keys(body) },
      },
    }).catch((err: any) => console.error('[ACTIVITY_LOG_ERROR]', err))

    return successResponse(
      {
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          image: updated.image,
          role: updated.role,
          walletBalance: updated.walletBalance?.toNumber() || 0,
          razorpayCustomerId: updated.razorpayCustomerId,
          razorpayContactId: updated.razorpayContactId,
          razorpayFundAccountId: updated.razorpayFundAccountId,
          freelancer: updated.freelancer,
        },
      },
      200,
      'Profile updated successfully'
    )
  } catch (error: any) {
    console.error('[USER_PROFILE_PUT_ERROR]', error)
    return handleApiError(error)
  }
}
