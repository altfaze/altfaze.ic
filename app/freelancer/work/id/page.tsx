'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Project {
  id: string
  title: string
  description: string
  budget: number
  status: string
  category: string
  deadline: string | null
  creator: {
    id: string
    name: string
    email: string
    image: string | null
    username: string
    isVerified: boolean
  }
  userHasApplied: boolean
  userApplication: {
    id: string
    amount: number
    description: string
    status: string
    createdAt: string
  } | null
  createdAt: string
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const projectId = (params?.id as string) || ''
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
  }, [status, router])

  useEffect(() => {
    if (!projectId) {
      router.push('/freelancer/work')
      return
    }

    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/projects/${projectId}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Project not found')
        }

        const data = await response.json()
        setProject(data.data)
      } catch (error) {
        console.error('[PROJECT_DETAIL_ERROR]', error)
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        })
        router.push('/freelancer/work')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, toast, router])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!offerAmount) {
      toast({
        title: 'Error',
        description: 'Please enter your offer amount',
        variant: 'destructive',
      })
      return
    }

    if (parseFloat(offerAmount) <= 0) {
      toast({
        title: 'Error',
        description: 'Offer amount must be greater than 0',
        variant: 'destructive',
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/projects/${projectId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(offerAmount),
          message: offerMessage,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit offer')
      }

      toast({
        title: 'Success',
        description: 'Your offer has been submitted!',
      })

      setOfferAmount('')
      setOfferMessage('')

      // Refresh project data
      const updatedResponse = await fetch(`/api/projects/${projectId}`, {
        cache: 'no-store',
      })
      const updated = await updatedResponse.json()
      setProject(updated.data)
    } catch (error) {
      console.error('[APPLY_ERROR]', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit offer',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container max-w-4xl py-12 text-center">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => router.push('/freelancer/work')}>
          Back to Projects
        </Button>
      </div>
    )
  }

  const isCreator = session?.user?.id === project?.creator?.id

  return (
    <div className="container max-w-4xl py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge className="mb-2">{project.category}</Badge>
            <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground">
              Posted {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isCreator && (
            <Badge variant="outline" className="bg-yellow-50">
              Your Project
            </Badge>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Project Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-2 text-base leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Budget</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${project.budget.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className="mt-1">
                    {project.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Deadline</Label>
                  <p className="mt-1">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : 'No deadline'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project?.creator?.image || ''} />
                  <AvatarFallback>
                    {(project?.creator?.name || 'C')
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{project?.creator?.name || 'Unknown Client'}</p>
                    {project?.creator?.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{project?.creator?.username || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {!isCreator && !project.userHasApplied ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Your Offer Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter your offer"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Cover Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell the client why you're a good fit for this project..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      disabled={submitting}
                      className="h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Submitting...' : 'Submit Offer'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : project.userHasApplied ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">Your Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-green-800">Amount Offered</Label>
                  <p className="text-2xl font-bold text-green-600">
                    ${project.userApplication?.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-green-800">Status</Label>
                  <Badge className="mt-1">{project.userApplication?.status}</Badge>
                </div>
                {project.userApplication?.description && (
                  <div>
                    <Label className="text-green-800">Your Proposal</Label>
                    <p className="text-sm mt-1">{project.userApplication.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/freelancer/work')}
          >
            Back to Projects
          </Button>
        </div>
      </div>
    </div>
  )
}
