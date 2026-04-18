'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Offer {
  id: string
  title: string
  description?: string
  amount: number
  status: string
  expiresAt: string
  sender: { id: string; name: string; image?: string }
  receiver: { id: string; name: string; image?: string }
  createdAt: string
}

export default function ClientOffersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('received')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchOffers()
    }
  }, [status, router])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/offers?type=received`)
      if (!response.ok) throw new Error('Failed to fetch offers')
      const data = await response.json()
      setOffers(data.data || [])
      setError('')
    } catch (err) {
      console.error('[FETCH_OFFERS]', err)
      setError('Failed to load offers')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to accept offer')
      fetchOffers() // Refresh
      alert('Offer accepted! Order created.')
    } catch (err) {
      console.error('[ACCEPT_OFFER]', err)
      alert('Failed to accept offer')
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to reject offer')
      fetchOffers() // Refresh
    } catch (err) {
      console.error('[REJECT_OFFER]', err)
      alert('Failed to reject offer')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="text-green-500" />
      case 'REJECTED':
        return <XCircle className="text-red-500" />
      case 'PENDING':
        return <Clock className="text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const filteredOffers =
    activeTab === 'received'
      ? offers.filter(o => o.receiver.id === session?.user?.id)
      : offers.filter(o => o.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Offers</h1>
        <p className="text-gray-600">View and manage offers from freelancers</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="received">Received ({offers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Loader2 className="inline-block animate-spin" />
              </CardContent>
            </Card>
          ) : filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No offers found in this category
              </CardContent>
            </Card>
          ) : (
            filteredOffers.map(offer => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{offer.title}</CardTitle>
                      {offer.description && (
                        <CardDescription>{offer.description}</CardDescription>
                      )}
                    </div>
                    <Badge className={getStatusColor(offer.status)}>
                      <span className="mr-2 flex items-center gap-1">
                        {getStatusIcon(offer.status)}
                        {offer.status}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">From Freelancer</p>
                        <p className="font-semibold">{offer.sender.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Offer Amount</p>
                        <p className="font-semibold text-lg">₹{offer.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="text-sm">{new Date(offer.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expires</p>
                        <p className="text-sm">{new Date(offer.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {offer.status === 'PENDING' && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={() => handleAcceptOffer(offer.id)} className="flex-1">
                          Accept Offer
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRejectOffer(offer.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
