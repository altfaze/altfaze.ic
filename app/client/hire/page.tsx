'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Icons } from '@/components/icons'

interface FormData {
  title: string
  description: string
  category: string
  budget: string
  deadline: string
  skills: string[]
}

export default function HireFreelancerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    skills: [],
  })
  
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const categories = [
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

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category || 'Other',
          budget: Number(formData.budget),
          deadline: formData.deadline,
          requiredSkills: formData.skills,
          status: 'OPEN',
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to create project')
      }

      const data = await res.json()

      toast({
        title: 'Success',
        description: 'Project posted successfully! Freelancers will start bidding soon.',
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        skills: [],
      })

      // Redirect to project detail
      router.push(`/client/projects/${data.data.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isClient || status === 'loading') {
    return <div className="min-h-screen bg-background p-6">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icons.briefcase className="h-6 w-6" />
            <h1 className="text-4xl font-bold">Post a Project</h1>
          </div>
          <p className="text-muted-foreground">
            Describe your project and find the perfect freelancer
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <Card>
            <CardHeader>
              <CardTitle>Project Title</CardTitle>
              <CardDescription>
                Give your project a clear, descriptive title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Build a React E-commerce Website"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                required
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
              <CardDescription>
                Explain what you need and any specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your project in detail. Include scope, features, timeline, and any other important information..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                rows={6}
                required
              />
            </CardContent>
          </Card>

          {/* Category & Budget */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget ($)</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  placeholder="100"
                  min="50"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  disabled={loading}
                  required
                />
              </CardContent>
            </Card>
          </div>

          {/* Deadline */}
          <Card>
            <CardHeader>
              <CardTitle>Deadline</CardTitle>
              <CardDescription>
                When do you need this project completed?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                disabled={loading}
                required
              />
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>
                Add skills you&apos;re looking for (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React, Node.js, TypeScript"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={loading || !skillInput.trim()}
                  variant="outline"
                >
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Link href="/client/projects" className="flex-1">
              <Button variant="outline" className="w-full" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Posting...' : 'Post Project'}
            </Button>
          </div>
        </form>

        {/* Tips Section */}
        <Card className="mt-12 bg-muted">
          <CardHeader>
            <CardTitle>💡 Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Be specific about your project requirements</li>
              <li>✓ Include examples or reference materials if available</li>
              <li>✓ Set a realistic budget based on project scope</li>
              <li>✓ List all required skills clearly</li>
              <li>✓ Set a reasonable deadline (won&apos;t affect your budget)</li>
              <li>✓ You&apos;ll receive bids shortly after posting</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
