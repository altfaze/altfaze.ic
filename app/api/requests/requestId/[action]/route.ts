import { NextRequest } from 'next/server'
import { requireAuth, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit } from '@/lib/rate-limit'
import * as requestService from '@/lib/services/requestService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/requests/[requestId]/[action]
 * Perform actions on requests: accept, reject
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { requestId: string; action: string } }
) {
  try {
    const isRateLimited = !(await rateLimit(req, 'request-action'))
    if (isRateLimited) {
      return errorResponse(429, 'Rate limited')
    }

    const { userId } = await requireAuth(req)
    const { action } = params

    if (action === 'accept') {
      const result = await requestService.acceptRequest(params.requestId, userId)
      return successResponse(result, 200, 'Request accepted')
    }

    if (action === 'reject') {
      const result = await requestService.rejectRequest(params.requestId, userId)
      return successResponse(result.request, 200, 'Request rejected')
    }

    return errorResponse(400, 'Invalid action')
  } catch (error) {
    console.error('[REQUEST_ACTION]', error)
    return handleApiError(error)
  }
}
