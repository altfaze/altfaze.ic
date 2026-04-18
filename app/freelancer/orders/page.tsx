'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

interface Order {
  id: string
  title: string
  description: string
  amount: number
  status: string
  sender: { id: string; name: string; image?: string }
  receiver: { id: string; name: string; image?: string }
  createdAt: string
  acceptedAt?: string
  completedAt?: string
}

export default function FreelancerOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?type=received`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.data || [])
      setError('')
    } catch (err) {
      console.error('[FETCH_ORDERS]', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/accept`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to accept order')
      fetchOrders() // Refresh
      alert('Order accepted! You can now start working.')
    } catch (err) {
      console.error('[ACCEPT_ORDER]', err)
      alert('Failed to accept order')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to reject order')
      fetchOrders() // Refresh
    } catch (err) {
      console.error('[REJECT_ORDER]', err)
      alert('Failed to reject order')
    }
  }

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/complete`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to complete order')
      fetchOrders() // Refresh
      alert('Order completed! Payment will be transferred to your wallet.')
    } catch (err) {
      console.error('[COMPLETE_ORDER]', err)
      alert('Failed to complete order')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
      case 'CANCELLED':
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

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">View and manage orders sent to you by clients</p>
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
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Loader2 className="inline-block animate-spin" />
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-600">
                No orders found in this category
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map(order => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{order.title}</CardTitle>
                      <CardDescription>{order.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Client</p>
                        <p className="font-semibold">{order.sender.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-semibold">₹{order.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {order.acceptedAt && (
                        <div>
                          <p className="text-gray-600">Accepted</p>
                          <p className="font-semibold">
                            {new Date(order.acceptedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t flex-wrap">
                      {order.status === 'PENDING' && (
                        <>
                          <Button onClick={() => handleAcceptOrder(order.id)} className="flex-1">
                            Accept Order
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700"
                            onClick={() => handleRejectOrder(order.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {(order.status === 'ACCEPTED' || order.status === 'IN_PROGRESS') && (
                        <Button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="flex-1"
                          variant="default"
                        >
                          Mark Complete & Submit
                        </Button>
                      )}
                      {order.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          disabled
                        >
                          Completed
                        </Button>
                      )}
                    </div>
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
