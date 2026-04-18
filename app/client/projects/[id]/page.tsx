'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

interface ProjectDetailResponse {
  success: boolean
  data: { project: Project }
}

export default function ProjectDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const projectId = (params?.id as string) || ''

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    budget: 0,
    deadline: '',
  })
  const [updating, setUpdating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/projects/${projectId}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch project')

      const json: ProjectDetailResponse = await res.json()
      setProject(json.data.project)
      setEditData({
        title: json.data.project.title,
        description: json.data.project.description,
        budget: json.data.project.budget,
        deadline: json.data.project.deadline ? new Date(json.data.project.deadline).toISOString().split('T')[0] : '',
      })
    } catch (error) {
      console.error('Error fetching project:', error)
      toast({
        title: 'Error',
        description: 'Failed to load project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, toast])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleUpdateProject = async () => {
    if (!editData.title.trim() || !editData.description.trim() || editData.budget <= 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    try {
      setUpdating(true)
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editData.title.trim(),
          description: editData.description.trim(),
          budget: editData.budget,
          deadline: editData.deadline || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to update project')

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      })
      setIsEditing(false)
      await fetchProject()
    } catch (error) {
      console.error('Error updating project:', error)
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteProject = async () => {
    try {
      setDeleting(true)
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Failed to delete project')

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      })
      router.push('/client/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

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
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-12 w-64 rounded-lg mb-8" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container py-12 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Project not found</p>
            <div className="flex justify-center mt-6">
              <Link href="/client/projects">
                <Button variant="outline">Back to Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = session?.user?.email === project.creator.email

  return (
    <div className="container py-12 max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href="/client/projects">
            <Button variant="ghost" className="mb-4">← Back to Projects</Button>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created {new Date(project.createdAt).toLocaleDateString()} • Budget: ${project.budget.toLocaleString()}
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this project? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProject} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Creator Info */}
      <Card>
        <CardHeader>
          <CardTitle>Project Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={project.creator.image || ''} />
              <AvatarFallback>{project.creator.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{project.creator.name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">{project.creator.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Project description"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget ($)</label>
                <Input
                  type="number"
                  value={editData.budget}
                  onChange={(e) => setEditData({ ...editData, budget: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input
                  type="date"
                  value={editData.deadline}
                  onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateProject} disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Category</h3>
                  <p className="text-sm text-muted-foreground">{project.category || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Budget</h3>
                  <p className="text-sm text-muted-foreground">${project.budget.toLocaleString()}</p>
                </div>
              </div>
              {project.deadline && (
                <div>
                  <h3 className="font-semibold mb-1">Deadline</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              {project.submitter && (
                <div>
                  <h3 className="font-semibold mb-3">Submitted By</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={project.submitter.image || ''} />
                      <AvatarFallback>{project.submitter.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.submitter.name}</p>
                      <p className="text-sm text-muted-foreground">{project.submitter.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
