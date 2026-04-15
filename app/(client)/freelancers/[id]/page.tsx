'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Freelancer {
  id: string
  name: string
  email: string
  image: string | null
  freelancer: {
    hourlyRate: number
    title: string
    bio: string
    skills: string[]
    rating: number
    completedProjects: number
  }
}

interface Project {
  id: string
  name: string
  description: string
  image: string | null
}

interface FreelancerDetailResponse {
  success: boolean
  data: {
    freelancer: Freelancer
    projects: Project[]
  }
}

interface SendRequestBody {
  freelancerId: string
  title: string
  description: string
  budget: number
  dueDate: string
}

export default function FreelancerDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', budget: 0, dueDate: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchFreelancerDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/freelancers/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch freelancer')

      const json: FreelancerDetailResponse = await res.json()
      setFreelancer(json.data.freelancer)
      setProjects(json.data.projects)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load freelancer details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchFreelancerDetails()
  }, [fetchFreelancerDetails])

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push('/login')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: params.id,
          ...formData,
          budget: Number(formData.budget),
        }),
      })

      if (!res.ok) throw new Error('Failed to send request')

      toast({ title: 'Success', description: 'Request sent to freelancer!' })
      setShowRequestForm(false)
      setFormData({ title: '', description: '', budget: 0, dueDate: '' })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send request',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-32 rounded-lg" />
          <div className="grid gap-8 md:grid-cols-3">
            <Skeleton className="h-96 md:col-span-2 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!freelancer) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Freelancer not found</p>
        <Button asChild className="mt-4">
          <Link href="/client/freelancers">Back to Freelancers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/client/freelancers">← Back to Freelancers</Link>
        </Button>

        {/* Header */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <Avatar className="h-24 w-24">
            <AvatarImage src={freelancer.image || undefined} />
            <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{freelancer.name}</h1>
            <p className="text-xl text-muted-foreground mb-3">{freelancer.freelancer.title}</p>
            <div className="flex gap-4 text-sm">
              <span className="font-semibold">{freelancer.freelancer.rating}⭐ Rating</span>
              <span className="font-semibold">{freelancer.freelancer.completedProjects} Completed</span>
              <span className="font-semibold">${freelancer.freelancer.hourlyRate}/hr</span>
            </div>
          </div>
          {session?.user?.id !== freelancer.id && (
            <Button
              size="lg"
              onClick={() => setShowRequestForm(!showRequestForm)}
            >
              {showRequestForm ? 'Cancel' : 'Send Request'}
            </Button>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-7">{freelancer.freelancer.bio}</p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio ({projects.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {project.image && (
                          <div className="h-32 bg-muted overflow-hidden">
                            <Image
                              src={project.image}
                              alt={project.name}
                              width={300}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-3">
                          <h4 className="font-semibold text-sm">{project.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium break-all">{freelancer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold">${freelancer.freelancer.hourlyRate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Request Form */}
            {showRequestForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendRequest} className="space-y-3 text-sm">
                    <div>
                      <label className="text-xs font-medium">Project Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        placeholder="Your project name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm h-20 resize-none"
                        placeholder="Describe your project..."
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Budget</label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        placeholder="Budget in USD"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Send Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {!session && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to send requests to this freelancer
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
