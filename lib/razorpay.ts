import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

// Only warn in development if keys are missing
if (!razorpayKeyId || !razorpayKeySecret) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Razorpay keys are not defined - Payment operations will fail')
  }
  // Don't throw error during build - let runtime handle it
}

// Initialize Razorpay instance (null if keys not available)
export const razorpay = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null

export const RAZORPAY_CONFIG = {
  keyId: razorpayKeyId || '',
  keySecret: razorpayKeySecret || '',
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  isConfigured: !!razorpayKeyId && !!razorpayKeySecret,
}

/**
 * Create a Razorpay order
 * Returns order details including order_id for frontend checkout
 */
export async function createOrder(params: {
  amount: number // Amount in INR (will be converted to paise)
  currency?: string // Default: INR
  receipt?: string // Unique receipt ID
  description?: string // Order description
  customerName?: string
  customerEmail?: string
  customerId?: string
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(params.amount * 100), // Convert to paise (smallest unit in INR)
      currency: params.currency || 'INR',
      receipt: params.receipt || `order_${Date.now()}`,
      notes: {
        description: params.description || 'ALTFaze Payment',
        customerName: params.customerName || '',
        customerEmail: params.customerEmail || '',
        customerId: params.customerId || '',
      },
    })

    return order
  } catch (error) {
    console.error('[RAZORPAY_ORDER_ERROR]', error)
    throw new Error('Failed to create Razorpay order')
  }
}

/**
 * Verify Razorpay payment signature
 * CRITICAL: Always verify on the backend before marking payment as successful
 * Uses HMAC SHA256 signature verification
 */
export function verifyPaymentSignature(params: {
  orderId: string // razorpay_order_id
  paymentId: string // razorpay_payment_id
  signature: string // razorpay_signature
}): boolean {
  if (!razorpayKeySecret) {
    console.error('[RAZORPAY_VERIFICATION_ERROR] Key secret is not configured')
    return false
  }

  try {
    // Create HMAC SHA256 hash
    const message = `${params.orderId}|${params.paymentId}`
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(message)
      .digest('hex')

    // Verify by comparing signatures
    const isValid = generatedSignature === params.signature

    if (!isValid) {
      console.warn('[RAZORPAY_VERIFICATION_FAILED]', {
        expected: generatedSignature,
        received: params.signature,
      })
    }

    return isValid
  } catch (error) {
    console.error('[RAZORPAY_VERIFICATION_ERROR]', error)
    return false
  }
}

/**
 * Fetch payment details from Razorpay
 * Use this to get payment status and details
 */
export async function getPayment(paymentId: string): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error('[RAZORPAY_PAYMENT_FETCH_ERROR]', error)
    throw new Error('Failed to fetch payment details')
  }
}

/**
 * Fetch order details from Razorpay
 * Use this to get order status and payment attempts
 */
export async function getOrder(orderId: string): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const order = await razorpay.orders.fetch(orderId)
    return order
  } catch (error) {
    console.error('[RAZORPAY_ORDER_FETCH_ERROR]', error)
    throw new Error('Failed to fetch order details')
  }
}

/**
 * Capture a payment that was authorized
 * Note: Razorpay auto-captures by default, but this allows manual capture if needed
 */
export async function capturePayment(params: {
  paymentId: string
  amount: number // Amount in paise
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const captured = await razorpay.payments.capture(params.paymentId, params.amount, 'INR')
    return captured
  } catch (error) {
    console.error('[RAZORPAY_CAPTURE_ERROR]', error)
    throw new Error('Failed to capture payment')
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(params: {
  paymentId: string
  amount?: number // Amount in paise (partial refund), leave empty for full refund
  notes?: Record<string, string>
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const refund = await razorpay.payments.refund(
      params.paymentId,
      {
        amount: params.amount,
        notes: params.notes,
      }
    )
    return refund
  } catch (error) {
    console.error('[RAZORPAY_REFUND_ERROR]', error)
    throw new Error('Failed to refund payment')
  }
}

/**
 * Get all payments for an order
 */
export async function getOrderPayments(orderId: string): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const payments = await razorpay.orders.fetchPayments(orderId)
    return payments
  } catch (error) {
    console.error('[RAZORPAY_ORDER_PAYMENTS_ERROR]', error)
    throw new Error('Failed to fetch order payments')
  }
}

/**
 * Create a Razorpay customer
 * This creates a customer in Razorpay and returns the customer_id
 * Used to link user accounts with Razorpay for recurring payments and invoicing
 */
export async function createCustomer(params: {
  name: string
  email: string
  contact?: string
  gstin?: string
  notes?: Record<string, string>
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const customer = await razorpay.customers.create({
      name: params.name,
      email: params.email,
      contact: params.contact,
      gstin: params.gstin,
      notes: params.notes || {},
    })
    return customer
  } catch (error) {
    console.error('[RAZORPAY_CUSTOMER_CREATE_ERROR]', error)
    throw new Error('Failed to create Razorpay customer')
  }
}

/**
 * Fetch a Razorpay customer by customer_id
 */
export async function getCustomer(customerId: string): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const customer = await razorpay.customers.fetch(customerId)
    return customer
  } catch (error) {
    console.error('[RAZORPAY_CUSTOMER_FETCH_ERROR]', error)
    throw new Error('Failed to fetch customer details')
  }
}

/**
 * Update a Razorpay customer
 */
export async function updateCustomer(customerId: string, params: {
  name?: string
  email?: string
  contact?: string
  gstin?: string
  notes?: Record<string, string>
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const customer = await razorpay.customers.edit(customerId, params)
    return customer
  } catch (error) {
    console.error('[RAZORPAY_CUSTOMER_UPDATE_ERROR]', error)
    throw new Error('Failed to update customer')
  }
}

/**
 * Create a Razorpay contact (used for payouts)
 * This creates a contact entity for receiving payments via payout
 */
export async function createContact(params: {
  name: string
  email?: string
  type: 'customer' | 'vendor' | 'employee'
  notes?: Record<string, string>
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const contact = await (razorpay as any).contacts.create({
      name: params.name,
      email: params.email,
      type: params.type,
      notes: params.notes || {},
    })
    return contact
  } catch (error) {
    console.error('[RAZORPAY_CONTACT_CREATE_ERROR]', error)
    throw new Error('Failed to create Razorpay contact')
  }
}

/**
 * Create a fund account for a contact (used for payouts)
 * This creates a bank account or VPA associated with a contact
 */
export async function createFundAccount(params: {
  contactId: string
  accountType: 'bank_account' | 'vpa'
  bankAccount?: {
    name: string
    notes?: Record<string, string>
    ifsc: string
    accountNumber: string
  }
  vpa?: {
    address: string
  }
}): Promise<any> {
  if (!razorpay) {
    throw new Error('Razorpay is not configured')
  }

  try {
    const fundAccount = await (razorpay as any).fundAccount.create({
      contactId: params.contactId,
      accountType: params.accountType,
      bankAccount: params.bankAccount,
      vpa: params.vpa,
    })
    return fundAccount
  } catch (error) {
    console.error('[RAZORPAY_FUND_ACCOUNT_CREATE_ERROR]', error)
    throw new Error('Failed to create fund account')
  }
}
