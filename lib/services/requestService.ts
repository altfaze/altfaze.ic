/**
 * Request Service - Handle requests from clients to freelancers
 */

import { db } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateRequestInput {
  senderId: string // Client
  receiverId: string // Freelancer
  title: string
  description: string
  amount?: number
  dueDate?: Date
}

/**
 * Create a new request (client sends to freelancer)
 */
export async function createRequest(input: CreateRequestInput) {
  const { senderId, receiverId, title, description, amount, dueDate } = input

  try {
    const request = await db.request.create({
      data: {
        senderId,
        receiverId,
        title,
        description,
        amount: amount ? new Decimal(amount) : null,
        dueDate,
        status: 'PENDING',
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    })

    // Create notification for freelancer
    try {
      await db.notification.create({
        data: {
          userId: receiverId,
          type: 'NEW_REQUEST',
          title: `New request from ${request.sender.name}`,
          message: `${request.sender.name} sent you a request: ${title}`,
          relatedResourceType: 'REQUEST',
          relatedResourceId: request.id,
        },
      })
    } catch (err) {
      console.error('[REQUEST_NOTIFICATION]', err)
    }

    return { success: true, request }
  } catch (error: any) {
    console.error('[REQUEST_CREATE]', error.message)
    throw error
  }
}

/**
 * Accept a request (converts to order)
 */
export async function acceptRequest(requestId: string, freelancerId: string) {
  try {
    const request = await db.request.findUnique({
      where: { id: requestId },
      include: { sender: true },
    })

    if (!request) {
      throw new Error('Request not found')
    }

    if (request.receiverId !== freelancerId) {
      throw new Error('Unauthorized')
    }

    if (request.status !== 'PENDING') {
      throw new Error(`Cannot accept ${request.status} request`)
    }

    const result = await db.$transaction(async (tx: any) => {
      // Update request status
      const updatedRequest = await tx.request.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      })

      // Create order from request
      const order = await tx.order.create({
        data: {
          senderId: request.senderId, // Client
          receiverId: freelancerId, // Freelancer
          title: request.title,
          description: request.description,
          amount: request.amount || new Decimal(0),
          dueDate: request.dueDate,
        },
      })

      // Link order to request
      await tx.request.update({
        where: { id: requestId },
        data: {
          orders: { connect: { id: order.id } },
        },
      })

      // Create notification for client
      try {
        await tx.notification.create({
          data: {
            userId: request.senderId,
            type: 'REQUEST_ACCEPTED',
            title: 'Your request was accepted!',
            message: `${updatedRequest.receiverId === freelancerId ? 'A freelancer' : 'Someone'} accepted your request: ${request.title}`,
            relatedResourceType: 'ORDER',
            relatedResourceId: order.id,
          },
        })
      } catch (err) {
        console.error('[ACCEPT_REQUEST_NOTIFICATION]', err)
      }

      return { order, updatedRequest }
    })

    return { success: true, ...result }
  } catch (error: any) {
    console.error('[REQUEST_ACCEPT]', error.message)
    throw error
  }
}

/**
 * Reject a request
 */
export async function rejectRequest(requestId: string, freelancerId: string) {
  try {
    const request = await db.request.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      throw new Error('Request not found')
    }

    if (request.receiverId !== freelancerId) {
      throw new Error('Unauthorized')
    }

    const updated = await db.request.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    })

    return { success: true, request: updated }
  } catch (error: any) {
    console.error('[REQUEST_REJECT]', error.message)
    throw error
  }
}

/**
 * Get user requests
 */
export async function getUserRequests(
  userId: string,
  type: 'sent' | 'received' | 'all' = 'all',
  status?: string
) {
  try {
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
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
        orders: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, requests }
  } catch (error: any) {
    console.error('[GET_REQUESTS]', error.message)
    throw error
  }
}

/**
 * Get single request
 */
export async function getRequest(requestId: string) {
  try {
    const request = await db.request.findUnique({
      where: { id: requestId },
      include: {
        sender: { select: { id: true, name: true, image: true, email: true } },
        receiver: { select: { id: true, name: true, image: true } },
        orders: {
          select: {
            id: true,
            status: true,
            amount: true,
            createdAt: true,
          },
        },
      },
    })

    if (!request) {
      throw new Error('Request not found')
    }

    return { success: true, request }
  } catch (error: any) {
    console.error('[GET_REQUEST]', error.message)
    throw error
  }
}
