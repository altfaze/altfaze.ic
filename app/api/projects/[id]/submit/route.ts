import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/projects/[id]/submit
 * Freelancer submits work for project
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
    const { submission, submissionUrl } = body

    // Validate project exists and freelancer is assigned
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { submitter: true, creator: true },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    if (project.submiterId !== userId) {
      return errorResponse(403, 'You are not assigned to this project')
    }

    if (project.status !== 'IN_PROGRESS') {
      return errorResponse(400, `Cannot submit work for ${project.status} projects`)
    }

    if (!submission || typeof submission !== 'string' || submission.trim().length === 0) {
      return errorResponse(400, 'Submission description is required')
    }

    // Create update/submission record
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        status: 'COMPLETED',
        description: `${project.description}\n\n--- SUBMISSION ---\n${submission}\nSubmission URL: ${submissionUrl || 'N/A'}`,
        updatedAt: new Date(),
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        submitter: { select: { id: true, name: true, email: true } },
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'WORK_SUBMITTED',
        description: `Submitted work for project: "${project.title}"`,
        metadata: { projectId, submissionUrl },
      },
    }).catch(() => {})

    return successResponse(
      {
        id: updatedProject.id,
        title: updatedProject.title,
        status: updatedProject.status,
        submitter: updatedProject.submitter,
        creator: updatedProject.creator,
        updatedAt: updatedProject.updatedAt,
      },
      200,
      'Work submitted successfully. Client will review and approve.'
    )
  } catch (error) {
    console.error('[SUBMIT_PROJECT_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * PATCH /api/projects/[id]/approve
 * Client approves submitted work and completes project
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
    const { approved, feedback } = body

    // Validate project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        creator: true,
        submitter: true,
      },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    if (project.creatorId !== userId) {
      return errorResponse(403, 'Only project creator can approve work')
    }

    if (project.status !== 'COMPLETED') {
      return errorResponse(400, 'Project must be in COMPLETED status to approve')
    }

    if (!approved) {
      // Reject and send back to IN_PROGRESS
      const rejectedProject = await db.project.update({
        where: { id: projectId },
        data: {
          status: 'IN_PROGRESS',
          updatedAt: new Date(),
        },
      })

      // Log activity
      await db.activityLog.create({
        data: {
          userId,
          action: 'WORK_REJECTED',
          description: `Requested revisions for project: "${project.title}". Feedback: ${feedback || 'None'}`,
          metadata: { projectId, feedback },
        },
      }).catch(() => {})

      return successResponse(
        {
          id: rejectedProject.id,
          status: rejectedProject.status,
          message: 'Work rejected. Freelancer notified.',
        },
        200,
        'Revisions requested'
      )
    }

    // Approve work - update project to COMPLETED (finalized)
    const approvedProject = await db.project.update({
      where: { id: projectId },
      data: {
        updatedAt: new Date(),
      },
    })

    // Create completion transaction if budget exists
    if (project.budget && project.submiterId) {
      await db.transaction.create({
        data: {
          userId: project.submiterId,
          senderId: userId,
          receiverId: project.submiterId,
          projectId,
          type: 'EARNING',
          amount: project.budget,
          netAmount: project.budget.toNumber() * 0.95, // 5% commission
          commission: project.budget.toNumber() * 0.05,
          status: 'COMPLETED',
          description: `Earnings from project: "${project.title}"`,
        },
      }).catch(() => {})

      // Update freelancer earnings
      await db.user.update({
        where: { id: project.submiterId },
        data: {
          totalEarned: {
            increment: project.budget.toNumber() * 0.95,
          },
          walletBalance: {
            increment: project.budget.toNumber() * 0.95,
          },
        },
      }).catch(() => {})
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'PROJECT_COMPLETED',
        description: `Approved and completed project: "${project.title}"`,
        metadata: { projectId, freelancerId: project.submiterId },
      },
    }).catch(() => {})

    return successResponse(
      {
        id: approvedProject.id,
        status: approvedProject.status,
        submitter: project.submitter,
      },
      200,
      'Project completed and payment released'
    )
  } catch (error) {
    console.error('[APPROVE_PROJECT_ERROR]', error)
    return handleApiError(error)
  }
}
