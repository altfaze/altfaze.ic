'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'

interface WalletData {
  wallet: {
    userId: string
    email: string
    name: string
    walletBalance: number
    totalSpent: number
    totalEarned: number
  }
  transactions: Array<{
    id: string
    type: string
    amount: number
    netAmount: number
    commission: number
    status: string
    description: string
    createdAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasMore: boolean
  }
}

interface WalletResponse {
  success: boolean
  data: WalletData
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  )
}

export default function FreelancerWalletPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 10

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch(`/api/wallet?page=${page}&limit=${limit}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch wallet')

      const json: WalletResponse = await res.json()
      setWallet(json.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [page, limit, toast])

  useEffect(() => {
    fetchWallet()
  }, [fetchWallet])

  if (loading) {
    return (
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-32 rounded-lg mb-8" />
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    )
  }

  const totalPages = wallet?.transactions ? Math.ceil(wallet.transactions.length / limit) : 1

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icons.wallet className="h-6 w-6" />
            <h1 className="text-4xl font-bold">Wallet & Earnings</h1>
          </div>
          <p className="text-muted-foreground">Manage your funds and track your earnings</p>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* Current Balance */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardDescription>Available Balance</CardDescription>
              <CardTitle className="text-3xl">${wallet?.wallet.walletBalance.toFixed(2) || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/freelancer/wallet/withdraw">Withdraw Funds</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Total Earned */}
          <Card>
            <CardHeader>
              <CardDescription>Total Earned</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                ${wallet?.wallet.totalEarned.toFixed(2) || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">From projects & templates</p>
            </CardContent>
          </Card>

          {/* Commission Paid */}
          <Card>
            <CardHeader>
              <CardDescription>Commission (5%)</CardDescription>
              <CardTitle className="text-2xl">
                ${((wallet?.wallet.totalEarned || 0) * 0.05).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Platform fee</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Earnings</p>
                  <p className="text-2xl font-bold">
                    ${((wallet?.wallet.totalEarned || 0) * 0.95).toFixed(2)}
                  </p>
                </div>
                <Icons.trendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${wallet?.wallet.totalSpent.toFixed(2) || 0}</p>
                </div>
                <Icons.creditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your earnings and withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            {wallet?.transactions && wallet.transactions.length > 0 ? (
              <div className="space-y-3">
                {wallet.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-start justify-between gap-4 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === 'EARNING' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'EARNING' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                        </p>
                        {tx.commission > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Commission: ${tx.commission.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icons.inbox className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete projects to start earning money
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center pt-4 mt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  size="sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 bg-muted">
          <CardHeader>
            <CardTitle>💡 How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>✓ Complete Projects:</strong> Earn 95% of the project amount. Altfaze takes 5% commission.
            </p>
            <p>
              <strong>✓ Sell Templates:</strong> Earn 70% of each template sale. Altfaze takes 30%.
            </p>
            <p>
              <strong>✓ Minimum Withdrawal:</strong> $50 minimum balance to request a withdrawal.
            </p>
            <p>
              <strong>✓ Payment Methods:</strong> Bank transfer, PayPal, or crypto wallet (coming soon).
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid gap-3 md:grid-cols-2 mt-8">
          {(wallet?.wallet.walletBalance || 0) >= 50 && (
            <Link href="/freelancer/wallet/withdraw">
              <Button className="w-full">
                <Icons.send className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
            </Link>
          )}
          <Link href="/freelancer/my-requests">
            <Button variant="outline" className="w-full">
              <Icons.briefcase className="h-4 w-4 mr-2" />
              Find More Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
