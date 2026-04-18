'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

interface Template {
  id: string
  title: string
  description: string
  category: string
  price: number
  image: string | null
  features: string[]
  createdAt: string
}

interface Purchase {
  id: string
  createdAt: string
  downloadToken: string
  template: Template
}

interface PurchasedTemplate extends Template {
  purchaseDate: string
  downloadToken: string
}

interface TemplatesResponse {
  data: {
    templates: Template[]
    pagination: { page: number; limit: number; total: number; pages: number; hasMore: boolean }
  }
}

interface PurchasesResponse {
  data: {
    purchases: Purchase[]
  }
}

export default function ClientTemplatesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Purchased templates state
  const [purchasedTemplates, setPurchasedTemplates] = useState<PurchasedTemplate[]>([])
  const [purchasedLoading, setPurchasedLoading] = useState(true)

  // Available templates state
  const [templates, setTemplates] = useState<Template[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(12)
  const [activeTab, setActiveTab] = useState<'purchased' | 'explore'>('purchased')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Fetch purchased templates
  const fetchPurchasedTemplates = useCallback(async () => {
    if (status !== 'authenticated') return

    try {
      setPurchasedLoading(true)
      const res = await fetch('/api/template-purchases', {
        cache: 'no-store',
      })

      if (!res.ok) {
        console.error('Failed to fetch purchased templates')
        return
      }

      const json: PurchasesResponse = await res.json()
      const mapped = (json.data.purchases || []).map((purchase) => ({
        ...purchase.template,
        purchaseDate: purchase.createdAt,
        downloadToken: purchase.downloadToken,
      }))
      setPurchasedTemplates(mapped)
    } catch (error) {
      console.error('Error fetching purchased templates:', error)
    } finally {
      setPurchasedLoading(false)
    }
  }, [status])

  // Fetch available templates
  const fetchTemplates = useCallback(async () => {
    setTemplatesLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        ...(search && { search }),
        ...(category && { category }),
      })

      const res = await fetch(`/api/templates?${params}`, {
        cache: 'no-store',
      })

      if (!res.ok) {
        console.error('Failed to fetch templates')
        return
      }

      const json: TemplatesResponse = await res.json()
      setTemplates(json.data.templates)
      setTotal(json.data.pagination.total)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setTemplatesLoading(false)
    }
  }, [search, category, page, limit])

  useEffect(() => {
    fetchPurchasedTemplates()
  }, [fetchPurchasedTemplates])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  const categories = ['React', 'Next.js', 'Vue', 'Svelte', 'TypeScript', 'E-commerce']
  const pages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Templates</h1>
        <p className="text-muted-foreground">Manage your purchased templates and explore more</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'purchased' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('purchased')}
          className="rounded-b-none"
        >
          Purchased Templates ({purchasedTemplates.length})
        </Button>
        <Button
          variant={activeTab === 'explore' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('explore')}
          className="rounded-b-none"
        >
          Browse & Purchase
        </Button>
      </div>

      <div className="space-y-6">
        {/* Purchased Templates Tab */}
        {activeTab === 'purchased' && (
          <>
            {purchasedLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-lg" />
                ))}
              </div>
            ) : purchasedTemplates.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {purchasedTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                  >
                    {template.image && (
                      <div className="h-40 bg-muted overflow-hidden">
                        <Image
                          src={template.image}
                          alt={template.title}
                          width={300}
                          height={160}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Purchased
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-xs text-muted-foreground mb-4">
                        Purchased on{' '}
                        {new Date(template.purchaseDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1" variant="default">
                          <Link href={`/client/templates/${template.id}`}>
                            View & Download
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No purchased templates yet</p>
                <Button onClick={() => setActiveTab('explore')}>Browse Templates</Button>
              </Card>
            )}
          </>
        )}

        {/* Browse & Purchase Tab */}
        {activeTab === 'explore' && (
          <>
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="max-w-sm"
              />
              <select
                value={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setCategory(e.target.value)
                  setPage(1)
                }}
                className="px-3 py-2 border rounded-md border-input bg-background"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {templatesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-lg" />
                ))}
              </div>
            ) : templates.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => {
                  const isPurchased = purchasedTemplates.some(
                    (p) => p.id === template.id
                  )
                  return (
                    <Card
                      key={template.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    >
                      {template.image && (
                        <div className="h-40 bg-muted overflow-hidden">
                          <Image
                            src={template.image}
                            alt={template.title}
                            width={300}
                            height={160}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-2xl font-bold mb-1">
                            {template.price === 0 ? 'Free' : `$${template.price}`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild className="flex-1" variant="default">
                            <Link href={`/templates/${template.id}`}>
                              {isPurchased ? 'View Details' : 'View & Buy'}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No templates found</p>
              </Card>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                {[...Array(Math.min(pages, 5))].map((_, i) => {
                  const pageNum = page > 3 ? page - 2 + i : i + 1
                  if (pageNum > pages) return null
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
