import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { handleApiError } from '@/lib/auth-middleware'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'template_detail'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const templateId = params.templateId

    if (!templateId || typeof templateId !== 'string') {
      return errorResponse(400, 'Invalid template ID')
    }

    const template = await db.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return errorResponse(404, 'Template not found')
    }

    return successResponse(
      {
        id: template.id,
        title: template.title,
        description: template.description,
        category: template.category,
        price: template.price?.toNumber() || 0,
        image: template.image,
        features: template.features,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
      200,
      'Template retrieved successfully'
    )
  } catch (error: any) {
    console.error('[TEMPLATE_DETAIL_GET_ERROR]', error)
    return handleApiError(error)
  }
}
