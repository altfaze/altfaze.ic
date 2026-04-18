import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { validateCreateTemplate } from '@/lib/validations/template'
import { uploadToCloudinary, validateFile, generateDownloadToken } from '@/lib/upload'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/templates
 * Freelancer uploads template
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'FREELANCER')

    // Parse form data for file upload
    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const features = JSON.parse((formData.get('features') as string) || '[]')
    const templateFile = formData.get('templateFile') as File
    const previewImage = formData.get('previewImage') as File

    // Validate input
    const validation = validateCreateTemplate({
      title,
      description,
      category,
      price,
      features,
    })

    if (!validation.valid) {
      return errorResponse(400, 'Validation failed', validation.errors)
    }

    // Validate files
    if (!templateFile) {
      return errorResponse(400, 'Template file is required')
    }

    const fileValidation = validateFile(templateFile, { maxSize: 100 * 1024 * 1024 })
    if (!fileValidation.valid) {
      return errorResponse(400, fileValidation.error || 'File validation failed')
    }

    // Upload template file
    let templateUrl: string | undefined
    try {
      const templateUpload = await uploadToCloudinary(templateFile, {
        folder: 'altfaze/templates',
        tags: ['template', category],
      })
      templateUrl = templateUpload.url
    } catch (error) {
      return errorResponse(500, `Failed to upload template file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Upload preview image if provided
    let previewUrl: string | undefined
    if (previewImage) {
      const imageValidation = validateFile(previewImage, { 
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      })
      
      if (!imageValidation.valid) {
        return errorResponse(400, `Preview image invalid: ${imageValidation.error}`)
      }

      try {
        const previewUpload = await uploadToCloudinary(previewImage, {
          folder: 'altfaze/templates/previews',
          resource_type: 'image',
        })
        previewUrl = previewUpload.url
      } catch (error) {
        console.error('[PREVIEW_UPLOAD_ERROR]', error)
        // Don't fail if preview upload fails
      }
    }

    // Create template in DB
    const template = await db.template.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        price,
        features,
        image: previewUrl || templateUrl,
        uploaderId: userId,
      },
    })

    // Create custom metadata for file storage
    await db.activityLog.create({
      data: {
        userId,
        action: 'TEMPLATE_UPLOADED',
        description: `Uploaded template: "${title}" for $${price}`,
        templateId: template.id,
        metadata: {
          templateId: template.id,
          fileUrl: templateUrl,
          fileSize: templateFile.size,
        },
      },
    }).catch(err => {
      console.error('[TEMPLATE_CREATE] Activity log creation failed:', err)
      // Continue - activity log failure shouldn't block template creation
    })

    return successResponse(
      {
        id: template.id,
        title: template.title,
        description: template.description,
        category: template.category,
        price: template.price.toNumber(),
        image: template.image,
        features: template.features,
        createdAt: template.createdAt,
      },
      201,
      'Template uploaded successfully'
    )
  } catch (error) {
    console.error('[UPLOAD_TEMPLATE_ERROR]', error)
    return handleApiError(error)
  }
}
