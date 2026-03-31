import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, ValidationError } from '@/lib/api'
import { logProjectCreation, logProjectAcceptance } from '@/lib/activity'

/**
 * GET /api/projects
 * Get projects (filter by status, creator, submitter)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req)

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    const myProjects = searchParams.get('my') === 'true'

    // Build where clause
    let where: any = {}

    if (myProjects) {
      where.creatorId = userId
    }

    if (status) {
      where.status = status
    }

    const projects = await db.project.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
        submitter: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await db.project.count({ where })

    return successResponse(
      {
        projects: projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          budget: p.budget?.toNumber() || 0,
          status: p.status,
          category: p.category,
          deadline: p.deadline,
          creator: p.creator,
          submitter: p.submitter,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          hasMore: offset + limit < total,
        },
      },
      200,
      'Projects retrieved'
    )
  } catch (error) {
    console.error('Get projects error:', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/projects
 * Create new project (CLIENT only)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthWithRole(req, 'CLIENT')
    if (!auth) throw new ValidationError('Only clients can create projects')

    const { userId } = auth
    const body = await req.json()
    const { title, description, budget, category, deadline } = body

    // Validation
    if (!title) throw new ValidationError('Title is required')
    if (!description) throw new ValidationError('Description is required')
    if (!budget || budget <= 0) throw new ValidationError('Valid budget is required')
    if (!category) throw new ValidationError('Category is required')

    const budgetNum = parseFloat(budget)
    if (budgetNum > 999999999) throw new ValidationError('Budget exceeds maximum limit')

    // Create project
    const project = await db.project.create({
      data: {
        title,
        description,
        budget: budgetNum,
        category,
        deadline: deadline ? new Date(deadline) : null,
        creatorId: userId,
        status: 'OPEN',
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    })

    // Log activity
    await logProjectCreation(userId, project.id, title)

    return successResponse(
      {
        id: project.id,
        title: project.title,
        description: project.description,
        budget: project.budget?.toNumber() || 0,
        status: project.status,
        category: project.category,
        deadline: project.deadline,
        creator: project.creator,
        createdAt: project.createdAt,
      },
      201,
      'Project created'
    )
  } catch (error) {
    console.error('Create project error:', error)
    return handleApiError(error)
  }
}

/**
 * PATCH /api/projects/:id
 * Update project status (accept project for freelancer)
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req, 'FREELANCER')
    const body = await req.json()
    const { projectId, status } = body

    if (!projectId) throw new ValidationError('projectId is required')
    if (!status) throw new ValidationError('status is required')

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) throw new ValidationError('Project not found')

    // Update project
    const updatedProject = await db.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId },
        data: {
          status,
          submiterId: status === 'IN_PROGRESS' ? userId : project.submiterId,
        },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          submitter: { select: { id: true, name: true, email: true } },
        },
      })

      // Log if accepted
      if (status === 'IN_PROGRESS') {
        await logProjectAcceptance(userId, projectId, project.title)
      }

      return updated
    })

    return successResponse(
      {
        id: updatedProject.id,
        status: updatedProject.status,
        submitter: updatedProject.submitter,
        updatedAt: updatedProject.updatedAt,
      },
      200,
      `Project status updated to ${status}`
    )
  } catch (error) {
    console.error('Update project error:', error)
    return handleApiError(error)
  }
}
