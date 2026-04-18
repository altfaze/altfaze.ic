import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

/**
 * POST /api/hire/send-offer
 * Client sends offer/hire request to freelancer
 * Creates Order with PENDING status
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await req.json()
    const { freelancerId, title, description, amount, deadline } = body

    // Validate input
    if (!freelancerId || !title || !amount) {
      return errorResponse(400, 'freelancerId, title, and amount are required')
    }

    if (amount <= 0) {
      return errorResponse(400, 'Amount must be greater than 0')
    }

    const client = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, name: true },
    })

    if (!client || client.role !== 'CLIENT') {
      return errorResponse(403, 'Only clients can send hire offers')
    }

    // Check freelancer exists and is indeed a freelancer
    const freelancer = await db.user.findUnique({
      where: { id: freelancerId },
      select: { id: true, role: true, name: true, email: true },
    })

    if (!freelancer || freelancer.role !== 'FREELANCER') {
      return errorResponse(404, 'Freelancer not found')
    }

    // Create order
    const order = await db.order.create({
      data: {
        senderId: client.id, // Client
        receiverId: freelancerId, // Freelancer
        title,
        description: description || '',
        amount,
        status: 'PENDING',
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    })

    // Create conversation for communication
    const conversation = await db.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          createMany: {
            data: [
              { userId: client.id },
              { userId: freelancerId },
            ],
          },
        },
      },
    })

    // Notify freelancer
    await db.notification.create({
      data: {
        userId: freelancerId,
        type: 'ORDER_RECEIVED',
        title: `New hire offer from ${client.name || 'a client'}`,
        message: `${title} - $${amount}`,
        relatedResourceType: 'ORDER',
        relatedResourceId: order.id,
      },
    }).catch(err => console.error('[ORDER_NOTIFICATION_ERROR]', err))

    // Create activity log
    await db.activityLog.create({
      data: {
        userId: client.id,
        action: 'HIRE_SENT',
        description: `Sent hire offer to ${freelancer.name || freelancer.email}: ${title} ($${amount})`,
        resourceType: 'ORDER',
        resourceId: order.id,
      },
    }).catch(err => console.error('[HIRE_ACTIVITY_LOG_ERROR]', err))

    return successResponse(
      {
        order,
        conversation: { id: conversation.id },
      },
      201,
      'Hire offer sent successfully'
    )
  } catch (error) {
    console.error('[SEND_HIRE_OFFER_ERROR]', error)
    return errorResponse(500, 'Failed to send hire offer', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
