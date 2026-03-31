import { db } from './db'

export type ActivityAction =
  | 'TEMPLATE_VIEWED'
  | 'TEMPLATE_PURCHASED'
  | 'PROJECT_CREATED'
  | 'PROJECT_ACCEPTED'
  | 'REQUEST_SENT'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_REJECTED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_REFUNDED'
  | 'WITHDRAWAL_REQUESTED'
  | 'PROFILE_UPDATED'
  | 'RATING_GIVEN'
  | 'PROPOSAL_SUBMITTED'

/**
 * Log user activity
 * Used to track all user actions for analytics and audit trails
 */
export async function logActivity(
  userId: string,
  action: ActivityAction,
  description?: string,
  metadata?: Record<string, any>
) {
  try {
    await db.activityLog.create({
      data: {
        userId,
        action,
        description,
        metadata,
      },
    })
  } catch (error) {
    // Silently fail - don't break the main operation if logging fails
    console.error(`Failed to log activity: ${action}`, error)
  }
}

/**
 * Log template view
 */
export async function logTemplateView(userId: string, templateId: string, templateTitle?: string) {
  await logActivity(
    userId,
    'TEMPLATE_VIEWED',
    `Viewed template: ${templateTitle || templateId}`,
    { templateId }
  )
}

/**
 * Log template purchase
 */
export async function logTemplatePurchase(
  userId: string,
  templateId: string,
  amount: number,
  templateTitle?: string
) {
  await logActivity(
    userId,
    'TEMPLATE_PURCHASED',
    `Purchased template: ${templateTitle || templateId} for ${amount}`,
    { templateId, amount }
  )
}

/**
 * Log project creation
 */
export async function logProjectCreation(userId: string, projectId: string, projectTitle?: string) {
  await logActivity(
    userId,
    'PROJECT_CREATED',
    `Created project: ${projectTitle || projectId}`,
    { projectId }
  )
}

/**
 * Log project acceptance
 */
export async function logProjectAcceptance(userId: string, projectId: string, projectTitle?: string) {
  await logActivity(
    userId,
    'PROJECT_ACCEPTED',
    `Accepted project: ${projectTitle || projectId}`,
    { projectId }
  )
}

/**
 * Log payment completion
 */
export async function logPaymentCompletion(
  userId: string,
  amount: number,
  description?: string,
  transactionId?: string
) {
  await logActivity(
    userId,
    'PAYMENT_COMPLETED',
    description || `Payment completed for ${amount}`,
    { amount, transactionId }
  )
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(userId: string, limit: number = 50, offset: number = 0) {
  return await db.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}
