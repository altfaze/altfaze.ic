'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Request {
  id: string
  title: string
  description: string
  status: string
  budget: number
  dueDate: string
  createdAt: string
  freelancer: {
    id: string
    name: string
    image: string | null
    freelancer: {
      hourlyRate: number
    }
  }
}

interface RequestsResponse {
  success: boolean
  data: {
    requests: Request[]
    pagination: { page: number; total: number }
  }
}

export default function ClientRequestsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/requests?type=sent&page=${page}&limit=${limit}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch requests')

      const json: RequestsResponse = await res.json()
      setRequests(json.data.requests)
      setTotal(json.data.pagination.total)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load requests',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [page, limit, toast])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleCancel = async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to cancel request')

      toast({ title: 'Success', description: 'Request cancelled' })
      fetchRequests()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel request',
        variant: 'destructive',
      })
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const pages = Math.ceil(total / limit)

  if (loading) {
    return (
      <div className="container py-12 max-w-4xl">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg mb-4" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sent Requests</h1>
          <p className="text-muted-foreground">Track your project requests to freelancers</p>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-4 mb-8">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={request.freelancer.image || undefined} />
                          <AvatarFallback>{request.freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            to {request.freelancer.name}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {request.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline">${request.budget}</Badge>
                        <Badge variant="outline">
                          Due {new Date(request.dueDate).toLocaleDateString()}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {request.status === 'PENDING' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(request.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {request.status === 'ACCEPTED' && (
                        <Button size="sm" asChild>
                          <Link href={`/freelancers/${request.freelancer.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">No requests sent yet</p>
              <Button asChild>
                <Link href="/freelancers">Browse Freelancers</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            {[...Array(pages)].map((_, i) => (
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
              disabled={page === pages}
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
