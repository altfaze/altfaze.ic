/**
 * Request/Bid validation schemas
 */

export interface CreateRequestInput {
  projectId: string
  proposal: string
  bidAmount: number
}

export function validateCreateRequest(data: unknown): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  const input = data as any

  // Validate projectId
  if (!input.projectId || typeof input.projectId !== 'string') {
    errors.projectId = 'Project ID is required'
  }

  // Validate proposal
  if (!input.proposal || typeof input.proposal !== 'string') {
    errors.proposal = 'Proposal is required'
  } else if (input.proposal.trim().length < 20) {
    errors.proposal = 'Proposal must be at least 20 characters'
  } else if (input.proposal.trim().length > 5000) {
    errors.proposal = 'Proposal must be less than 5000 characters'
  }

  // Validate bidAmount
  const bidAmount = parseFloat(input.bidAmount)
  if (isNaN(bidAmount) || bidAmount < 0.5) {
    errors.bidAmount = 'Bid amount must be at least $0.50'
  } else if (bidAmount > 999999999) {
    errors.bidAmount = 'Bid amount exceeds maximum limit'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
