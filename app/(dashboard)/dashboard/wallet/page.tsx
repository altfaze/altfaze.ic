"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/more-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface WalletData {
  balance: number
  totalSpent: number
  totalEarned: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  netAmount?: number
  commission?: number
  status: string
  description: string
  createdAt: string
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/wallet?limit=20`)
        
        if (res.ok) {
          const data = await res.json()
          setWallet(data.data?.wallet)
          setTransactions(data.data?.transactions || [])
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  const filteredTransactions = transactions.filter(t =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'COMPLETED': 'default',
      'PENDING': 'secondary',
      'FAILED': 'destructive',
      'REFUNDED': 'outline',
    }
    return <Badge variant={statusMap[status] || 'outline'}>{status}</Badge>
  }

  const getTypeColor = (type: string) => {
    if (type === 'CREDIT' || type === 'EARNING') return 'text-green-600'
    if (type === 'DEBIT' || type === 'PAYMENT') return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet & Payments</h1>
        <p className="text-muted-foreground mt-2">Manage your balance, transactions, and withdrawals</p>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Icons.wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</div>
                <p className="text-xs text-muted-foreground">Available to withdraw</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Icons.trendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(wallet?.totalEarned || 0)}</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Icons.trendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(wallet?.totalSpent || 0)}</div>
                <p className="text-xs text-muted-foreground">Lifetime spending</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Section */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Earnings</CardTitle>
          <CardDescription>Transfer your earnings to your bank account or payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Available Balance:</strong> {formatCurrency(wallet?.balance || 0)}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Withdrawals are processed within 2-3 business days to your registered bank account.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter amount to withdraw"
                className="w-40"
                disabled
              />
              <Button disabled className="gap-2">
                <Icons.send className="h-4 w-4" />
                Request Withdrawal
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: ₹100 | Withdrawal fee: None
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your payments and earnings ({transactions.length} transactions)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search transaction ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Transactions List */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Icons.inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <Card key={tx.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${tx.type === 'CREDIT' || tx.type === 'EARNING' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                        {tx.type === 'CREDIT' || tx.type === 'EARNING' ? 
                          <Icons.arrowDown className={`h-4 w-4 ${getTypeColor(tx.type)}`} /> : 
                          <Icons.arrowUp className={`h-4 w-4 ${getTypeColor(tx.type)}`} />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${getTypeColor(tx.type)}`}>{tx.type}</p>
                          {getStatusBadge(tx.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(tx.amount)}</p>
                      {tx.commission && <p className="text-xs text-muted-foreground">Commission: {formatCurrency(tx.commission)}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Icons.help className="h-4 w-4" />
              About Our Payment Process
            </h4>
            <p className="text-sm text-muted-foreground">
              Platform commission is 5% on each transaction. All withdrawals are processed to your registered bank account within 2-3 business days.
            </p>
          </div>
          <Button variant="outline" className="w-full gap-2">
            <Icons.mail className="h-4 w-4" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
