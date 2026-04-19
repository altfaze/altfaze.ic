'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

interface Project {
  id: string
  title: string
  description: string
  budget: number
  status: string
  category: string
  deadline: string | null
  creator: { id: string; name: string; email: string; image: string | null }
  submitter: { id: string; name: string; email: string; image: string | null } | null
  createdAt: string
  updatedAt: string
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

export default function ProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string | null>(null)
  const limit = 10

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      let url = `/api/projects?page=${page}&limit=${limit}&my=true`
      if (status) url += `&status=${status}`

      const res = await fetch(url, { cache: 'no-store' })
      
      if (!res.ok) {
        console.error(`[PROJECTS_FETCH_ERROR] Status: ${res.status}`)
        throw new Error('Failed to fetch projects. Please try again.')
      }

      const json: ProjectsResponse = await res.json()
      setProjects(json.data?.projects || [])
    } catch (error) {
      console.error('[PROJECTS_FETCH_ERROR]', error)
      // Don't show error toast, just set empty projects
      setProjects([])
      // Optionally show a less intrusive notification
      if (error instanceof Error && !error.message.includes('Failed to fetch')) {
        toast({
          title: 'Notice',
          description: 'Could not load projects. Please refresh.',
          variant: 'default',
        })
      }
    } finally {
      setLoading(false)
    }
  }, [page, status, limit, toast])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="container py-12 max-w-6xl">
        <Skeleton className="h-32 rounded-lg mb-8" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">Manage and track your projects</p>
          </div>
          <Button asChild>
            <Link href="/client/hire">Create Project</Link>
          </Button>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={status === null ? 'default' : 'outline'}
            onClick={() => setStatus(null)}
          >
            All
          </Button>
          {['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
            <Button
              key={s}
              variant={status === s ? 'default' : 'outline'}
              onClick={() => setStatus(s)}
            >
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Projects List */}
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="text-lg font-semibold">${project.budget.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium">
                        {project.deadline
                          ? new Date(project.deadline).toLocaleDateString()
                          : 'No deadline'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/client/projects/${project.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Button asChild>
                <Link href="/client/hire">Create Your First Project</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
