'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'


interface Request {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  amount: number
  dueDate: string | null
  sender: { id: string; name: string; email: string; image: string | null }
  receiver: { id: string; name: string; email: string; image: string | null }
  createdAt: string
  updatedAt: string
}

interface DashboardData {
  requests: Request[]
  totalRequests: number
  totalReceived: number
  totalAccepted: number
  totalCompleted: number
  totalEarned: number
  pagination: {
    page: number
    limit: number
    pages: number
    total: number
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800',
  }

  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  )
}

export default function FreelancerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/requests?type=received&limit=50')
        if (!res.ok) {
          throw new Error('Failed to fetch requests')
        }

        const result = await res.json()
        const requests = result.data.requests || []

        const stats = {
          totalRequests: result.data.pagination.total,
          totalReceived: requests.length,
          totalAccepted: requests.filter((r: Request) => r.status === 'ACCEPTED').length,
          totalCompleted: requests.filter((r: Request) => r.status === 'COMPLETED').length,
          totalEarned: requests
            .filter((r: Request) => r.status === 'COMPLETED')
            .reduce((sum: number, r: Request) => sum + (r.amount || 0), 0),
        }

        setData({
          requests,
          ...stats,
          pagination: result.data.pagination,
        })
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome, {session?.user?.name}! 🚀
          </h1>
          <p className="text-muted-foreground">
            ALTFaze Freelancer Dashboard - Manage your work and grow your income
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Requests</CardTitle>
              <div className="text-xl">📋</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalReceived || 0}</div>
              <p className="text-xs text-muted-foreground">Pending your decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <div className="text-xl">🎯</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalAccepted || 0}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="text-xl">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">Finished projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <div className="text-xl">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data?.totalEarned.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">From completed work</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Work Requests</CardTitle>
            <CardDescription>Review and accept work from clients</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
                {error}
              </div>
            )}

            {data?.requests && data.requests.length > 0 ? (
              <div className="space-y-4">
                {data.requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{request.title}</h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From: <strong>{request.sender.name}</strong> • {request.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Received {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {request.amount ? `$${request.amount.toFixed(2)}` : 'N/A'}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant={request.status === 'PENDING' ? 'default' : 'outline'}
                        className="mt-2 w-24"
                      >
                        <Link href={`/freelancer/requests/${request.id}`}>
                          {request.status === 'PENDING' ? 'Review' : 'View'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl text-muted-foreground mx-auto mb-4">📋</div>
                <p className="text-muted-foreground">No work requests yet</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Build your profile to start receiving requests
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">65% complete</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/freelancer/profile">Complete Your Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">$0.00</div>
                <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/freelancer/wallet">Manage Wallet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button asChild className="w-full">
                <Link href="/freelancer/profile">View Profile</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/freelancer/upload">Upload Work</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/freelancer/earnings">View Earnings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
