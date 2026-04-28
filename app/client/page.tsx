'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/more-icons'
import Link from 'next/link'

export default function ClientPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/client')
      return
    }

    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any)?.role
      if (userRole !== 'CLIENT') {
        router.push('/freelancer')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Icons.briefcase className="h-8 w-8" />
            Client Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your projects and team</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link href="/client/hire">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.add className="h-6 w-6 mb-2" />
                <CardTitle>Post a Project</CardTitle>
                <CardDescription>Create new project opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Post a new project and start receiving proposals from freelancers.
                </p>
                <Button variant="outline" className="w-full">
                  Post Project →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.dashboard className="h-6 w-6 mb-2" />
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>View your overview and stats</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track active projects, spending, and team performance.
                </p>
                <Button variant="outline" className="w-full">
                  View Dashboard →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/freelancers">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.users className="h-6 w-6 mb-2" />
                <CardTitle>Hire Freelancers</CardTitle>
                <CardDescription>Browse and hire talent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse available freelancers and send direct offers.
                </p>
                <Button variant="outline" className="w-full">
                  Browse Freelancers →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/requests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.send className="h-6 w-6 mb-2" />
                <CardTitle>My Requests</CardTitle>
                <CardDescription>Manage sent requests and offers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your requests, offers, and negotiations.
                </p>
                <Button variant="outline" className="w-full">
                  View Requests →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.package className="h-6 w-6 mb-2" />
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Manage ongoing projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track active projects, deliverables, and timelines.
                </p>
                <Button variant="outline" className="w-full">
                  View Orders →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/wallet">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.creditCard className="h-6 w-6 mb-2" />
                <CardTitle>Wallet & Payments</CardTitle>
                <CardDescription>Manage your account funds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add funds, view spending, and payment history.
                </p>
                <Button variant="outline" className="w-full">
                  View Wallet →
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
