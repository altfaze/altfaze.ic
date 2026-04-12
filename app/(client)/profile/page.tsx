'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  freelancer?: {
    title: string
    bio: string
    hourlyRate: number
    skills: string[]
  }
}

interface ProfileResponse {
  success: boolean
  data: { user: UserProfile }
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    skills: '',
  })

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/users/profile', {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch profile')

      const json: ProfileResponse = await res.json()
      setProfile(json.data.user)
      setFormData({
        name: json.data.user.name,
        email: json.data.user.email,
        title: json.data.user.freelancer?.title || '',
        bio: json.data.user.freelancer?.bio || '',
        hourlyRate: json.data.user.freelancer?.hourlyRate || 0,
        skills: json.data.user.freelancer?.skills.join(', ') || '',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session, fetchProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          freelancer: {
            title: formData.title,
            bio: formData.bio,
            hourlyRate: parseFloat(formData.hourlyRate.toString()),
            skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to save profile')

      toast({ title: 'Success', description: 'Profile saved successfully' })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-10 rounded-lg mb-8" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-4">Freelancer Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Full Stack Developer"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell clients about yourself..."
                      className="w-full mt-1 px-3 py-2 border rounded-md border-input focus-visible:outline-none focus-visible:ring-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Hourly Rate ($)</label>
                    <Input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                      placeholder="50"
                      className="mt-1"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Skills (comma-separated)</label>
                    <Input
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="React, TypeScript, Node.js, etc."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6 border-t">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
