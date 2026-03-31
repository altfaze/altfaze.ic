"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/more-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Freelancer {
  id: string
  name: string
  email: string
  image?: string
  title?: string
  bio?: string
  skills: string[]
  hourlyRate: number
  rating: number
  reviewCount: number
}

interface FreelancersResponse {
  freelancers: Freelancer[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export default function HireFreelancerPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const commonSkills = ["React", "Node.js", "Python", "UI Design", "Web Design", "Mobile App", "DevOps", "Data Science"]

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
        })
        if (searchTerm) params.append("search", searchTerm)
        if (selectedSkill) params.append("skill", selectedSkill)

        const res = await fetch(`/api/freelancers?${params}`)
        if (res.ok) {
          const data: FreelancersResponse = await res.json()
          setFreelancers(data.freelancers || [])
        }
      } catch (error) {
        console.error("Failed to fetch freelancers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFreelancers()
  }, [searchTerm, selectedSkill, currentPage])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hire Freelancer</h1>
        <p className="text-muted-foreground mt-2">Find and hire talented freelancers for your projects</p>
      </div>

      {/* Search and filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Freelancers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
              <Button onClick={() => { /* search already updates via state */ }}>
                <Icons.search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            
            {/* Skill filter tags */}
            <div>
              <p className="text-sm font-medium mb-2">Popular Skills:</p>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkill === skill ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedSkill(selectedSkill === skill ? "" : skill)
                      setCurrentPage(1)
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Freelancers list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {loading ? "Loading Freelancers..." : `${freelancers.length} Freelancers Found`}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>
              ))
            : freelancers.map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {freelancer.image ? (
                          <img
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {freelancer.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{freelancer.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{freelancer.title || "Freelancer"}</p>
                        </div>
                      </div>
                      <div className="text-lg ml-2">⭐ {freelancer.rating.toFixed(1)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-primary">₹{freelancer.hourlyRate.toFixed(0)}/hour</p>
                      {freelancer.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{freelancer.bio}</p>
                      )}
                      <div className="flex gap-1 flex-wrap mt-2">
                        {freelancer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{freelancer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button className="w-full">
                      <Icons.briefcase className="mr-2 h-4 w-4" />
                      View Profile & Hire
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!loading && freelancers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No freelancers found. Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

