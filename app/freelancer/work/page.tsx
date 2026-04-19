'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

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
  }
  createdAt: string
}

interface ProjectsResponse {
  success: boolean
  data: {
    projects: Project[]
    pagination: {
      page: number
      limit: number
      pages: number
      total: number
      hasMore: boolean
    }
  }
}

export default function FreelancerWorkPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<string>('')
  const [minBudget, setMinBudget] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const limit = 12

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'Video Editing',
    'Data Entry',
    'Virtual Assistant',
    'Digital Marketing',
    'SEO',
    'Other',
  ]

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      let url = `/api/projects?page=${page}&limit=${limit}&status=OPEN`

      if (category && category !== 'All Categories') {
        url += `&category=${encodeURIComponent(category)}`
      }

      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const json: ProjectsResponse = await response.json()
      setProjects(json.data?.projects || [])
    } catch (error) {
      console.error('[FETCH_PROJECTS_ERROR]', error)
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      })
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [page, category, limit, toast])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session?.user?.role !== 'FREELANCER') {
      toast({
        title: 'Access Denied',
        description: 'This page is for freelancers only.',
        variant: 'destructive',
      })
      router.push('/client/dashboard')
      return
    }
    fetchProjects()
  }, [page, category, fetchProjects, session, status, router, toast])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBudget = !minBudget || project.budget >= parseFloat(minBudget)

    return matchesSearch && matchesBudget
  })

  const handleApply = (projectId: string) => {
    router.push(`/freelancer/work/${projectId}`)
  }

  if (status === 'loading' || (loading && page === 1)) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-72" />
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Projects</h1>
          <p className="text-muted-foreground">
            Browse and apply for projects that match your skills
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="md:col-span-2"
          />
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value === 'All Categories' ? '' : value)
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Budget ($)"
            value={minBudget}
            onChange={(e) => {
              setMinBudget(e.target.value)
              setPage(1)
            }}
            min="0"
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow flex flex-col"
                >
                  <CardHeader>
                    <Badge className="w-fit mb-2">{project.category}</Badge>
                    <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${project.budget.toFixed(2)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Posted by</p>
                          <p className="font-medium truncate">{project.creator.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline</p>
                          <p className="font-medium">
                            {project.deadline
                              ? new Date(project.deadline).toLocaleDateString()
                              : 'Open'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleApply(project.id)}
                      className="w-full"
                    >
                      View & Apply
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {projects.length >= limit && (
              <div className="flex justify-center gap-2 mb-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button variant="outline" disabled>
                  Page {page}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4 text-lg">
                {searchQuery || minBudget || category
                  ? 'No projects match your filters'
                  : 'No open projects available at the moment'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setMinBudget('')
                  setCategory('')
                  setPage(1)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
