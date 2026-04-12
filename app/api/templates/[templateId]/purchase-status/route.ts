import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/templates/[templateId]/purchase-status
 * Check if user has purchased this template
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const session = await getServerSession(authOptions)
    const { templateId } = params

    if (!templateId || typeof templateId !== 'string') {
      return errorResponse(400, 'Valid templateId is required')
    }

    if (!session?.user?.email) {
      return successResponse({ purchased: false }, 200)
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return successResponse({ purchased: false }, 200)
    }

    const purchase = await (db as any).templatePurchase.findUnique({
      where: {
        userId_templateId: {
          userId: user.id,
          templateId,
        },
      },
    })

    return successResponse(
      { purchased: !!purchase },
      200,
      'Status retrieved'
    )
  } catch (error) {
    console.error('[PURCHASE_STATUS_ERROR]', error)
    return errorResponse(500, 'Error checking purchase status')
  }
}
