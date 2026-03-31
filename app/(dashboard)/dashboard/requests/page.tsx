"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/more-icons"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Request {
  id: string
  title: string
  description?: string
  status: string
  amount?: number
  dueDate?: string
  sender: { id: string; name?: string; email: string }
  receiver: { id: string; name?: string; email: string }
  createdAt: string
  updatedAt: string
}

interface RequestsResponse {
  requests: Request[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export default function RequestsPage() {
  const [allRequests, setAllRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"sent" | "received" | "all">("all")

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ limit: "50" })
      if (activeTab !== "all") {
        params.append("type", activeTab)
      }

      const res = await fetch(`/api/requests?${params}`)
      if (res.ok) {
        const data: RequestsResponse = await res.json()
        setAllRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Negotiable"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-IN")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Requests & Offers</h1>
        <p className="text-muted-foreground mt-2">Manage work requests, proposals, and offers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-0">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
        >
          All Requests
        </Button>
        <Button
          variant={activeTab === "sent" ? "default" : "outline"}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </Button>
        <Button
          variant={activeTab === "received" ? "default" : "outline"}
          onClick={() => setActiveTab("received")}
        >
          Received
        </Button>
      </div>

      {/* Requests list */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))
        ) : allRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No requests found</p>
            </CardContent>
          </Card>
        ) : (
          allRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{request.title}</CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {activeTab === "sent" || activeTab === "all"
                        ? `To: ${request.receiver.name || request.receiver.email}`
                        : `From: ${request.sender.name || request.sender.email}`}
                      {" • "}
                      {formatDate(request.createdAt)}
                    </CardDescription>
                  </div>
                  {request.amount && (
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(request.amount)}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                )}
                {request.dueDate && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Due: {new Date(request.dueDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  {request.status === "PENDING" && (
                    <>
                      {activeTab !== "sent" && (
                        <>
                          <Button size="sm">Accept</Button>
                          <Button variant="outline" size="sm">
                            Decline
                          </Button>
                        </>
                      )}
                      {activeTab !== "received" && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </>
                  )}
                  {request.status === "ACCEPTED" && (
                    <Button variant="outline" size="sm">
                      <Icons.messageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  )}
                  {(request.status === "PENDING" || request.status === "ACCEPTED") && (
                    <Button variant="outline" size="sm" className="ml-auto">
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
