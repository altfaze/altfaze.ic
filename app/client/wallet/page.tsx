'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

interface WalletData {
  user: {
    id: string
    name: string
    walletBalance: number
  }
  transactions: Array<{
    id: string
    type: string
    amount: number
    description: string
    status: string
    createdAt: string
  }>
  stats: {
    totalSpent: number
    totalEarned: number
    thisMonth: number
  }
}

interface WalletResponse {
  success: boolean
  data: WalletData
}

export default function WalletPage() {
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
          <h1 className="text-4xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your account balance and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {/* Current Balance */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardDescription>Current Balance</CardDescription>
              <CardTitle className="text-3xl">${wallet?.user.walletBalance.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/client/wallet/add-funds">Add Funds</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-2">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${wallet?.stats.thisMonth.toFixed(2)}</p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-lg font-bold">${wallet?.stats.totalSpent.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Total Earned</p>
                  <p className="text-lg font-bold text-green-600">${wallet?.stats.totalEarned.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            {wallet?.transactions && wallet.transactions.length > 0 ? (
              <div className="space-y-3">
                {wallet.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={tx.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                      <p className={`font-semibold text-sm min-w-fit ${
                        tx.type === 'CREDIT' || tx.type === 'COMMISSION' || tx.type === 'REFUND'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {tx.type === 'CREDIT' || tx.type === 'COMMISSION' || tx.type === 'REFUND' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? 'default' : 'outline'}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
