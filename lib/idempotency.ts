/**
 * Idempotency Key Utility
 * Prevents duplicate payments when users retry requests
 * 
 * NOTE: IdempotencyKey model not defined in schema - feature disabled
 */

import { db } from '@/lib/db'

export interface IdempotencyRecord {
  idempotencyKey: string
  method: string
  path: string
  response: any
  createdAt: Date
  expiresAt: Date
}

const IDEMPOTENCY_EXPIRY_HOURS = 24

/**
 * Get cached response for idempotency key
 * NOTE: Disabled - IdempotencyKey model not in schema
 */
export async function getIdempotencyResponse(
  idempotencyKey: string,
  method: string,
  path: string
): Promise<any | null> {
  try {
    // Feature disabled
    return null
  } catch (error) {
    console.error('[IDEMPOTENCY_ERROR]', error)
    return null
  }
}

/**
 * Store response for idempotency key
 * NOTE: Disabled - IdempotencyKey model not in schema
 */
export async function storeIdempotencyResponse(
  idempotencyKey: string,
  method: string,
  path: string,
  response: any
): Promise<void> {
  // Feature disabled
}

/**
 * Clean up expired idempotency keys
 * NOTE: Disabled - IdempotencyKey model not in schema
 */
export async function cleanupExpiredIdempotencyKeys(): Promise<void> {
  // Feature disabled
}
