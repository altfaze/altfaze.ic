'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/icons'

interface Offer {
  id: string
  title: string
  description: string
  amount: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  sender: {
    id: string
    name: string
    email: string
    image: string | null
  }
  receiver: {
    id: string
    name: string
    email: string
    image: string | null
  }
  createdAt: string
  updatedAt: string
}

interface OffersResponse {
  success: boolean
  data: {
    offers: Offer[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  }

  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  )
}

export default function OffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('received')
  const [offersByTab, setOffersByTab] = useState<{ received: Offer[]; sent: Offer[] }>({ received: [], sent: [] })
  const [totalByTab, setTotalByTab] = useState<{ received: number; sent: number }>({ received: 0, sent: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const limit = 10

  const fetchOffers = useCallback(async (tab: string, pageNum: number) => {
    try {
      setLoading(true)
      const type = tab === 'sent' ? 'sent' : 'received'
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: pageNum.toString(),
        type,
      })

      const res = await fetch(`/api/offers?${params}`, {
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch offers')
      }

      const json: OffersResponse = await res.json()
      
      // Safety check for undefined data
      const offersData = json?.data?.offers || []
      const totalData = json?.data?.pagination?.total || 0

      setOffersByTab(prev => ({
        ...prev,
        [tab]: offersData
      }))
      setTotalByTab(prev => ({
        ...prev,
        [tab]: totalData
      }))
    } catch (error) {
      console.error('Failed to load offers:', error)
      toast({
        title: 'Error',
        description: 'Failed to load offers',
        variant: 'destructive',
      })
      // Set empty state on error
      setOffersByTab(prev => ({
        ...prev,
        [tab]: []
      }))
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPage(1)
    fetchOffers(tab, 1)
  }

  // Initial fetch
  useEffect(() => {
    fetchOffers('received', 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch when page changes for current tab
  useEffect(() => {
    if (page > 1) {
      fetchOffers(activeTab, page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab])

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      })

      if (!res.ok) {
        throw new Error('Failed to accept offer')
      }

      toast({
        title: 'Success',
        description: 'Offer accepted successfully',
      })

      // Refresh current tab
      fetchOffers(activeTab, page)
    } catch (error) {
      console.error('Error accepting offer:', error)
      toast({
        title: 'Error',
        description: 'Failed to accept offer',
        variant: 'destructive',
      })
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      })

      if (!res.ok) {
        throw new Error('Failed to reject offer')
      }

      toast({
        title: 'Success',
        description: 'Offer rejected',
      })

      // Refresh current tab
      fetchOffers(activeTab, page)
    } catch (error) {
      console.error('Error rejecting offer:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject offer',
        variant: 'destructive',
      })
    }
  }

  if (loading && offersByTab[activeTab as keyof typeof offersByTab]?.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const currentOffers = offersByTab[activeTab as keyof typeof offersByTab] || []
  const currentTotal = totalByTab[activeTab as keyof typeof totalByTab] || 0
  const pages = Math.ceil(currentTotal / limit)
  const emptyState = currentOffers.length === 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icons.gift className="h-6 w-6" />
            <h1 className="text-4xl font-bold">Offers</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your project offers and proposals
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList>
            <TabsTrigger value="received">Received ({currentTotal})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({totalByTab.sent || 0})</TabsTrigger>
          </TabsList>

          {/* Received Offers */}
          <TabsContent value="received" className="space-y-4 mt-6">
            {emptyState ? (
              <Card className="text-center py-12">
                <Icons.inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No offers received yet</p>
                <Link href="/freelancer/my-requests">
                  <Button>View Job Opportunities</Button>
                </Link>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {currentOffers.map((offer) => (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-10 w-10 mt-1">
                              <AvatarImage src={offer.sender?.image || undefined} alt={offer.sender?.name} />
                              <AvatarFallback>{offer.sender?.name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg">{offer.title || 'Untitled Offer'}</CardTitle>
                              <CardDescription>
                                from{' '}
                                <span className="text-primary hover:underline">
                                  {offer.sender?.name || 'Unknown'}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <StatusBadge status={offer.status} />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {offer.description || 'No description provided'}
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-lg font-bold">${(offer.amount || 0).toFixed(2)}</p>
                          </div>
                          <div className="flex-1" />
                          <div className="text-xs text-muted-foreground">
                            {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>

                        {offer.status === 'PENDING' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleRejectOffer(offer.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => handleAcceptOffer(offer.id)}
                            >
                              Accept Offer
                            </Button>
                          </div>
                        )}

                        {offer.status !== 'PENDING' && (
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(pages, page + 1))}
                      disabled={page === pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Sent Offers */}
          <TabsContent value="sent" className="space-y-4 mt-6">
            {!offersByTab.sent?.length ? (
              <Card className="text-center py-12">
                <Icons.send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No offers sent yet</p>
                <Link href="/client/hire">
                  <Button>Find Projects</Button>
                </Link>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {offersByTab.sent.map((offer) => (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-10 w-10 mt-1">
                              <AvatarImage src={offer.receiver?.image || undefined} alt={offer.receiver?.name} />
                              <AvatarFallback>{offer.receiver?.name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg">{offer.title || 'Untitled Offer'}</CardTitle>
                              <CardDescription>
                                to{' '}
                                <span className="text-primary hover:underline">
                                  {offer.receiver?.name || 'Unknown'}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <StatusBadge status={offer.status} />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {offer.description || 'No description provided'}
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-lg font-bold">${(offer.amount || 0).toFixed(2)}</p>
                          </div>
                          <div className="flex-1" />
                          <div className="text-xs text-muted-foreground">
                            {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination for sent */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(pages, page + 1))}
                      disabled={page === pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
