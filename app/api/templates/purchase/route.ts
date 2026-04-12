import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering - never cache template purchases (financial transactions!)
export const dynamic = 'force-dynamic'

/**
 * POST /api/templates/purchase
 * Purchase a template (financial transaction)
 * 
 * SECURITY: This is a CRITICAL financial route
 * - Must never be cached
 * - Must validate user wallet balance at request time
 * - Must prevent double-purchasing via unique constraint
 * - Wallet deductions are irreversible
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { templateId } = body

    if (!templateId || typeof templateId !== 'string') {
      return errorResponse(400, 'Valid templateId is required')
    }

    // Get template
    const template = await db.template.findUnique({
      where: { id: templateId },
      select: { id: true, title: true, price: true },
    })

    if (!template) {
      return errorResponse(404, 'Template not found')
    }

    // Check if already purchased
    const existing = await db.templatePurchase.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId,
        },
      },
    })

    if (existing) {
      return errorResponse(400, 'Template already purchased')
    }

    // Get user wallet
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Check if template is free or user has sufficient balance
    const price = template.price?.toNumber() || 0
    if (price > 0 && (user.walletBalance?.toNumber() || 0) < price) {
      return errorResponse(400, 'Insufficient wallet balance')
    }

    // Create purchase record
    const crypto = require('crypto')
    const downloadToken = crypto.randomBytes(32).toString('hex')
    
    const purchase = await db.templatePurchase.create({
      data: {
        userId,
        templateId,
        purchasePrice: template.price || 0,
        downloadToken,
        status: 'COMPLETED',
      },
    })

    // Deduct from wallet if not free
    if (price > 0) {
      await db.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: price,
          },
        },
      })

      // Create transaction
      await db.transaction.create({
        data: {
          userId,
          type: 'PAYMENT',
          amount: price,
          description: `Purchased template: ${template.title}`,
          status: 'COMPLETED',
          relatedResourceId: templateId,
          relatedResourceType: 'TEMPLATE',
        },
      }).catch(err => console.error('[TRANSACTION_ERROR]', err))
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'TEMPLATE_PURCHASED',
        description: `Purchased template: ${template.title}`,
        resourceType: 'TEMPLATE',
        resourceId: templateId,
        metadata: { templateId, purchaseId: purchase.id, price },
      },
    }).catch(err => console.error('[ACTIVITY_LOG_ERROR]', err))

    return successResponse(
      {
        purchaseId: purchase.id,
        templateId,
        amount: price,
      },
      200,
      'Template purchased successfully'
    )
  } catch (error) {
    console.error('[TEMPLATE_PURCHASE_ERROR]', error)
    return handleApiError(error)
  }
}
