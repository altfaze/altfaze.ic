'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/icons'

interface ProfileData {
  id: string
  name: string
  email: string
  image: string | null
  freelancer: {
    title: string
    bio: string
    skills: string[]
    hourlyRate: number
    rating: number
    reviewCount: number
  }
}

interface ProfileResponse {
  success: boolean
  data: {
    user: ProfileData
  }
}

export default function FreelancerProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    skills: [] as string[],
  })

  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/users/profile', {
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch profile')
      }

      const json = await res.json()
      const user = json?.data?.user || json?.user
      if (user) {
        setProfile(user)
        setFormData({
          name: user.name || '',
          title: user.freelancer?.title || '',
          bio: user.freelancer?.bio || '',
          hourlyRate: user.freelancer?.hourlyRate || 0,
          skills: user.freelancer?.skills || [],
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
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
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, fetchProfile])

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

  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(profile ? { ...profile, image: reader.result as string } : null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.title) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const formData_ = new FormData()
      formData_.append('name', formData.name)
      formData_.append('freelancer', JSON.stringify({
        title: formData.title,
        bio: formData.bio,
        hourlyRate: Number(formData.hourlyRate),
        skills: formData.skills,
      }))
      if (imageFile) {
        formData_.append('image', imageFile)
      }

      const res = await fetch('/api/users/me/profile', {
        method: 'PATCH',
        body: formData_,
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })

      setImageFile(null)
      setEditing(false)
      fetchProfile()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Failed to load profile</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icons.user className="h-6 w-6" />
              <h1 className="text-4xl font-bold">My Profile</h1>
            </div>
            <Button
              variant={editing ? 'destructive' : 'default'}
              onClick={() => {
                if (editing) {
                  setFormData({
                    name: profile.name,
                    title: profile.freelancer?.title || '',
                    bio: profile.freelancer?.bio || '',
                    hourlyRate: profile.freelancer?.hourlyRate || 0,
                    skills: profile.freelancer?.skills || [],
                  })
                }
                setEditing(!editing)
              }}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
          <p className="text-muted-foreground">
            Manage your professional information and portfolio
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{profile.freelancer?.rating || 0}⭐</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{profile.freelancer?.reviewCount || 0}</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">${profile.freelancer?.hourlyRate || 0}</p>
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.image || undefined} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {editing && (
                <div className="mt-3">
                  <label className="text-sm font-medium cursor-pointer text-primary hover:underline">
                    Change Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Professional Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={!editing}
                placeholder="e.g., Full-Stack Developer, UI/UX Designer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!editing}
                placeholder="Tell clients about yourself, your experience, and expertise..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
              <Input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                disabled={!editing}
                placeholder="50"
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your expertise areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing && (
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g., React, Node.js, Python"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline">
                  Add
                </Button>
              </div>
            )}

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className={editing ? 'cursor-pointer' : ''}>
                    {skill}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}

            {formData.skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {editing ? 'Add your skills to attract more clients' : 'No skills added yet'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        {editing && (
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        )}
      </div>
    </div>
  )
}
