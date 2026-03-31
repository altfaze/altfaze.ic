"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/more-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Template {
  id: string
  title: string
  description: string
  category: string
  price: number
  image?: string
  features: string[]
  createdAt: string
}

interface TemplatesResponse {
  templates: Template[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

const CATEGORIES = ["Website", "Mobile App", "Design", "Ecommerce", "SaaS", "Dashboard", "Landing Page"]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
        })
        if (searchTerm) params.append("search", searchTerm)
        if (selectedCategory) params.append("category", selectedCategory)

        const res = await fetch(`/api/templates?${params}`)
        if (res.ok) {
          const data: TemplatesResponse = await res.json()
          setTemplates(data.templates || [])
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [searchTerm, selectedCategory, currentPage])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates Marketplace</h1>
        <p className="text-muted-foreground mt-2">Browse and purchase professional templates to accelerate your projects</p>
      </div>

      {/* Search and filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
              <Button>
                <Icons.search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Category filter */}
            <div>
              <p className="text-sm font-medium mb-2">Categories:</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCategory("")
                    setCurrentPage(1)
                  }}
                >
                  All
                </Badge>
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(category)
                      setCurrentPage(1)
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {loading ? "Loading Templates..." : `${templates.length} Templates Found`}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </CardHeader>
                </Card>
              ))
            : templates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  {template.image && (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Icons.image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <span className="text-lg font-bold text-primary">{formatCurrency(template.price)}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{template.title}</CardTitle>
                    <CardDescription className="line-clamp-2 flex-1">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {template.features && template.features.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <Button className="w-full">
                      <Icons.download className="mr-2 h-4 w-4" />
                      Purchase Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!loading && templates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No templates found. Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Icons.package className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Template {i}</CardTitle>
                <CardDescription>Premium React Component Library</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                    <p className="font-semibold">2.3K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-semibold">⭐ 4.8</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-bold text-lg">₹999</p>
                  </div>
                </div>
                <Button className="w-full">View & Buy</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
