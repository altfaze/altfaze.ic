'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'

const PRESETS = [10, 25, 50, 100, 250, 500]
const MIN_AMOUNT = 1
const MAX_AMOUNT = 50000

// Declare Razorpay script interface
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function AddFundsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Check for success message
  useEffect(() => {
    if (!searchParams) return
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Payment successful! Your wallet has been credited.')
      setTimeout(() => {
        router.push('/client/wallet')
      }, 2000)
    } else if (searchParams.get('cancelled') === 'true') {
      toast({
        title: 'Payment Cancelled',
        description: 'Your payment was cancelled. Please try again.',
        variant: 'destructive',
      })
    }
  }, [searchParams, router, toast])

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleCreateCheckout = async () => {
    const amountNum = parseFloat(amount)

    if (!amount || isNaN(amountNum)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      })
      return
    }

    if (amountNum < MIN_AMOUNT) {
      toast({
        title: 'Error',
        description: `Minimum amount is ₹${MIN_AMOUNT}`,
        variant: 'destructive',
      })
      return
    }

    if (amountNum > MAX_AMOUNT) {
      toast({
        title: 'Error',
        description: `Maximum amount is ₹${MAX_AMOUNT}`,
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // Create order via Razorpay API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create checkout session')
      }

      const data = await response.json()
      if (!data.data?.orderId) {
        throw new Error('No order created')
      }

      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        openRazorpayCheckout(data.data, amountNum)
      }
      document.head.appendChild(script)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment session',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openRazorpayCheckout = async (orderData: any, amount: number) => {
    if (!window.Razorpay) {
      toast({
        title: 'Error',
        description: 'Failed to load payment system',
        variant: 'destructive',
      })
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderData.orderId,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'ALTFaze',
      description: `Add ₹${amount} to wallet`,
      customer_id: orderData.customerId,
      prefill: {
        name: orderData.customerName,
        email: orderData.customerEmail,
      },
      handler: async (response: any) => {
        try {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (!verifyResponse.ok) {
            const error = await verifyResponse.json()
            throw new Error(error.message || 'Payment verification failed')
          }

          setSuccessMessage('Payment successful! Your wallet has been credited.')
          setTimeout(() => {
            router.push('/client/wallet')
          }, 2000)
        } catch (error) {
          toast({
            title: 'Payment Verification Failed',
            description: error instanceof Error ? error.message : 'Could not verify payment',
            variant: 'destructive',
          })
        }
      },
      modal: {
        ondismiss: () => {
          toast({
            title: 'Payment Cancelled',
            description: 'You cancelled the payment. Please try again.',
            variant: 'destructive',
          })
        },
      },
      theme: {
        color: '#3b82f6',
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  if (successMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Icons.check className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="text-2xl font-bold">Payment Successful</h2>
            <p className="text-muted-foreground">{successMessage}</p>
            <p className="text-sm text-muted-foreground">Redirecting to your wallet...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-2xl">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/client/wallet">← Back to Wallet</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Add Funds to Wallet</CardTitle>
            <CardDescription>Fund your wallet to purchase templates and pay for services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Presets */}
            <div>
              <label className="text-sm font-medium block mb-3">Quick Select</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? 'default' : 'outline'}
                    onClick={() => handleSelectAmount(preset)}
                    disabled={loading}
                    className="text-sm"
                  >
                    ₹{preset}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-medium block mb-2">Custom Amount</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                    step="1"
                    className="pl-7"
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Min: ₹{MIN_AMOUNT} • Max: ₹{MAX_AMOUNT}
              </p>
            </div>

              {/* Summary */}
              {amount && !isNaN(parseFloat(amount)) && (
                <Card className="bg-muted/50 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount to Add</span>
                        <span className="font-semibold">₹{parseFloat(amount).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-primary">₹{parseFloat(amount).toFixed(0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Button
                onClick={handleCreateCheckout}
                disabled={!amount || isNaN(parseFloat(amount)) || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Proceed to Payment (₹${amount ? parseFloat(amount).toFixed(0) : '0'})`
                )}
              </Button>

              {/* Trust Badges */}
              <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3 text-sm">
                  <svg className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Secure Payment Processing</p>
                    <p className="text-xs text-muted-foreground">All transactions encrypted with Razorpay</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <svg className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="font-medium">Instant Credit</p>
                    <p className="text-xs text-muted-foreground">Funds added immediately after payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <svg className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m4-6V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-4z" />
                  </svg>
                  <div>
                    <p className="font-medium">Multiple Payment Methods</p>
                    <p className="text-xs text-muted-foreground">Cards, wallets, and bank transfers</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <details className="cursor-pointer group">
                <summary className="font-medium text-sm flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded">
                  <span>FAQ</span>
                  <svg className="h-4 w-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </summary>
                <div className="space-y-3 mt-3 px-3 text-sm text-muted-foreground border-t pt-3">
                  <div>
                    <p className="font-medium text-foreground mb-1">How long does the payment take?</p>
                    <p>Payments are processed instantly through Razorpay. Your wallet will be credited right away.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Is my payment information safe?</p>
                    <p>Yes! All payments are processed securely through Razorpay&apos;s PCI-compliant platform.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Can I get a refund?</p>
                    <p>Refunds can be requested within 30 days of payment. Contact support for assistance.</p>
                  </div>
                </div>
              </details>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
