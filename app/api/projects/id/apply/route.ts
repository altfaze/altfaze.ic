import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { emitRequestSent } from '@/lib/realtime'
import { toSafeNumber } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/projects/[id]/apply
 * Freelancer applies to project (creates request/bid)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'FREELANCER')
    const projectId = params.id
    const body = await req.json()
    const { amount, message } = body

    // Validate project exists and is OPEN
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { creator: true },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    if (project.status !== 'OPEN') {
      return errorResponse(400, `Cannot apply to ${project.status} projects`)
    }

    if (project.creatorId === userId) {
      return errorResponse(400, 'Cannot apply to your own project')
    }

    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      return errorResponse(400, 'Offer amount must be greater than 0')
    }

    // Check for duplicate application
    const existingRequest = await db.request.findFirst({
      where: {
        projectId,
        senderId: userId,
      },
    })

    if (existingRequest) {
      return errorResponse(409, 'You have already applied to this project')
    }

    // Get freelancer info
    const freelancer = await db.user.findUnique({
      where: { id: userId },
      include: { freelancer: true },
    })

    // Create request (bid)
    const newRequest = await db.request.create({
      data: {
        title: `Proposal for: ${project.title}`,
        description: message || '',
        senderId: userId,
        receiverId: project.creatorId,
        projectId,
        amount: parseFloat(amount),
        dueDate: project.deadline,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            freelancer: { select: { hourlyRate: true, rating: true } },
          },
        },
        receiver: { select: { id: true, email: true, name: true } },
      },
    })

    // Log activity
    try {
      await db.activityLog.create({
        data: {
          userId,
          action: 'REQUEST_SENT',
          description: `Applied to project: "${project.title}" with $${amount} bid`,
          metadata: { projectId, requestId: newRequest.id },
        },
      })
    } catch (err) {
      console.error('[PROJECT_APPLY] Activity log creation failed:', err)
    }

    // Emit real-time event
    await emitRequestSent(newRequest.id, userId, project.creatorId, newRequest)

    return successResponse(
      {
        id: newRequest.id,
        title: newRequest.title,
        description: newRequest.description,
        amount: toSafeNumber(newRequest.amount),
        status: newRequest.status,
        sender: newRequest.sender,
        receiver: newRequest.receiver,
        createdAt: newRequest.createdAt,
      },
      201,
      'Application submitted successfully'
    )
  } catch (error) {
    console.error('[APPLY_PROJECT_ERROR]', error)
    return handleApiError(error)
  }
}
