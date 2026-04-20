/**
 * Order Service - Handle order creation, updates, and status management
 * Critical for the hiring flow: Request → Order → Acceptance → Work → Payment
 */

import { db } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'
import { calculateCommission, calculateNetAmount } from '@/lib/commission'
import { toSafeNumber } from '@/lib/utils'

export interface CreateOrderInput {
  senderId: string // Client
  receiverId: string // Freelancer
  requestId?: string
  title: string
  description?: string
  amount: number
  deadline?: Date
}

export interface UpdateOrderInput {
  orderId: string
  status?: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  notes?: string
}

/**
 * Create a new order from a request
 */
export async function createOrder(input: CreateOrderInput) {
  const { senderId, receiverId, requestId, title, description, amount, deadline } = input

  try {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Order amount must be greater than 0')
    }

    // Check sender has sufficient wallet balance
    const sender = await db.user.findUnique({
      where: { id: senderId },
      select: { walletBalance: true }
    })

    if (!sender || Number(sender.walletBalance) < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Create order in transaction
    const order = await db.$transaction(async (tx: any) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          senderId,
          receiverId,
          requestId,
          title,
          description,
          amount: new Decimal(amount),
          deadline,
          status: 'PENDING',
        },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
      })

      // Create transaction record (for audit)
      await tx.transaction.create({
        data: {
          userId: senderId,
          type: 'ORDER_CREATED',
          amount: new Decimal(amount),
          description: `Order created: ${title}`,
          status: 'PENDING',
          relatedResourceType: 'ORDER',
          relatedResourceId: newOrder.id,
        },
      })

      return newOrder
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: senderId,
        action: 'ORDER_CREATED',
        resourceType: 'ORDER',
        resourceId: order.id,
        metadata: { orderTitle: title, amount, receiverId },
      },
    }).catch((err: any) => console.error('[ORDER_SERVICE] Activity log error:', err))

    return { 
      success: true, 
      order: {
        ...order,
        amount: toSafeNumber(order.amount)
      }
    }
  } catch (error: any) {
    console.error('[ORDER_SERVICE] Create error:', error.message)
    throw error
  }
}

/**
 * Accept an order (freelancer action)
 */
export async function acceptOrder(orderId: string, freelancerId: string) {
  try {
    // Get order
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { receiver: true, sender: true },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.receiverId !== freelancerId) {
      throw new Error('Unauthorized: Only the assigned freelancer can accept this order')
    }

    if (order.status !== 'PENDING') {
      throw new Error(`Cannot accept order in ${order.status} status`)
    }

    // Update order status
    const updated = await db.$transaction(async (tx: any) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
        include: { sender: true, receiver: true },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: freelancerId,
          type: 'ORDER_ACCEPTED',
          amount: updatedOrder.amount,
          description: `Order accepted: ${updatedOrder.title}`,
          status: 'COMPLETED',
          relatedResourceType: 'ORDER',
          relatedResourceId: orderId,
        },
      })

      return updatedOrder
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: freelancerId,
        action: 'ORDER_ACCEPTED',
        resourceType: 'ORDER',
        resourceId: orderId,
      },
    }).catch((err: any) => console.error('[ORDER_SERVICE] Activity log error:', err))

    return { 
      success: true, 
      order: {
        ...updated,
        amount: toSafeNumber(updated.amount)
      }
    }
  } catch (error: any) {
    console.error('[ORDER_SERVICE] Accept error:', error.message)
    throw error
  }
}

/**
 * Complete an order (triggered by client or admin)
 * Releases payment to freelancer
 */
