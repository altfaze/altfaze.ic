/**
 * Freelancer Profile Service
 */

import { db } from '@/lib/db'

export interface UpdateProfileInput {
  userId: string
  title?: string
  bio?: string
  skills?: string[]
  portfolio?: string
  hourlyRate?: number
}

/**
 * Get freelancer profile
 */
export async function getProfile(freelancerId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: freelancerId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        totalEarned: true,
        totalSpent: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const freelancer = await db.freelancer.findUnique({
      where: { userId: freelancerId },
    })

    // Get reviews
    const reviews = await db.review.findMany({
      where: { targetId: freelancerId },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    // Get completed orders count
    const completedOrders = await db.order.count({
      where: {
        receiverId: freelancerId,
        status: 'COMPLETED',
      },
    })

    return {
      success: true,
      profile: {
        ...user,
        freelancer: freelancer || {
          title: null,
          bio: null,
          skills: [],
          portfolio: null,
          hourlyRate: null,
          rating: 0,
          reviewCount: 0,
        },
        stats: {
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
          completedOrders,
          totalEarned: Number(user.totalEarned),
        },
        reviews: reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          author: r.author,
          createdAt: r.createdAt,
        })),
      },
    }
  } catch (error: any) {
    console.error('[FREELANCER_PROFILE] Get error:', error.message)
    throw error
  }
}

/**
 * Update freelancer profile
 */
export async function updateProfile(input: UpdateProfileInput) {
  const { userId, title, bio, skills, portfolio, hourlyRate } = input

  try {
    // Ensure freelancer profile exists
    let freelancer = await db.freelancer.findUnique({
      where: { userId },
    })

    if (!freelancer) {
      freelancer = await db.freelancer.create({
        data: { userId },
      })
    }

    // Update profile
    const updated = await db.freelancer.update({
      where: { userId },
      data: {
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(skills && { skills }),
        ...(portfolio !== undefined && { portfolio }),
        ...(hourlyRate !== undefined && { hourlyRate }),
      },
    })

    return { success: true, profile: updated }
  } catch (error: any) {
    console.error('[FREELANCER_PROFILE] Update error:', error.message)
    throw error
  }
}

/**
 * Search freelancers
 */
export async function searchFreelancers(filters?: {
  search?: string
  skills?: string[]
  minRate?: number
  maxRate?: number
  minRating?: number
  limit?: number
  offset?: number
}) {
  try {
    const {
      search,
      skills,
      minRate,
      maxRate,
      minRating = 0,
      limit = 20,
      offset = 0,
    } = filters || {}

    let where: any = {}

    // Search in title, bio
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Filter by skills
    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills }
    }

    // Filter by hourly rate
    if (minRate || maxRate) {
      where.hourlyRate = {}
      if (minRate) where.hourlyRate.gte = minRate
      if (maxRate) where.hourlyRate.lte = maxRate
    }

    // Filter by rating
    if (minRating > 0) {
      where.rating = { gte: minRating }
    }

    const [freelancers, total] = await Promise.all([
      db.freelancer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          },
        },
        orderBy: { rating: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.freelancer.count({ where }),
    ])

    return {
      success: true,
      freelancers: freelancers.map(f => ({
        id: f.id,
        userId: f.userId,
        user: f.user,
        title: f.title,
        bio: f.bio,
        skills: f.skills,
        hourlyRate: f.hourlyRate ? Number(f.hourlyRate) : null,
        rating: Number(f.rating),
        reviewCount: f.reviewCount,
      })),
      pagination: { total, limit, offset, pages: Math.ceil(total / limit) },
    }
  } catch (error: any) {
    console.error('[FREELANCER_SEARCH] Error:', error.message)
    throw error
  }
}

/**
 * Get freelancer stats
 */
export async function getFreelancerStats(userId: string) {
  try {
    const [completedOrders, totalEarnings, reviews] = await Promise.all([
      db.order.count({
        where: { receiverId: userId, status: 'COMPLETED' },
      }),
      db.transaction.aggregate({
        where: { userId, type: 'EARNING', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      db.review.findMany({
        where: { targetId: userId },
      }),
    ])

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return {
      success: true,
      stats: {
        completedOrders,
        totalEarnings: totalEarnings._sum.amount ? Number(totalEarnings._sum.amount) : 0,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        responseTime: 'Fast', // Can be calculated from order data
      },
    }
  } catch (error: any) {
    console.error('[FREELANCER_STATS] Error:', error.message)
    throw error
  }
}
