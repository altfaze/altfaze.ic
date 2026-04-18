import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

/**
 * GET /api/conversations
 * Get all conversations for current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)

    // Get conversations for user
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId: user.id },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { lastMessageAt: 'desc' },
      include: {
        participants: {
          where: { userId: { not: user.id } },
          include: { user: { select: { id: true, name: true, image: true, email: true } } },
          take: 2,
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { content: true, createdAt: true },
        },
      },
    })

    const total = await db.conversation.count({
      where: {
        participants: {
          some: { userId: user.id },
        },
      },
    })

    return successResponse(
      {
        conversations,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      200,
      'Conversations retrieved'
    )
  } catch (error) {
    console.error('[GET_CONVERSATIONS_ERROR]', error)
    return errorResponse(500, 'Failed to fetch conversations')
  }
}

/**
 * POST /api/conversations
 * Create or get direct conversation with another user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await req.json()
    const { participantId } = body

    if (!participantId) {
      return errorResponse(400, 'participantId is required')
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!currentUser) {
      return errorResponse(404, 'User not found')
    }

    if (participantId === currentUser.id) {
      return errorResponse(400, 'Cannot create conversation with yourself')
    }

    // Check if participant exists
    const participant = await db.user.findUnique({
      where: { id: participantId },
      select: { id: true, name: true, image: true, email: true },
    })

    if (!participant) {
      return errorResponse(404, 'Participant not found')
    }

    // Look for existing direct conversation
    let conversation = await db.conversation.findFirst({
      where: {
        type: 'DIRECT',
        participants: {
          every: {
            userId: { in: [currentUser.id, participantId] },
          },
        },
      },
      include: { participants: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
    })

    if (!conversation) {
      // Create new conversation
      conversation = await db.conversation.create({
        data: {
          type: 'DIRECT',
          participants: {
            createMany: {
              data: [
                { userId: currentUser.id },
                { userId: participantId },
              ],
            },
          },
        },
        include: { participants: true, messages: true },
      })
    }

    return successResponse(
      {
        id: conversation.id,
        type: conversation.type,
        participants: conversation.participants,
      },
      201,
      'Conversation retrieved/created'
    )
  } catch (error) {
    console.error('[CREATE_CONVERSATION_ERROR]', error)
    return errorResponse(500, 'Failed to create conversation')
  }
}
