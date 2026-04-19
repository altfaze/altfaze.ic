import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import { createCustomer } from '@/lib/razorpay'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/razorpay/customer
 * Create a Razorpay customer and link it to the user
 */
export async function POST(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'razorpay_customer_create'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    // Check if user already has a Razorpay customer ID
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      select: { razorpayCustomerId: true, name: true, email: true },
    })

    if (!existingUser) {
      return errorResponse(404, 'User not found')
    }

    if (existingUser.razorpayCustomerId) {
      return successResponse(
        { customerId: existingUser.razorpayCustomerId },
        200,
        'User already has a Razorpay customer ID'
      )
    }

    // Create Razorpay customer
    const razorpayCustomer = await createCustomer({
      name: existingUser.name || 'ALTFaze User',
      email: existingUser.email || '',
      notes: {
        userId,
        createdAt: new Date().toISOString(),
      },
    })

    // Update user with Razorpay customer ID
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { razorpayCustomerId: razorpayCustomer.id },
      select: {
        id: true,
        razorpayCustomerId: true,
        name: true,
        email: true,
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'RAZORPAY_CUSTOMER_CREATED',
        resourceType: 'RAZORPAY',
        resourceId: razorpayCustomer.id,
        metadata: { customerId: razorpayCustomer.id },
      },
    }).catch((err: any) => console.error('[ACTIVITY_LOG_ERROR]', err))

    return successResponse(
      {
        customerId: updatedUser.razorpayCustomerId,
        userId: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      201,
      'Razorpay customer created and linked successfully'
    )
  } catch (error: any) {
    console.error('[RAZORPAY_CUSTOMER_CREATE_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * GET /api/razorpay/customer
 * Get the current user's Razorpay customer ID
 */
export async function GET(req: NextRequest) {
  try {
    const isRateLimited = !(await rateLimit(req, 'razorpay_customer_get'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        razorpayCustomerId: true,
        razorpayContactId: true,
        razorpayFundAccountId: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    return successResponse(
      {
        userId: user.id,
        customerId: user.razorpayCustomerId,
        contactId: user.razorpayContactId,
        fundAccountId: user.razorpayFundAccountId,
        name: user.name,
        email: user.email,
      },
      200,
      'Razorpay customer details retrieved successfully'
    )
  } catch (error: any) {
    console.error('[RAZORPAY_CUSTOMER_GET_ERROR]', error)
    return handleApiError(error)
  }
}
