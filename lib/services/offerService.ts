/**
 * Offers Service - Handle freelancer → client offers
 */

import { db } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'
import { toSafeNumber, convertDecimalFields } from '@/lib/utils'

export interface CreateOfferInput {
  senderId: string // Freelancer
  receiverId: string // Client
  title: string
  description?: string
  amount: number
  deadline?: Date
}

/**
 * Create an offer
 */
export async function createOffer(input: CreateOfferInput) {
  const { senderId, receiverId, title, description, amount, deadline } = input

  try {
    if (amount <= 0) {
      throw new Error('Offer amount must be greater than 0')
    }

    const offer = await db.offer.create({
      data: {
        senderId,
        receiverId,
        title,
        description,
        amount: new Decimal(amount),
        expiresAt: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    })

    // Create notification
    await createNotification({
      userId: receiverId,
      type: 'OFFER_RECEIVED',
      title: `New offer from ${offer.sender.name}`,
      message: `${offer.sender.name} sent you an offer: ${title} for ₹${amount}`,
      relatedResourceType: 'OFFER',
      relatedResourceId: offer.id,
    }).catch((err: any) => console.error('[OFFER_NOTIFICATION]', err))

    // Convert decimal amount to number for JSON serialization
    return { 
      success: true, 
      offer: {
        ...offer,
        amount: toSafeNumber(offer.amount)
      }
    }
  } catch (error: any) {
    console.error('[OFFER_CREATE]', error.message)
    throw error
  }
}

/**
 * Accept an offer (creates an order)
 */
export async function acceptOffer(offerId: string, clientId: string) {
  try {
    const offer = await db.offer.findUnique({
      where: { id: offerId },
      include: { sender: true, receiver: true },
    })

    if (!offer) {
      throw new Error('Offer not found')
    }

    if (offer.receiverId !== clientId) {
      throw new Error('Unauthorized')
    }

    if (offer.status !== 'PENDING') {
      throw new Error(`Cannot accept ${offer.status} offer`)
    }

    // Create order from offer
    const result = await db.$transaction(async (tx: any) => {
      // Update offer status
      const updatedOffer = await tx.offer.update({
        where: { id: offerId },
        data: { status: 'ACCEPTED' },
      })

      // Create order
      const order = await tx.order.create({
        data: {
          senderId: offer.receiverId, // Client
          receiverId: offer.senderId, // Freelancer
          title: offer.title,
          description: offer.description,
          amount: offer.amount,
          deadline: offer.expiresAt,
        },
      })

      // Create notification for freelancer
      await tx.notification.create({
        data: {
          userId: offer.senderId,
          type: 'OFFER_ACCEPTED',
          title: 'Your offer was accepted!',
          message: `${offer.receiver.name} accepted your offer: ${offer.title}`,
          relatedResourceType: 'ORDER',
          relatedResourceId: order.id,
        },
      }).catch((err: any) => console.error('[ACCEPT_OFFER_NOTIFICATION]', err))

      return { offer: updatedOffer, order }
    })

    // Convert decimal amounts to numbers for JSON serialization
    return { 
      success: true,
      offer: {
        ...result.offer,
        amount: toSafeNumber(result.offer.amount)
      },
      order: {
        ...result.order,
        amount: toSafeNumber(result.order.amount)
      }
    }
  } catch (error: any) {
    console.error('[OFFER_ACCEPT]', error.message)
    throw error
  }
}

/**
 * Reject an offer
 */
export async function rejectOffer(offerId: string, clientId: string) {
  try {
    const offer = await db.offer.findUnique({
      where: { id: offerId },
    })

    if (!offer) {
      throw new Error('Offer not found')
    }

    if (offer.receiverId !== clientId) {
      throw new Error('Unauthorized')
    }

    const updated = await db.offer.update({
      where: { id: offerId },
      data: { status: 'REJECTED' },
    })

    return { success: true, offer: updated }
  } catch (error: any) {
    console.error('[OFFER_REJECT]', error.message)
    throw error
  }
}

/**
 * Get user's offers (sent or received)
 */
export async function getUserOffers(userId: string, type: 'sent' | 'received' | 'all' = 'all') {
  try {
    let where: any = {}

    if (type === 'sent') {
      where = { senderId: userId }
    } else if (type === 'received') {
      where = { receiverId: userId }
    } else {
      where = { OR: [{ senderId: userId }, { receiverId: userId }] }
    }

    const offers = await db.offer.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Convert all decimal amounts to numbers for JSON serialization
    const convertedOffers = offers.map(offer => ({
      ...offer,
      amount: toSafeNumber(offer.amount)
    }))

    return { success: true, offers: convertedOffers }
  } catch (error: any) {
    console.error('[GET_OFFERS]', error.message)
    throw error
  }
}

/**
 * Create notification (helper)
 */
interface CreateNotificationInput {
  userId: string
  type: string
  title: string
  message: string
  relatedResourceType?: string
  relatedResourceId?: string
}

export async function createNotification(input: CreateNotificationInput) {
  try {
    const notification = await db.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        relatedResourceType: input.relatedResourceType,
        relatedResourceId: input.relatedResourceId,
      },
    })

    return { success: true, notification }
  } catch (error: any) {
    console.error('[CREATE_NOTIFICATION]', error.message)
    throw error
  }
}

/**
 * Get user notifications
 */
export async function getNotifications(userId: string, unreadOnly = false) {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return { success: true, notifications }
  } catch (error: any) {
    console.error('[GET_NOTIFICATIONS]', error.message)
    throw error
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return { success: true, notification }
  } catch (error: any) {
    console.error('[MARK_READ]', error.message)
    throw error
  }
}
