'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'

interface Client {
  id: string
  name: string
  email: string
  image: string | null
  username: string
  isVerified: boolean
  openProjectsCount: number
  completedTransactions: number
  joinedAt: string
}

interface ClientsResponse {
  success: boolean
  data: {
    clients: Client[]
    pagination: {
      page: number
      limit: number
      pages: number
      total: number
      hasMore: boolean
    }
  }
}

export default function FreelancerClientsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const limit = 12

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      let url = `/api/clients?page=${page}&limit=${limit}`

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }

      const json: ClientsResponse = await response.json()
      setClients(json.data?.clients || [])
    } catch (error) {
      console.error('[FETCH_CLIENTS_ERROR]', error)
      toast({
        title: 'Error',
        description: 'Failed to load clients. Please try again.',
        variant: 'destructive',
      })
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, limit, toast])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session?.user?.role !== 'FREELANCER') {
      toast({
        title: 'Access Denied',
        description: 'This page is for freelancers only.',
        variant: 'destructive',
      })
      router.push('/client/dashboard')
      return
    }
    fetchClients()
  }, [page, fetchClients, session, status, router, toast])

  if (status === 'loading' || (loading && page === 1)) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-72" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Clients</h1>
          <p className="text-muted-foreground">
            Find and connect with active clients who need your services
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search clients by name or username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="max-w-md"
          />
        </div>

        {/* Clients Grid */}
        {clients.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.image || ''} />
                        <AvatarFallback>
                          {client.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {client.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-1">{client.name}</CardTitle>
                    <CardDescription className="text-xs">@{client.username}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Open Projects</p>
                          <p className="text-xl font-bold text-blue-600">
                            {client.openProjectsCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completed</p>
                          <p className="text-xl font-bold text-green-600">
                            {client.completedTransactions}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Joined {new Date(client.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {clients.length >= limit && (
              <div className="flex justify-center gap-2 mb-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button variant="outline" disabled>
                  Page {page}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4 text-lg">
                {searchQuery
                  ? 'No clients match your search'
                  : 'No active clients available at the moment'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setPage(1)
                }}
              >
                {searchQuery ? 'Clear Search' : 'Back to Work'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
