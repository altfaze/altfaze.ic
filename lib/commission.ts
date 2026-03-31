/**
 * Commission Utilities for ATXEP Platform
 * Platform takes 5% commission on all transactions
 */

export const COMMISSION_RATE = 0.05 // 5%

/**
 * Calculate commission from total amount
 * Example: $1000 → $50 commission (5%)
 */
export const calculateCommission = (totalAmount: number): number => {
  return Math.round((totalAmount * COMMISSION_RATE) * 100) / 100
}

/**
 * Calculate net amount after commission
 * Example: $1000 → $950 net (after 5% commission)
 */
export const calculateNetAmount = (totalAmount: number): number => {
  return Math.round((totalAmount * (1 - COMMISSION_RATE)) * 100) / 100
}

/**
 * Validate amount is a positive number
 */
export const validateAmount = (amount: any): { valid: boolean; error?: string } => {
  const num = parseFloat(amount)
  if (isNaN(num)) {
    return { valid: false, error: 'Amount must be a valid number' }
  }
  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }
  if (num > 999999999) {
    return { valid: false, error: 'Amount exceeds maximum limit' }
  }
  return { valid: true }
}

/**
 * Create transaction breakdown for display
 */
export const getTransactionBreakdown = (totalAmount: number) => {
  const commission = calculateCommission(totalAmount)
  const netAmount = calculateNetAmount(totalAmount)

  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    commission,
    netAmount,
    commissionPercentage: (COMMISSION_RATE * 100).toString(),
  }
}

/**
 * Validate wallet balance is sufficient
 */
export const validateSufficientBalance = (
  currentBalance: number,
  requiredAmount: number
): { valid: boolean; shortfall?: number } => {
  if (currentBalance < requiredAmount) {
    return { valid: false, shortfall: requiredAmount - currentBalance }
  }
  return { valid: true }
}
