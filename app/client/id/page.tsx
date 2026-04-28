'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { toSafeNumber } from '@/lib/utils'

interface ClientProfile {
  id: string
  name: string
  email: string
  image: string | null
  username: string
  company: string | null
  description: string | null
  isVerified: boolean
  projects: Array<{
    id: string
    title: string
    description: string
    budget: number
    status: string
    category: string | null
    createdAt: string
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: string
    author: {
      id: string
      name: string | null
      image: string | null
    }
  }>
  stats: {
    totalReviews: number
    averageRating: number
    totalProjects: number
    openProjects: number
    completedProjects: number
    totalSpent: number
    joinedAt: string
  }
}

export default function ClientProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const clientId = params?.id as string
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) {
      setError('Client ID is required')
      setLoading(false)
      return
    }

    const fetchClientProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/clients/${clientId}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to load client profile')
        }

        const data = await response.json()
        if (!data.data?.client) {
          throw new Error('Invalid profile data')
        }

        setProfile(data.data.client)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load client profile'
        setError(message)
        console.error('[CLIENT_PROFILE_ERROR]', error)
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClientProfile()
  }, [clientId, toast])

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => router.push('/client/freelancers')} className="w-full">
              Back to Freelancers
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          {/* Header skeleton */}
          <div className="mb-12">
            <div className="flex gap-6 mb-8">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Stats skeleton */}
          <div className="grid gap-4 md:grid-cols-4 mb-12">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>

          {/* Projects skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const joinDate = new Date(profile.stats.joinedAt)
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex gap-6 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.image || undefined} />
              <AvatarFallback>{profile.name?.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {profile.isVerified && (
                  <Badge className="mt-1" variant="default">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              {profile.company && (
                <p className="text-lg text-muted-foreground mb-1">{profile.company}</p>
              )}

              <p className="text-sm text-muted-foreground">
                Member since {formattedJoinDate}
              </p>
            </div>
          </div>

          {/* Bio */}
          {profile.description && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-base text-foreground">{profile.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Open Projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.openProjects}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.totalProjects}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.completedProjects}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.totalReviews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile.stats.averageRating.toFixed(1)}⭐
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Projects</h2>

          {profile.projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No projects posted yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {profile.projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{project.title}</CardTitle>
                        <CardDescription className="mb-3">
                          {project.description.substring(0, 200)}
                          {project.description.length > 200 ? '...' : ''}
                        </CardDescription>
                      </div>
                      <Badge variant={project.status === 'OPEN' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      {project.category && (
                        <Badge variant="outline">{project.category}</Badge>
                      )}
                      <span className="text-lg font-bold">
                        ${toSafeNumber(project.budget).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posted {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {profile.reviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>

            <div className="space-y-4">
              {profile.reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.author.image || undefined} />
                          <AvatarFallback>
                            {review.author.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.author.name || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg">{'⭐'.repeat(review.rating)}</div>
                    </div>
                  </CardHeader>
                  {review.comment && (
                    <CardContent>
                      <p className="text-sm text-foreground">{review.comment}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
