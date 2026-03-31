import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, ValidationError } from '@/lib/api'
import { validateAmount } from '@/lib/commission'
import { logActivity } from '@/lib/activity'

/**
 * GET /api/requests
 * Get work requests (sent or received)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)

    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get('type') // 'sent' or 'received'
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Build where clause
    let where: any = {}

    if (type === 'sent') {
      where.senderId = userId
    } else if (type === 'received') {
      where.receiverId = userId
    } else {
      where.OR = [{ senderId: userId }, { receiverId: userId }]
    }

    if (status) {
      where.status = status
    }

    const requests = await db.request.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await db.request.count({ where })

    return successResponse(
      {
        requests: requests.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          status: r.status,
          amount: r.amount?.toNumber() || null,
          dueDate: r.dueDate,
          sender: r.sender,
          receiver: r.receiver,
          projectId: r.projectId,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          hasMore: offset + limit < total,
        },
      },
      200,
      'Requests retrieved'
    )
  } catch (error) {
    console.error('Get requests error:', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/requests
 * Send work request to freelancer
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { title, description, freelancerId, amount, dueDate, projectId } = body

    // Validation
    if (!title) throw new ValidationError('Title is required')
    if (!description) throw new ValidationError('Description is required')
    if (!freelancerId) throw new ValidationError('freelancerId is required')

    // Verify freelancer exists
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
    })
    if (!freelancer) {
      throw new ValidationError('Freelancer not found')
    }

    // Validate amount if provided
    if (amount) {
      const amountValidation = validateAmount(amount)
      if (!amountValidation.valid) {
        throw new ValidationError(amountValidation.error || 'Invalid amount')
      }
    }

    // Create request
    const request = await db.$transaction(async (tx) => {
      const newRequest = await tx.request.create({
        data: {
          title,
          description,
          senderId: userId,
          receiverId: freelancerId,
          amount: amount ? parseFloat(amount) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
          projectId: projectId || null,
          status: 'PENDING',
        },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
      })

      // Log activity
      await logActivity(
        userId,
        'REQUEST_SENT',
        `Sent request: ${title} to ${freelancer.name}`,
        { requestId: newRequest.id, receiverId: freelancerId }
      )

      return newRequest
    })

    return successResponse(
      {
        id: request.id,
        title: request.title,
        description: request.description,
        status: request.status,
        amount: request.amount?.toNumber() || null,
        dueDate: request.dueDate,
        sender: request.sender,
        receiver: request.receiver,
        createdAt: request.createdAt,
      },
      201,
      'Request sent'
    )
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/requests/:id
 * Accept or reject request
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { requestId, status } = body

    if (!requestId) throw new ValidationError('requestId is required')
    if (!status) throw new ValidationError('status is required')

    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    // Get request
    const request = await db.request.findUnique({
      where: { id: requestId },
      include: { sender: true, receiver: true },
    })

    if (!request) throw new ValidationError('Request not found')

    // Verify user is receiver
    if (request.receiverId !== userId) {
      throw new ValidationError('Only receiver can update request status')
    }

    // Update request
    const updatedRequest = await db.$transaction(async (tx) => {
      const updated = await tx.request.update({
        where: { id: requestId },
        data: { status },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
      })

      // Log activity
      const action = status === 'ACCEPTED' ? 'REQUEST_ACCEPTED' : 'REQUEST_REJECTED'
      await logActivity(
        userId,
        action,
        `${action === 'REQUEST_ACCEPTED' ? 'Accepted' : 'Rejected'} request: ${request.title}`,
        { requestId, status }
      )

      return updated
    })

    return successResponse(
      {
        id: updatedRequest.id,
        status: updatedRequest.status,
        sender: updatedRequest.sender,
        receiver: updatedRequest.receiver,
        updatedAt: updatedRequest.updatedAt,
      },
      200,
      `Request ${status.toLowerCase()}`
    )
  } catch (error) {
    console.error('Update request error:', error)
    return handleApiError(error)
  }
}
