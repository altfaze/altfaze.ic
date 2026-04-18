'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

interface Request {
  id: string
  title: string
  description: string
  amount?: number
  status: string
  sender: { id: string; name: string; image?: string; email?: string }
  receiver: { id: string; name: string; image?: string }
  requiredSkills?: string[]
  createdAt: string
  orders?: Array<{ id: string; status: string }>
}

export default function FreelancerRequestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchRequests()
    }
  }, [status, router])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/requests?type=received`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      const data = await response.json()
      setRequests(data.data?.requests || [])
      setError('')
    } catch (err) {
      console.error('[FETCH_REQUESTS]', err)
      setError('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}/accept`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to accept request')
      fetchRequests()
      alert('Request accepted! An order has been created.')
    } catch (err) {
      console.error('[ACCEPT_REQUEST]', err)
      alert('Failed to accept request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}/reject`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to reject request')
      fetchRequests()
    } catch (err) {
      console.error('[REJECT_REQUEST]', err)
      alert('Failed to reject request')
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
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
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

  const filteredRequests =
    activeTab === 'pending'
      ? requests.filter(r => r.status === 'PENDING')
      : activeTab === 'accepted'
        ? requests.filter(r => r.status === 'ACCEPTED')
        : activeTab === 'rejected'
          ? requests.filter(r => r.status === 'REJECTED')
          : requests

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Work Requests</h1>
        <p className="text-gray-600">View and respond to requests from clients</p>
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
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
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
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No requests found in this category
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map(req => (
              <Card key={req.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{req.title}</CardTitle>
                      <CardDescription>{req.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">From Client</p>
                        <p className="font-semibold">{req.sender.name}</p>
                        {req.sender.email && (
                          <p className="text-xs text-gray-500">{req.sender.email}</p>
                        )}
                      </div>
                      {req.amount && (
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-semibold text-lg">
                            ₹{req.amount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Received</p>
                        <p className="text-sm">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      {req.requiredSkills && req.requiredSkills.length > 0 && (
                        <div>
                          <p className="text-gray-600">Required Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {req.requiredSkills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="flex-1"
                        >
                          Accept Request
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleRejectRequest(req.id)}
                        >
                          Decline
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
