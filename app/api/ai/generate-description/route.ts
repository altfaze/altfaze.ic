import { NextRequest } from 'next/server'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { generateProjectDescription, generateProposal, summarizeProposal } from '@/lib/ai'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/generate-description
 * Generate project description using AI
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req)
    const body = await req.json()
    const { projectTitle, requirements } = body

    if (!projectTitle || !requirements) {
      return errorResponse(400, 'Project title and requirements are required')
    }

    const description = await generateProjectDescription(projectTitle, requirements)

    return successResponse(
      { description },
      200,
      'Description generated successfully'
    )
  } catch (error) {
    console.error('[AI_DESCRIPTION_ERROR]', error)
    return handleApiError(error)
  }
}
