'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Freelancer {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  freelancer: {
    hourlyRate: number
    title: string
    bio: string
    skills: string[]
    rating: number
    completedProjects: number
  }
}

interface FreelancersResponse {
  success: boolean
  data: {
    freelancers: Freelancer[]
    pagination: { page: number; limit: number; total: number; pages: number }
  }
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(12)

  const skills = ['React', 'Node.js', 'Python', 'TypeScript', 'UX Design', 'DevOps', 'iOS', 'Android']

  const fetchFreelancers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        ...(search && { search }),
        ...(skillFilter && { skills: skillFilter }),
      })

      const res = await fetch(`/api/freelancers?${params}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch freelancers')

      const json: FreelancersResponse = await res.json()
      setFreelancers(json.data.freelancers)
      setTotal(json.data.pagination.total)
    } catch (error) {
      console.error('Error fetching freelancers:', error)
    } finally {
      setLoading(false)
    }
  }, [search, skillFilter, page, limit])

  useEffect(() => {
    fetchFreelancers()
  }, [fetchFreelancers])

  const pages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Freelancers</h1>
          <p className="text-muted-foreground">Browse and hire talented freelancers for your projects</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <Input
            placeholder="Search by name, title, skills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="max-w-sm"
          />
          <Select value={skillFilter || "all"} onValueChange={(v) => { setSkillFilter(v === "all" ? "" : v); setPage(1) }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {skills.map((skill) => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Freelancers Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : freelancers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {freelancers.map((freelancer) => (
              <Card key={freelancer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={freelancer.image || undefined} />
                      <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{freelancer.name}</CardTitle>
                      <CardDescription>{freelancer.freelancer.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{freelancer.freelancer.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {freelancer.freelancer.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.freelancer.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.freelancer.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{freelancer.freelancer.rating}⭐ • {freelancer.freelancer.completedProjects} projects</span>
                  </div>

                  {/* Rate */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Hourly Rate</p>
                      <p className="text-lg font-bold">${freelancer.freelancer.hourlyRate}/hr</p>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/client/freelancers/${freelancer.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No freelancers found</p>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2">
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
      </div>
    </div>
  )
}
