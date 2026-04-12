'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const PRESETS = [25, 50, 100, 250, 500]

export default function AddFundsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddFunds = async (value: number) => {
    setAmount(value.toString())
  }

  const handleCheckout = async () => {
    if (!amount || parseFloat(amount) < 5) {
      toast({
        title: 'Error',
        description: 'Minimum amount is $5',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // Create checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })

      if (!res.ok) throw new Error('Failed to create checkout session')

      const data = await res.json()
      const { sessionId, url } = data

      // If we have a Stripe URL, use it directly, otherwise fallback to session redirect
      if (url) {
        window.location.href = url
      } else if (sessionId) {
        // Redirect to Stripe checkout with session ID
        window.location.href = `/api/checkout?sessionId=${sessionId}`
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-2xl">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/wallet">← Back to Wallet</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Add Funds</CardTitle>
            <CardDescription>Add money to your wallet for purchasing templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Presets */}
            <div>
              <label className="text-sm font-medium block mb-3">Quick Amount</label>
              <div className="grid grid-cols-5 gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? 'default' : 'outline'}
                    onClick={() => handleAddFunds(preset)}
                    disabled={loading}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-medium block mb-2">Custom Amount</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="5"
                    step="0.01"
                    className="pl-6"
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Minimum: $5</p>
            </div>

            {/* Summary */}
            {amount && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-bold">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Button
              onClick={handleCheckout}
              disabled={!amount || loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : `Proceed to Payment ($${amount || '0.00'})`}
            </Button>

            {/* Info */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2 text-muted-foreground">
              <p>💳 <strong>Secure Payment</strong> - All transactions are processed securely through Stripe</p>
              <p>🔒 <strong>Instant Funds</strong> - Your wallet will be credited immediately after payment</p>
              <p>📱 <strong>Multiple Methods</strong> - Credit card, debit card, and digital wallets accepted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
