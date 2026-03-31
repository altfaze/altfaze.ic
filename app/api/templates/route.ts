import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, ValidationError } from '@/lib/api'
import { logTemplateView, logTemplatePurchase } from '@/lib/activity'

/**
 * GET /api/templates
 * Get templates (browse all or filter by category)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuthWithRole(req)

    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Build where clause
    let where: any = {}

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const templates = await db.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await db.template.count({ where })

    // Log template views for each template
    const templateIds = templates.map((t) => t.id)
    for (const templateId of templateIds) {
      await logTemplateView(userId, templateId, templates.find((t) => t.id === templateId)?.title)
    }

    return successResponse(
      {
        templates: templates.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          price: t.price?.toNumber() || 0,
          image: t.image,
          features: t.features,
          createdAt: t.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          hasMore: offset + limit < total,
        },
      },
      200,
      'Templates retrieved'
    )
  } catch (error) {
    console.error('Get templates error:', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/templates
 * Create new template (FREELANCER only)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthWithRole(req, 'FREELANCER')
    if (!auth) throw new ValidationError('Only freelancers can upload templates')

    const { userId } = auth
    const body = await req.json()
    const { title, description, category, price, features, image } = body

    // Validation
    if (!title) throw new ValidationError('Title is required')
    if (!description) throw new ValidationError('Description is required')
    if (!category) throw new ValidationError('Category is required')
    if (!price || price <= 0) throw new ValidationError('Valid price is required')

    const priceNum = parseFloat(price)
    if (priceNum > 999999999) throw new ValidationError('Price exceeds maximum limit')

    // Create template
    const template = await db.template.create({
      data: {
        title,
        description,
        category,
        price: priceNum,
        image: image || null,
        features: Array.isArray(features) ? features : [],
      },
    })

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
      },
      201,
      'Template created'
    )
  } catch (error) {
    console.error('Create template error:', error)
    return handleApiError(error)
  }
}

/**
 * POST /api/templates/:id/purchase
 * Purchase a template (CLIENT only)
 */
export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuthWithRole(req, 'CLIENT')
    if (!auth) throw new ValidationError('Only clients can purchase templates')

    const { userId } = auth
    const body = await req.json()
    const { templateId } = body

    if (!templateId) throw new ValidationError('templateId is required')

    // Get template
    const template = await db.template.findUnique({
      where: { id: templateId },
    })

    if (!template) throw new ValidationError('Template not found')

    const price = template.price?.toNumber() || 0

    // Check client balance
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) throw new ValidationError('User not found')

    const balance = user.walletBalance?.toNumber() || 0
    if (balance < price) {
      throw new ValidationError(
        `Insufficient balance. Need ₹${price}, but you have ₹${balance}`
      )
    }

    // Process purchase
    await db.$transaction(async (tx) => {
      // Deduct from client wallet
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { decrement: price },
          totalSpent: { increment: price },
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: userId,
          type: 'PAYMENT',
          amount: price,
          status: 'COMPLETED',
          description: `Purchased template: ${template.title}`,
          templateId: templateId,
          senderId: userId,
          metadata: {
            templateTitle: template.title,
            templateCategory: template.category,
          },
        },
      })

      // Log purchase activity
      await logTemplatePurchase(userId, templateId, price, template.title)
    })

    return successResponse(
      {
        success: true,
        templateId,
        price,
        message: `Template purchased successfully`,
      },
      200,
      'Template purchased'
    )
  } catch (error) {
    console.error('Purchase template error:', error)
    return handleApiError(error)
  }
}
