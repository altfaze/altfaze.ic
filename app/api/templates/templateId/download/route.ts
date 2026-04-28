import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse, ValidationError } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'template_download'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuth(req)

    if (!params.templateId || typeof params.templateId !== 'string') {
      throw new ValidationError('Invalid template ID')
    }

    // Check if user has purchased this template
    const purchase = await (db as any).templatePurchase.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId: params.templateId,
        },
      },
    })

    if (!purchase || purchase.status !== 'COMPLETED') {
      throw new ValidationError('You have not purchased this template or the purchase is incomplete')
    }

    // Get template details
    const template = await db.template.findUnique({
      where: { id: params.templateId },
    })

    if (!template) {
      throw new ValidationError('Template not found')
    }

    // Generate download token for secure access
    const downloadToken = crypto.randomBytes(32).toString('hex')

    // Update purchase with download token
    await (db as any).templatePurchase.update({
      where: {
        userId_templateId: {
          userId,
          templateId: params.templateId,
        },
      },
      data: { downloadToken },
    })

    // Log download activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'TEMPLATE_DOWNLOADED',
        resourceType: 'TEMPLATE',
        resourceId: params.templateId,
        templateId: params.templateId,
        metadata: {
          templateTitle: template.title,
          downloadedAt: new Date().toISOString(),
        },
      },
    }).catch((err: any) => console.error('[ACTIVITY_LOG_ERROR]', err))

    return successResponse(
      {
        templateId: template.id,
        title: template.title,
        downloadToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        downloadUrl: `/api/templates/${params.templateId}/download-file?token=${downloadToken}`,
      },
      200,
      'Download link generated successfully'
    )
  } catch (error: any) {
    console.error('[TEMPLATE_DOWNLOAD_ERROR]', error)
    return handleApiError(error)
  }
}

/**
 * Secure download endpoint using token
 * This endpoint verifies the token and serves the file
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'template_download_file'))
    if (isRateLimited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { token } = await req.json()

    if (!token || typeof token !== 'string') {
      throw new ValidationError('Download token is required')
    }

    // Verify the download token
    const purchase = await (db as any).templatePurchase.findUnique({
      where: { downloadToken: token },
    })

    if (!purchase || purchase.templateId !== params.templateId) {
      throw new ValidationError('Invalid or expired download token')
    }

    // Check if token is still valid (24 hours)
    const tokenAge = Date.now() - purchase.updatedAt.getTime()
    if (tokenAge > 24 * 60 * 60 * 1000) {
      throw new ValidationError('Download token has expired. Please generate a new one.')
    }

    // Get template
    const template = await db.template.findUnique({
      where: { id: params.templateId },
    })

    if (!template) {
      throw new ValidationError('Template not found')
    }

    // In a real implementation, this would serve the actual template file
    // For now, return metadata that can be used to fetch the file from storage
    return successResponse(
      {
        id: template.id,
        title: template.title,
        description: template.description,
        category: template.category,
        features: template.features,
        downloadUrl: `https://cdn.altfaze.in/templates/${template.id}/download`, // Change to actual CDN URL
      },
      200,
      'Template download link ready'
    )
  } catch (error: any) {
    console.error('[TEMPLATE_DOWNLOAD_FILE_ERROR]', error)
    return handleApiError(error)
  }
}