export async function completeOrder(orderId: string, clientId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.senderId !== clientId) {
      throw new Error('Unauthorized: Only the client can complete this order')
    }

    if (order.status !== 'ACCEPTED') {
      throw new Error(`Cannot complete order in ${order.status} status`)
    }

    // Calculate amounts
    const totalAmount = Number(order.amount)
    const commission = calculateCommission(totalAmount)
    const freelancerAmount = calculateNetAmount(totalAmount)

    // Process payment
    const completed = await db.$transaction(async (tx: any) => {
      // Update order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      })

      // Deduct from client wallet
      await tx.user.update({
        where: { id: clientId },
        data: {
          walletBalance: {
            decrement: totalAmount,
          },
          totalSpent: {
            increment: totalAmount,
          },
        },
      })

      // Add to freelancer wallet
      await tx.user.update({
        where: { id: order.receiverId },
        data: {
          walletBalance: {
            increment: freelancerAmount,
          },
          totalEarned: {
            increment: freelancerAmount,
          },
        },
      })

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId: clientId,
          type: 'PAYMENT',
          amount: new Decimal(totalAmount),
          commission: new Decimal(commission),
          netAmount: new Decimal(freelancerAmount),
          description: `Payment for order: ${updatedOrder.title}`,
          status: 'COMPLETED',
          relatedResourceType: 'ORDER',
          relatedResourceId: orderId,
        },
      })

      await tx.transaction.create({
        data: {
          userId: order.receiverId,
          type: 'EARNING',
          amount: new Decimal(freelancerAmount),
          commission: new Decimal(commission),
          netAmount: new Decimal(freelancerAmount),
          description: `Earned from order: ${updatedOrder.title}`,
          status: 'COMPLETED',
          relatedResourceType: 'ORDER',
          relatedResourceId: orderId,
        },
      })

      return updatedOrder
    })

    // Log activities
    await Promise.all([
      db.activityLog.create({
        data: {
          userId: clientId,
          action: 'ORDER_COMPLETED',
          resourceType: 'ORDER',
          resourceId: orderId,
          metadata: { amount: totalAmount, commission },
        },
      }),
      db.activityLog.create({
        data: {
          userId: order.receiverId,
          action: 'PAYMENT_RECEIVED',
          resourceType: 'ORDER',
          resourceId: orderId,
          metadata: { amount: freelancerAmount, commission },
        },
      }),
    ]).catch((err: any) => console.error('[ORDER_SERVICE] Activity log error:', err))

    return { 
      success: true, 
      order: {
        ...completed,
        amount: toSafeNumber(completed.amount)
      },
      breakdown: { 
        totalAmount, 
        commission, 
        freelancerAmount 
      } 
    }
  } catch (error: any) {
    console.error('[ORDER_SERVICE] Complete error:', error.message)
    throw error
  }
}

/**
 * Reject an order (freelancer action)
 */
export async function rejectOrder(orderId: string, freelancerId: string, reason?: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.receiverId !== freelancerId) {
      throw new Error('Unauthorized')
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: { status: 'REJECTED', notes: reason },
    })

    return { success: true, order: updated }
  } catch (error: any) {
    console.error('[ORDER_SERVICE] Reject error:', error.message)
    throw error
  }
}

/**
 * Cancel an order (client action)
 */
export async function cancelOrder(orderId: string, clientId: string, reason?: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.senderId !== clientId) {
      throw new Error('Unauthorized: Only the client can cancel this order')
    }

    if (!['PENDING', 'ACCEPTED'].includes(order.status)) {
      throw new Error(`Cannot cancel order in ${order.status} status`)
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', notes: reason },
    })

    return { success: true, order: updated }
  } catch (error: any) {
    console.error('[ORDER_SERVICE] Cancel error:', error.message)
    throw error
  }
}

/**
 * Get orders for a user (both sent and received)
 */
export async function getUserOrders(userId: string, type: 'sent' | 'received' | 'all' = 'all') {
  try {
    let where: any = {}

    if (type === 'sent') {
      where = { senderId: userId }
    } else if (type === 'received') {
      where = { receiverId: userId }
    } else {
      where = {
        OR: [{ senderId: userId }, { receiverId: userId }],
      }
    }

    const orders = await db.order.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, image: true, email: true } },
        receiver: { select: { id: true, name: true, image: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Convert decimal amounts to numbers
    const convertedOrders = orders.map(order => ({
      ...order,
      amount: toSafeNumber(order.amount)
    }))

    return { success: true, orders: convertedOrders }
  } catch (error: any) {
    console.error('[ORDER_SERVICE] Get orders error:', error.message)
    throw error
  }
}
