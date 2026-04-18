import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

/**
 * GET /api/users/me/profile
 * Get current user's profile information
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        freelancer: true,
        client: true,
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      isVerified: user.isVerified,
      username: user.username,
      freelancer: user.freelancer,
      client: user.client,
    })
  } catch (error) {
    console.error('[USER_PROFILE_GET_ERROR]', error)
    return errorResponse(500, 'Failed to fetch profile')
  }
}

/**
 * PATCH /api/users/me/profile
 * Update user profile information
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const formData = await req.formData()
    const name = formData.get('name') as string | null
    const username = formData.get('username') as string | null
    const image = formData.get('image') as File | null
    const freelancerStr = formData.get('freelancer') as string | null
    const clientStr = formData.get('client') as string | null

    // Find user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        freelancer: true,
        client: true,
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Process image upload if provided
    let imageUrl = user.image
    if (image) {
      // For now, store as base64 or use a file service
      // In production, use Cloudinary, S3, or similar
      const buffer = await image.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      imageUrl = `data:${image.type};base64,${base64}`
    }

    // Update user basic info
    await db.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(imageUrl && { image: imageUrl }),
      },
    })

    // Update freelancer profile if role is FREELANCER
    if (user.role === 'FREELANCER' && freelancerStr) {
      const freelancerData = JSON.parse(freelancerStr)
      if (user.freelancer) {
        await db.freelancer.update({
          where: { userId: user.id },
          data: {
            title: freelancerData.title || null,
            bio: freelancerData.bio || null,
            skills: freelancerData.skills || [],
            portfolio: freelancerData.portfolio || null,
            hourlyRate: freelancerData.hourlyRate || null,
          },
        })
      } else {
        await db.freelancer.create({
          data: {
            userId: user.id,
            title: freelancerData.title || null,
            bio: freelancerData.bio || null,
            skills: freelancerData.skills || [],
            portfolio: freelancerData.portfolio || null,
            hourlyRate: freelancerData.hourlyRate || null,
          },
        })
      }
    }

    // Update client profile if role is CLIENT
    if (user.role === 'CLIENT' && clientStr) {
      const clientData = JSON.parse(clientStr)
      if (user.client) {
        await db.client.update({
          where: { userId: user.id },
          data: {
            company: clientData.company || null,
            description: clientData.description || null,
          },
        })
      } else {
        await db.client.create({
          data: {
            userId: user.id,
            company: clientData.company || null,
            description: clientData.description || null,
          },
        })
      }
    }

    // Fetch updated user
    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        freelancer: true,
        client: true,
      },
    })

    return successResponse({
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      image: updatedUser!.image,
      role: updatedUser!.role,
      isVerified: updatedUser!.isVerified,
      username: updatedUser!.username,
      freelancer: updatedUser!.freelancer,
      client: updatedUser!.client,
    }, 200, 'Profile updated successfully')
  } catch (error: any) {
    console.error('[USER_PROFILE_PATCH_ERROR]', error)
    return errorResponse(500, error.message || 'Failed to update profile')
  }
}
