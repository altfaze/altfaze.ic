import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdateFreelancerSchema = z.object({
  title: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  status: z.enum(['OFFLINE', 'ONLINE', 'BUSY']).optional(),
  portfolio: z.string().url().optional(),
})

type UpdateFreelancerInput = z.infer<typeof UpdateFreelancerSchema>

/**
 * GET /api/freelancers/me
 * Get current freelancer's own profile (authenticated)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req, 'FREELANCER')

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        freelancer: true,
      },
    })

    if (!user || !user.freelancer) {
      return errorResponse(404, 'Freelancer profile not found')
    }

    return successResponse(
      {
        freelancer: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          title: user.freelancer.title,
          bio: user.freelancer.bio,
          skills: user.freelancer.skills,
          portfolio: user.freelancer.portfolio,
          hourlyRate: user.freelancer.hourlyRate,
          rating: user.freelancer.rating,
          reviewCount: user.freelancer.reviewCount,
          isAvailable: user.freelancer.isAvailable,
          status: user.freelancer.status,
        },
      },
      200,
      'Freelancer profile retrieved successfully'
    )
  } catch (error) {
    console.error('[GET_FREELANCER_ME_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * PATCH /api/freelancers/me
 * Update current freelancer's profile (authenticated)
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req, 'FREELANCER')

    const body = await req.json()

    // Validate input
    const validated = UpdateFreelancerSchema.parse(body)

    // Get or create freelancer profile
    let freelancer = await db.freelancer.findUnique({
      where: { userId },
    })

    if (!freelancer) {
      // Create if doesn't exist
      freelancer = await db.freelancer.create({
        data: {
          userId,
          title: validated.title || '',
          bio: validated.bio || '',
          skills: validated.skills || [],
          hourlyRate: validated.hourlyRate || 0,
          isAvailable: validated.isAvailable ?? false,
          status: validated.status || 'OFFLINE',
          portfolio: validated.portfolio || '',
        },
      })
    } else {
      // Update existing
      freelancer = await db.freelancer.update({
        where: { userId },
        data: {
          ...(validated.title !== undefined && { title: validated.title }),
          ...(validated.bio !== undefined && { bio: validated.bio }),
          ...(validated.skills !== undefined && { skills: validated.skills }),
          ...(validated.hourlyRate !== undefined && { hourlyRate: validated.hourlyRate }),
          ...(validated.isAvailable !== undefined && { isAvailable: validated.isAvailable }),
          ...(validated.status !== undefined && { status: validated.status }),
          ...(validated.portfolio !== undefined && { portfolio: validated.portfolio }),
        },
      })
    }

    return successResponse(
      {
        freelancer: {
          id: freelancer.id,
          userId: freelancer.userId,
          title: freelancer.title,
          bio: freelancer.bio,
          skills: freelancer.skills,
          portfolio: freelancer.portfolio,
          hourlyRate: freelancer.hourlyRate,
          isAvailable: freelancer.isAvailable,
          status: freelancer.status,
        },
      },
      200,
      'Freelancer profile updated successfully'
    )
  } catch (error) {
    console.error('[PATCH_FREELANCER_ME_ERROR]', error)
    if (error instanceof z.ZodError) {
      return errorResponse(400, `Validation error: ${error.errors[0].message}`)
    }
    return handleApiError(error)
  }
}
