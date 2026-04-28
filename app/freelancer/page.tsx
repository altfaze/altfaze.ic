'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/more-icons'
import Link from 'next/link'

export default function FreelancerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/freelancer')
      return
    }

    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any)?.role
      if (userRole !== 'FREELANCER') {
        router.push('/client/dashboard')
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
            Freelancer Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your freelance career</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link href="/freelancer/work">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.search className="h-6 w-6 mb-2" />
                <CardTitle>Find Work</CardTitle>
                <CardDescription>Browse and apply for projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover job opportunities that match your skills and availability.
                </p>
                <Button variant="outline" className="w-full">
                  View Projects →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/freelancer/my-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.dashboard className="h-6 w-6 mb-2" />
                <CardTitle>My Dashboard</CardTitle>
                <CardDescription>Track your progress and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your stats, active projects, and earnings overview.
                </p>
                <Button variant="outline" className="w-full">
                  View Dashboard →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/freelancer/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.user className="h-6 w-6 mb-2" />
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your profile and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your professional profile and toggle availability status.
                </p>
                <Button variant="outline" className="w-full">
                  View Profile →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/freelancer/my-requests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.bell className="h-6 w-6 mb-2" />
                <CardTitle>My Requests</CardTitle>
                <CardDescription>View client requests and offers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Check and respond to direct offers from clients.
                </p>
                <Button variant="outline" className="w-full">
                  View Requests →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/freelancer/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.package className="h-6 w-6 mb-2" />
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Manage active and completed projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track all your active projects and deliverables.
                </p>
                <Button variant="outline" className="w-full">
                  View Orders →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/freelancer/wallet">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Icons.creditCard className="h-6 w-6 mb-2" />
                <CardTitle>Wallet & Payments</CardTitle>
                <CardDescription>Manage earnings and withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your earnings, wallet balance, and withdrawal history.
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
