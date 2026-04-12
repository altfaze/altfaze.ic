import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'

// Force dynamic rendering for purchase operations
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'template-purchase', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) return errorResponse(429, 'Rate limit exceeded')

    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { templateId } = body

    if (!templateId) {
      return errorResponse(400, 'Template ID is required')
    }

    // Check template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
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
      return successResponse({ purchase: existing }, 200, 'Template already purchased')
    }

    // Get user wallet
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user || (user.walletBalance?.toNumber() || 0) < (template.price?.toNumber() || 0)) {
      return errorResponse(400, 'Insufficient wallet balance')
    }

    // Create transaction and purchase in single transaction
    const result = await db.$transaction(async (tx: any) => {
      const price = template.price?.toNumber() || 0

      // Deduct from wallet
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: price,
          },
        },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'PURCHASE',
          amount: price,
          description: `Purchase: ${template.title}`,
          status: 'COMPLETED',
          relatedResourceId: templateId,
          relatedResourceType: 'TEMPLATE',
        },
      })

      // Create purchase record
      const purchase = await tx.templatePurchase.create({
        data: {
          userId,
          templateId,
          purchasePrice: price,
          downloadToken: Buffer.from(`${userId}:${templateId}:${Date.now()}`).toString('base64'),
        },
      })

      // Increment uploader wallet if they are not admin
      if (template.uploaderId && template.uploaderId !== 'admin') {
        const commission = price * 0.8 // Platform takes 20%
        await tx.user.update({
          where: { id: template.uploaderId },
          data: {
            walletBalance: {
              increment: commission,
            },
          },
        })

        // Log commission transaction
        await tx.transaction.create({
          data: {
            userId: template.uploaderId,
            type: 'COMMISSION',
            amount: commission,
            description: `Commission: ${template.title} sold`,
            status: 'COMPLETED',
            relatedResourceId: purchase.id,
            relatedResourceType: 'PURCHASE',
          },
        })
      }

      // Log activity
      await tx.activityLog.create({
        data: {
          userId,
          action: 'TEMPLATE_PURCHASED',
          resourceType: 'TEMPLATE',
          resourceId: templateId,
          metadata: { templateName: template.title, price },
        },
      }).catch((err: any) => console.error('[ACTIVITY_LOG_ERROR]', err))

      return { purchase, transaction }
    })

    return successResponse(
      {
        purchase: result.purchase,
        downloadToken: result.purchase.downloadToken,
      },
      201,
      'Template purchased successfully'
    )
  } catch (error) {
    console.error('[TEMPLATE_PURCHASE_ERROR]', error)
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'template-purchases-get', 100, API_RATE_LIMIT.window))
    if (limited) return errorResponse(429, 'Rate limit exceeded')

    const { userId } = await requireAuth(req)

    const purchases = await db.templatePurchase.findMany({
      where: { userId },
      include: {
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse({ purchases }, 200, 'Purchases retrieved successfully')
  } catch (error) {
    console.error('[TEMPLATE_PURCHASES_GET_ERROR]', error)
    return handleApiError(error)
  }
}
