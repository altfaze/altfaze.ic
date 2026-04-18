import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

/**
 * GET /api/messages?conversationId=...
 * Get messages for a conversation
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)

    if (!conversationId) {
      return errorResponse(400, 'conversationId is required')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Verify user is part of conversation
    const participant = await db.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id,
        },
      },
    })

    if (!participant) {
      return errorResponse(403, 'Not a member of this conversation')
    }

    // Get messages
    const messages = await db.message.findMany({
      where: { conversationId },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, image: true, email: true } },
        receiver: { select: { id: true, name: true, image: true, email: true } },
      },
    })

    const total = await db.message.count({ where: { conversationId } })

    return successResponse(
      {
        messages: messages.reverse(),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      200,
      'Messages retrieved'
    )
  } catch (error) {
    console.error('[GET_MESSAGES_ERROR]', error)
    return errorResponse(500, 'Failed to fetch messages')
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await req.json()
    const { conversationId, receiverId, content, attachments, relatedResourceType, relatedResourceId } = body

    if (!content?.trim()) {
      return errorResponse(400, 'Message content is required')
    }

    if (!conversationId || !receiverId) {
      return errorResponse(400, 'conversationId and receiverId are required')
    }

    const sender = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!sender) {
      return errorResponse(404, 'Sender not found')
    }

    // Verify user is part of conversation
    const participant = await db.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: sender.id,
        },
      },
    })

    if (!participant) {
      return errorResponse(403, 'Not a member of this conversation')
    }

    // Create message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: sender.id,
        receiverId,
        content: content.trim(),
        attachments: attachments || [],
        relatedResourceType,
        relatedResourceId,
      },
      include: {
        sender: { select: { id: true, name: true, image: true, email: true } },
        receiver: { select: { id: true, name: true, image: true, email: true } },
      },
    })

    // Update conversation last message
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: message.id,
        lastMessageAt: new Date(),
      },
    })

    // Create notification for receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: `New message from ${sender.id === session.user.id ? 'You' : 'a user'}`,
        message: content.substring(0, 100),
        relatedResourceType: 'MESSAGE',
        relatedResourceId: message.id,
      },
    }).catch(err => console.error('[MESSAGE_NOTIFICATION_ERROR]', err))

    return successResponse(message, 201, 'Message sent')
  } catch (error) {
    console.error('[SEND_MESSAGE_ERROR]', error)
    return errorResponse(500, 'Failed to send message')
  }
}
