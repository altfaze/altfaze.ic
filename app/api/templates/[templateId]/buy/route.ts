import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, isValidAmount } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { generateDownloadToken } from '@/lib/upload'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/templates/[id]/buy
 * Buy template
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    // Get template
    const template = await db.template.findUnique({
      where: { id: params.templateId },
      select: {
        id: true,
        title: true,
        price: true,
        uploaderId: true,
      },
    })

    if (!template) {
      return errorResponse(404, 'Template not found')
    }

    // Check if already purchased
    const existing = await db.templatePurchase.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId: template.id,
        },
      },
    })

    if (existing) {
      return errorResponse(409, 'You have already purchased this template')
    }

    // Get user wallet
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    const price = template.price.toNumber()
    const balance = user.walletBalance.toNumber()

    if (balance < price) {
      return errorResponse(400, `Insufficient balance. Need $${price}, Have: $${balance}`)
    }

    // Generate download token
    const downloadToken = generateDownloadToken()

    // Create purchase record
    const purchase = await db.templatePurchase.create({
      data: {
        templateId: template.id,
        userId,
        purchasePrice: price,
        downloadToken,
        status: 'COMPLETED',
      },
    })

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        userId,
        senderId: userId,
        receiverId: template.uploaderId,
        templateId: template.id,
        type: 'PAYMENT',
        amount: price,
        status: 'COMPLETED',
        description: `Purchased template: "${template.title}"`,
      },
    })

    // Deduct from buyer
    await db.user.update({
      where: { id: userId },
      data: {
        walletBalance: { decrement: price },
        totalSpent: { increment: price },
      },
    })

    // Add to seller (if not same user and uploaderId exists)
    if (template.uploaderId && template.uploaderId !== userId) {
      await db.user.update({
        where: { id: template.uploaderId },
        data: {
          walletBalance: { increment: price * 0.95 }, // 5% commission
          totalEarned: { increment: price * 0.95 },
        },
      }).catch(() => {})
    }

    // Log activity
    const activityLogs = [
      db.activityLog.create({
        data: {
          userId,
          action: 'TEMPLATE_PURCHASED',
          templateId: template.id,
          description: `Purchased template: "${template.title}"`,
          metadata: { price, purchaseId: purchase.id },
        },
      }),
    ]

    // Only log seller activity if uploaderId exists and is different from buyer
    if (template.uploaderId && template.uploaderId !== userId) {
      activityLogs.push(
        db.activityLog.create({
          data: {
            userId: template.uploaderId,
            action: 'TEMPLATE_SALE',
            templateId: template.id,
            description: `Sold template: "${template.title}" to user`,
            metadata: { price, purchaseId: purchase.id, buyerId: userId },
          },
        })
      )
    }

    await Promise.all(activityLogs).catch(() => {})

    return successResponse(
      {
        purchase: {
          id: purchase.id,
          templateId: template.id,
          downloadToken,
          status: purchase.status,
        },
        template: {
          id: template.id,
          title: template.title,
          price,
        },
      },
      201,
      'Template purchased successfully'
    )
  } catch (error) {
    console.error('[BUY_TEMPLATE_ERROR]', error)
    return handleApiError(error)
  }
}
