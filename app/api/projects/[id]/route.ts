import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { toSafeNumber } from '@/lib/utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/projects/[id]
 * Get detailed project information with all related data
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireAuth(req)
    const projectId = params.id

    if (!projectId || typeof projectId !== 'string') {
      return errorResponse(400, 'Invalid project ID')
    }

    // Fetch project with all relationships
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username: true,
            isVerified: true,
          },
        },
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username: true,
          },
        },
      },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    // Check if user has applied to this project
    const userRequest = await db.request.findFirst({
      where: {
        projectId,
        senderId: userId,
      },
      select: {
        id: true,
        amount: true,
        description: true,
        status: true,
        createdAt: true,
      },
    })

    return successResponse(
      {
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          budget: toSafeNumber(project.budget),
          status: project.status,
          category: project.category,
          deadline: project.deadline,
          creator: project.creator,
          submitter: project.submitter,
          userHasApplied: !!userRequest,
          userApplication: userRequest ? {
            ...userRequest,
            amount: toSafeNumber(userRequest.amount)
          } : null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      },
      200,
      'Project details retrieved successfully'
    )
  } catch (error: any) {
    console.error('[PROJECT_DETAIL_GET_ERROR]', error)
    return handleApiError(error)
  }
}
