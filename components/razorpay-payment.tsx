'use client'

import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import axios from 'axios'

// Razorpay script declaration
declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayPaymentProps {
  freelancerId: string
  amount: number
  projectId?: string
  templateId?: string
  description?: string
  onSuccess?: (transactionId: string, paymentId: string, orderId: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * RazorpayPayment Component
 * 
 * Production-ready payment component for Razorpay integration
 * 
 * Features:
 * - Dynamically loads Razorpay checkout script
 * - Creates order on backend
 * - Verifies payment signature on backend (CRITICAL for security)
 * - Shows loading and error states
 * - Handles all edge cases
 * 
 * Usage:
 * <RazorpayPayment
 *   freelancerId="user-id"
 *   amount={1000}
 *   description="Payment for project"
 *   onSuccess={(transactionId, paymentId, orderId) => {
 *     console.log('Payment successful')
 *   }}
 * >
 *   Pay Now
 * </RazorpayPayment>
 */
export function RazorpayPayment({
  freelancerId,
  amount,
  projectId,
  templateId,
  description = 'Payment',
  onSuccess,
  onError,
  disabled = false,
  className,
  children = 'Pay Now',
}: RazorpayPaymentProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadScript = () => {
      // Check if already loaded
      if (window.Razorpay) {
        setScriptLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => setScriptLoaded(true)
      script.onerror = () => {
        console.error('Failed to load Razorpay script')
        toast({
          title: 'Error',
          description: 'Failed to load payment gateway. Please refresh and try again.',
          variant: 'destructive',
        })
      }
      document.body.appendChild(script)
    }

    loadScript()
  }, [toast])

  /**
   * Step 1: Create order on backend
   */
  const createOrder = useCallback(async () => {
    try {
      setLoading(true)

      const response = await axios.post('/api/razorpay/order', {
        amount,
        freelancerId,
        projectId,
        templateId,
        description,
      })

      const { orderId, keyId, customerName, customerEmail } = response.data.data

      if (!orderId || !keyId) {
        throw new Error('Failed to create payment order')
      }

      return { orderId, keyId, customerName, customerEmail }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create payment order'
      console.error('[ORDER_CREATION_ERROR]', error)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      onError?.(errorMessage)
      setLoading(false)
      throw error
    }
  }, [amount, freelancerId, projectId, templateId, description, toast, onError])

  /**
   * Step 2: Verify payment on backend (CRITICAL)
   * Never trust frontend payment success - always verify signature
   */
  const verifyPayment = useCallback(
    async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
      try {
        const response = await axios.post('/api/razorpay/verify', {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        })

        const { transactionId, success } = response.data.data

        if (!success) {
          throw new Error('Payment verification failed')
        }

        return transactionId
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Payment verification failed'
        console.error('[PAYMENT_VERIFICATION_ERROR]', error)
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
        onError?.(errorMessage)
        throw error
      }
    },
    [toast, onError]
  )

  /**
   * Step 3: Handle payment success
   */
  const handlePaymentSuccess = useCallback(
    async (response: any) => {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response

        // Verify on backend
        const transactionId = await verifyPayment(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        )

        toast({
          title: 'Success',
          description: 'Payment completed successfully!',
        })

        onSuccess?.(transactionId, razorpay_payment_id, razorpay_order_id)
      } catch (error: any) {
        console.error('[PAYMENT_SUCCESS_ERROR]', error)
      } finally {
        setLoading(false)
      }
    },
    [verifyPayment, toast, onSuccess]
  )

  /**
   * Step 4: Handle payment failure
   */
  const handlePaymentError = useCallback(
    (error: any) => {
      console.error('[PAYMENT_ERROR]', error)
      const errorMessage = error.description || 'Payment failed. Please try again.'
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'destructive',
      })

      onError?.(errorMessage)
      setLoading(false)
    },
    [toast, onError]
  )

  /**
   * Main payment handler
   */
  const handlePayment = useCallback(async () => {
    if (!scriptLoaded) {
      toast({
        title: 'Error',
        description: 'Payment gateway is still loading. Please try again.',
        variant: 'destructive',
      })
      return
    }

    if (!window.Razorpay) {
      toast({
        title: 'Error',
        description: 'Payment gateway not available. Please refresh and try again.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)

      // Step 1: Create order
      const { orderId, keyId, customerName, customerEmail } = await createOrder()

      // Step 2: Open Razorpay Checkout
      const razorpayOptions = {
        key: keyId, // Razorpay Key ID
        order_id: orderId, // Order ID
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'ALTFaze',
        description: description,
        customer_details: {
          name: customerName,
          email: customerEmail,
        },
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: '#3b82f6', // Blue color, adjust to your brand
        },
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: () => {
            toast({
              title: 'Cancelled',
              description: 'Payment was cancelled.',
            })
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(razorpayOptions)
      razorpay.on('payment.failed', handlePaymentError)
      razorpay.open()
    } catch (error: any) {
      console.error('[PAYMENT_HANDLER_ERROR]', error)
      setLoading(false)
    }
  }, [scriptLoaded, createOrder, handlePaymentSuccess, handlePaymentError, amount, description, toast])

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !scriptLoaded}
      className={className}
    >
      {loading ? 'Processing...' : children}
    </Button>
  )
}

export default RazorpayPayment
