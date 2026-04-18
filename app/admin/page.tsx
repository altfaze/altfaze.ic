'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStats {
  totalUsers: number
  totalAdmins: number
  totalClients: number
  totalFreelancers: number
  totalProjects: number
  totalTransactions: number
  totalEarnings: number
  suspendedUsers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return <div>No data available</div>
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Active Freelancers', value: stats.totalFreelancers },
    { label: 'Active Clients', value: stats.totalClients },
    { label: 'Total Projects', value: stats.totalProjects },
    { label: 'Total Transactions', value: stats.totalTransactions },
    { label: 'Total Earnings', value: `$${stats.totalEarnings.toFixed(2)}` },
    { label: 'Suspended Users', value: stats.suspendedUsers },
    { label: 'Platform Admins', value: stats.totalAdmins },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform management and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ActionButton href="/admin/users" label="Manage Users" />
          <ActionButton href="/admin/projects" label="Review Projects" />
          <ActionButton href="/admin/disputes" label="Resolve Disputes" />
          <ActionButton href="/admin/payments" label="Monitor Payments" />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity feed coming soon. This section will display recent user actions, project updates, and payments.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      {label}
    </a>
  )
}
