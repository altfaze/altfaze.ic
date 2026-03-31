"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/more-icons"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
  totalEarned: number
  totalSpent: number
  projectCount: number
  requestCount: number
  walletBalance: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const role = session?.user?.role
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [walletRes, projectsRes, requestsRes] = await Promise.all([
          fetch('/api/wallet'),
          fetch(`/api/projects?my=true&limit=100`),
          fetch(`/api/requests?limit=100`)
        ])

        let walletData = { walletBalance: 0, totalEarned: 0, totalSpent: 0 }
        let projectCount = 0
        let requestCount = 0

        if (walletRes.ok) {
          const wallet = await walletRes.json()
          walletData = wallet.data || walletData
        }

        if (projectsRes.ok) {
          const projects = await projectsRes.json()
          projectCount = projects.data?.pagination?.total || 0
        }

        if (requestsRes.ok) {
          const requests = await requestsRes.json()
          requestCount = requests.data?.pagination?.total || 0
        }

        setStats({
          totalEarned: walletData.totalEarned || 0,
          totalSpent: walletData.totalSpent || 0,
          projectCount,
          requestCount,
          walletBalance: walletData.walletBalance || 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          {role === "FREELANCER"
            ? "Manage your work, track earnings, and grow your freelance business."
            : "Hire talented freelancers, manage projects, and expand your team."}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === "FREELANCER" ? "Total Earned" : "Total Spent"}
            </CardTitle>
            <Icons.creditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(role === "FREELANCER" ? (stats?.totalEarned || 0) : (stats?.totalSpent || 0))}
                </div>
                <p className="text-xs text-muted-foreground">Updated just now</p>
              </>
            )}
          </CardContent>
        </Card>

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
                <div className="text-2xl font-bold">{formatCurrency(stats?.walletBalance || 0)}</div>
                <p className="text-xs text-muted-foreground">Available to withdraw</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === "FREELANCER" ? "Active Projects" : "My Projects"}
            </CardTitle>
            <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.projectCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total projects</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === "FREELANCER" ? "Pending Requests" : "Pending Requests"}
            </CardTitle>
            <Icons.inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.requestCount || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access key features instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {role === "FREELANCER" ? (
              <>
                <Link href="/dashboard/work">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.briefcase className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Find Work</span>
                    <span className="text-xs text-muted-foreground">Browse projects</span>
                  </Button>
                </Link>
                <Link href="/dashboard/projects">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.fileText className="h-5 w-5 mb-2" />
                    <span className="font-semibold">My Projects</span>
                    <span className="text-xs text-muted-foreground">Active work</span>
                  </Button>
                </Link>
                <Link href="/dashboard/upload">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.upload className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Upload Template</span>
                    <span className="text-xs text-muted-foreground">Sell templates</span>
                  </Button>
                </Link>
                <Link href="/dashboard/wallet">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.wallet className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Wallet</span>
                    <span className="text-xs text-muted-foreground">Manage earnings</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/hire">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.users className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Hire Freelancer</span>
                    <span className="text-xs text-muted-foreground">Find talent</span>
                  </Button>
                </Link>
                <Link href="/dashboard/projects">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.fileText className="h-5 w-5 mb-2" />
                    <span className="font-semibold">My Projects</span>
                    <span className="text-xs text-muted-foreground">Manage work</span>
                  </Button>
                </Link>
                <Link href="/dashboard/templates">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.layers className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Templates</span>
                    <span className="text-xs text-muted-foreground">Buy templates</span>
                  </Button>
                </Link>
                <Link href="/dashboard/wallet">
                  <Button variant="outline" className="w-full h-auto flex flex-col items-start p-4 hover:bg-accent">
                    <Icons.creditCard className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Payments</span>
                    <span className="text-xs text-muted-foreground">View history</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activity yet. Get started by exploring the platform!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}