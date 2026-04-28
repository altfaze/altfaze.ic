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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/more-icons'

interface Template {
  id: string
  title: string
  description: string
  category: string
  price: number
  image: string | null
  features: string[]
  downloads: number
  earnings: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

interface TemplatesResponse {
  success: boolean
  data: {
    templates: Template[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-red-100 text-red-800',
  }

  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  )
}

export default function FreelancerTemplatesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const limit = 12

  useEffect(() => {
    setIsClient(true)
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchTemplates = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      })

      const res = await fetch(`/api/templates?${params}`, {
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch templates')
      }

      const json: TemplatesResponse = await res.json()
      setTemplates(json.data.templates)
      setTotal(json.data.pagination.total)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [page, toast])

  useEffect(() => {
    if (isClient && status === 'authenticated') {
      fetchTemplates()
    }
  }, [isClient, status, fetchTemplates])

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const res = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete template')
      }

      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      })

      fetchTemplates()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      })
    }
  }

  if (!isClient || status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const pages = Math.ceil(total / limit)
  const stats = {
    totalTemplates: total,
    totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0),
    totalEarnings: templates.reduce((sum, t) => sum + t.earnings, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Icons.package className="h-6 w-6" />
              <h1 className="text-4xl font-bold">My Templates</h1>
            </div>
            <p className="text-muted-foreground">
              Manage and sell your website templates
            </p>
          </div>
          <Link href="/freelancer/upload">
            <Button>
              <Icons.add className="h-4 w-4 mr-2" />
              Upload Template
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{stats.totalTemplates}</p>
              <p className="text-sm text-muted-foreground">Total Templates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{stats.totalDownloads}</p>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">${stats.totalEarnings}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {template.image ? (
                      <Image
                        src={template.image}
                        alt={template.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Icons.media className="h-12 w-12 text-muted-foreground" />
                    )}
                    <StatusBadge status={template.status} />
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {template.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-lg font-bold">${template.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Downloads</p>
                        <p className="text-lg font-bold">{template.downloads}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/freelancer/templates/${template.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex gap-2 justify-center pt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  Page {page} of {pages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Icons.package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No templates uploaded yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Start earning by uploading your first template
            </p>
            <Link href="/freelancer/upload">
              <Button>
                <Icons.add className="h-4 w-4 mr-2" />
                Upload Your First Template
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
