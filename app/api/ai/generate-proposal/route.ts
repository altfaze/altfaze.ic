import { NextRequest } from 'next/server'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'
import { generateProposal } from '@/lib/ai'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/generate-proposal
 * Generate proposal using AI
 */
export async function POST(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'FREELANCER')
    const body = await req.json()
    const { projectTitle, projectDescription, freelancerProfile } = body

    if (!projectTitle || !projectDescription || !freelancerProfile) {
      return errorResponse(400, 'All fields are required')
    }

    const proposal = await generateProposal(projectTitle, projectDescription, freelancerProfile)

    return successResponse(
      { proposal },
      200,
      'Proposal generated successfully'
    )
  } catch (error) {
    console.error('[AI_PROPOSAL_ERROR]', error)
    return handleApiError(error)
  }
}
