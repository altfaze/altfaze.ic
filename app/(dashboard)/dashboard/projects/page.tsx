"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/more-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  budget?: number
  status: string
  category?: string
  deadline?: string
  creator?: { name?: string; email?: string }
  createdAt: string
}

interface ProjectsResponse {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Flexible"
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          my: 'true',
          page: currentPage.toString(),
          limit: '12'
        })
        if (selectedStatus !== 'all') {
          params.append('status', selectedStatus)
        }
        
        const res = await fetch(`/api/projects?${params}`)
        if (res.ok) {
          const data: ProjectsResponse = await res.json()
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [currentPage, selectedStatus])

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const statusColorMap: Record<string, { bg: string; text: string }> = {
      'OPEN': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-100' },
      'IN_PROGRESS': { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-100' },
      'COMPLETED': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-100' },
      'CANCELLED': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-100' },
    }
    return statusColorMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' }
  }

  const statuses = ['all', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  const statusLabels: Record<string, string> = {
    'all': 'All Projects',
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your active and completed projects</p>
        </div>
        {session?.user?.role === 'CLIENT' && (
          <Button asChild className="gap-2">
            <Link href="/dashboard/projects/new">
              <Icons.add className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search projects by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Status filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statuses.map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              onClick={() => {
                setSelectedStatus(status)
                setCurrentPage(1)
              }}
              className="whitespace-nowrap"
            >
              {statusLabels[status]}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Icons.folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {projects.length === 0 ? "No projects yet." : "No projects match your search."}
          </p>
          {projects.length === 0 && session?.user?.role === 'CLIENT' && (
            <Button asChild>
              <Link href="/dashboard/projects/new">Create Your First Project</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => {
            const colors = getStatusColor(project.status)
            return (
              <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <Badge className={`${colors.bg} ${colors.text} flex-shrink-0`}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-1">
                    {project.category && `${project.category} • `}
                    {formatDate(project.createdAt)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col gap-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  {/* Budget and deadline */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-semibold">{formatCurrency(project.budget)}</p>
                    </div>
                    {project.deadline && (
                      <div>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="font-semibold">{formatDate(project.deadline)}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4 border-t">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Icons.eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    {session?.user?.role === 'CLIENT' && (
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                          <Icons.edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredProjects.length > 0 && filteredProjects.length === 12 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <Icons.chevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {currentPage}</span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
            <Icons.chevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
