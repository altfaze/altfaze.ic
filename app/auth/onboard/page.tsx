'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'

export default function OnboardPage() {
  const { data: session, status, update: updateSession } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'FREELANCER' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If user already has a role set, skip onboarding
    if (session?.user?.role && session.user.role !== 'CLIENT') {
      router.replace(`/${session.user.role.toLowerCase()}/my-dashboard`)
    } else if (session?.user?.role === 'CLIENT') {
      router.replace('/client/dashboard')
    }
  }, [session, router])

  const handleRoleSelect = async (role: 'CLIENT' | 'FREELANCER') => {
    if (!session?.user?.email) {
      toast({
        title: 'Error',
        description: 'User session not found. Please login again.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)
      setSelectedRole(role)

      // Update user role in database
      const res = await fetch('/api/users/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole: role }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to set role')
      }

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          role,
        },
      })

      toast({
        title: 'Welcome!',
        description: `You're all set as a ${role}. Redirecting...`,
      })

      // Redirect based on role
      setTimeout(() => {
        if (role === 'FREELANCER') {
          router.push('/freelancer/my-dashboard')
        } else {
          router.push('/client/dashboard')
        }
      }, 1000)
    } catch (error) {
      console.error('Error setting role:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to set role',
        variant: 'destructive',
      })
      setSelectedRole(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Icons.spinner className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Altfaze!</h1>
          <p className="text-xl text-muted-foreground">
            Choose how you want to use Altfaze to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Option */}
          <Card
            className={`cursor-pointer transition-all border-2 ${
              selectedRole === 'CLIENT'
                ? 'border-primary bg-primary/5 ring-2 ring-primary'
                : 'border-muted hover:border-primary/50 hover:shadow-lg'
            }`}
            onClick={() => !isLoading && handleRoleSelect('CLIENT')}
          >
            <CardHeader className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icons.briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">I&apos;m a Client</CardTitle>
                <CardDescription className="text-base">
                  I want to hire freelancers and find quality work
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Browse and hire talented freelancers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Post projects and receive proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Buy templates and resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Track projects and payments</span>
                </li>
              </ul>

              <Button
                className="w-full"
                disabled={isLoading && selectedRole === 'CLIENT'}
              >
                {isLoading && selectedRole === 'CLIENT' ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Continue as Client'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Freelancer Option */}
          <Card
            className={`cursor-pointer transition-all border-2 ${
              selectedRole === 'FREELANCER'
                ? 'border-primary bg-primary/5 ring-2 ring-primary'
                : 'border-muted hover:border-primary/50 hover:shadow-lg'
            }`}
            onClick={() => !isLoading && handleRoleSelect('FREELANCER')}
          >
            <CardHeader className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icons.code className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">I&apos;m a Freelancer</CardTitle>
                <CardDescription className="text-base">
                  I want to offer services and earn money
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Showcase your skills and portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Accept projects and offers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Upload and sell your templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Build your reputation and earn</span>
                </li>
              </ul>

              <Button
                className="w-full"
                disabled={isLoading && selectedRole === 'FREELANCER'}
              >
                {isLoading && selectedRole === 'FREELANCER' ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Continue as Freelancer'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Not sure? You can switch roles anytime in your{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/freelancer/settings')}>
              settings
            </Button>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
