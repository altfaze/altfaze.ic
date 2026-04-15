import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { emitRequestAccepted } from '@/lib/realtime'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/projects/[id]/close
 * Client closes/accepts project - marks as IN_PROGRESS with freelancer
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'CLIENT')
    const projectId = params.id
    const body = await req.json()
    const { requestId } = body

    // Validate request exists and belongs to project
    const request = await db.request.findUnique({
      where: { id: requestId },
      include: { receiver: true, sender: true },
    })

    if (!request) {
      return errorResponse(404, 'Request not found')
    }

    if (request.projectId !== projectId) {
      return errorResponse(400, 'Request does not belong to this project')
    }

    if (request.receiverId !== userId) {
      return errorResponse(403, 'You can only accept requests for your projects')
    }

    if (request.status !== 'PENDING') {
      return errorResponse(400, `Cannot accept ${request.status} requests`)
    }

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    if (project.status !== 'OPEN') {
      return errorResponse(400, 'Project is no longer open')
    }

    // Update request status
    const updatedRequest = await db.request.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    })

    // Update project status and assign freelancer
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        status: 'IN_PROGRESS',
        submiterId: request.senderId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        submitter: { select: { id: true, name: true, email: true } },
      },
    })

    // Reject all other pending requests for this project
    await db.request.updateMany({
      where: {
        projectId,
        id: { not: requestId },
        status: 'PENDING',
      },
      data: { status: 'REJECTED' },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'REQUEST_ACCEPTED',
        description: `Accepted proposal from ${request.sender.name} for $${request.amount || 0}`,
        metadata: { projectId, requestId, freelancerId: request.senderId },
      },
    }).catch(() => {})

    // Emit event
    await emitRequestAccepted(requestId, userId, updatedRequest)

    return successResponse(
      {
        request: updatedRequest,
        project: {
          id: updatedProject.id,
          title: updatedProject.title,
          status: updatedProject.status,
          budget: updatedProject.budget?.toNumber() || 0,
          submitter: updatedProject.submitter,
        },
      },
      200,
      'Request accepted and project started'
    )
  } catch (error) {
    console.error('[ACCEPT_REQUEST_ERROR]', error)
    return handleApiError(error)
  }
}
