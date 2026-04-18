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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  isVerified: boolean
  username: string | null
  freelancer: {
    title: string | null
    bio: string | null
    skills: string[]
    portfolio: string | null
    hourlyRate: number | null
  } | null
  client: {
    company: string | null
    description: string | null
  } | null
}

interface ProfileResponse {
  success: boolean
  data: UserProfile
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Freelancer-specific
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [availability, setAvailability] = useState('full-time')

  // Client-specific
  const [company, setCompany] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [preferredCategories, setPreferredCategories] = useState<string[]>([])
  const [maxBudget, setMaxBudget] = useState('')

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [projectNotifications, setProjectNotifications] = useState(true)
  const [offerNotifications, setOfferNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [showRating, setShowRating] = useState(true)
  const [showEarnings, setShowEarnings] = useState(false)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me/profile', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch profile')

      const json: ProfileResponse = await res.json()
      const data = json.data

      setProfile(data)
      setName(data.name || '')
      setUsername(data.username || '')
      setImage(data.image)

      if (data.freelancer) {
        setTitle(data.freelancer.title || '')
        setBio(data.freelancer.bio || '')
        setSkills(data.freelancer.skills || [])
        setPortfolio(data.freelancer.portfolio || '')
        setHourlyRate(data.freelancer.hourlyRate?.toString() || '')
      }

      if (data.client) {
        setCompany(data.client.company || '')
        setCompanyDescription(data.client.description || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
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
    fetchProfile()
  }, [fetchProfile])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('name', name)
      formData.append('username', username)

      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Freelancer data
      if (profile?.role === 'FREELANCER') {
        formData.append('freelancer', JSON.stringify({
          title,
          bio,
          skills,
          portfolio,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        }))
      }

      // Client data
      if (profile?.role === 'CLIENT') {
        formData.append('client', JSON.stringify({
          company,
          description: companyDescription,
        }))
      }

      const res = await fetch('/api/users/me/profile', {
        method: 'PATCH',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to update profile')

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })

      await update()
      await fetchProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!password || !newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)
      const res = await fetch('/api/users/me/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: password,
          newPassword,
        }),
      })

      if (!res.ok) throw new Error('Failed to change password')

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      })

      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/users/me/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notifications: {
            email: emailNotifications,
            sms: smsNotifications,
            projects: projectNotifications,
            offers: offerNotifications,
            messages: messageNotifications,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to save preferences')

      toast({
        title: 'Success',
        description: 'Notification settings updated',
      })
    } catch (error) {
      console.error('Error saving notifications:', error)
      toast({
        title: 'Error',
        description: 'Failed to save notification settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/users/me/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacy: {
            profileVisibility,
            showRating,
            showEarnings,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to save preferences')

      toast({
        title: 'Success',
        description: 'Privacy settings updated',
      })
    } catch (error) {
      console.error('Error saving privacy:', error)
      toast({
        title: 'Error',
        description: 'Failed to save privacy settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-12 w-64 rounded-lg mb-8" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account, profile, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div>
                <Label className="block text-sm font-medium mb-3">Profile Picture</Label>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                    {image ? (
                      <Image
                        src={image}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span>{name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-2">JPG or PNG, max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Name and Username */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@username"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <Label>Email Address</Label>
                <Input value={profile?.email || ''} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">
                  {profile?.isVerified ? (
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ✓ Verified
                      </Badge>
                    </span>
                  ) : (
                    <span>Not verified</span>
                  )}
                </p>
              </div>

              {/* Role-specific sections */}
              {profile?.role === 'FREELANCER' && (
                <>
                  <hr />
                  <div>
                    <h3 className="font-semibold mb-4">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Full Stack Developer"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself, your experience, and what you specialize in"
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 characters</p>
                      </div>

                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Select value={availability} onValueChange={setAvailability}>
                          <SelectTrigger id="availability">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
                            <SelectItem value="part-time">Part-time (20-39 hours/week)</SelectItem>
                            <SelectItem value="flexible">Flexible (as-needed)</SelectItem>
                            <SelectItem value="unavailable">Currently unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="portfolio">Portfolio URL</Label>
                        <Input
                          id="portfolio"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://yourportfolio.com"
                          type="url"
                        />
                      </div>

                      <div>
                        <Label>Skills</Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            placeholder="Add a skill and press Enter"
                          />
                          <Button onClick={handleAddSkill} variant="outline">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="cursor-pointer">
                              {skill}
                              <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-2 hover:text-red-600"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {profile?.role === 'CLIENT' && (
                <>
                  <hr />
                  <div>
                    <h3 className="font-semibold mb-4">Company Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="companyDescription">Company Description</Label>
                        <Textarea
                          id="companyDescription"
                          value={companyDescription}
                          onChange={(e) => setCompanyDescription(e.target.value)}
                          placeholder="Tell us about your company"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="maxBudget">Typical Project Budget Range ($)</Label>
                        <Input
                          id="maxBudget"
                          type="number"
                          value={maxBudget}
                          onChange={(e) => setMaxBudget(e.target.value)}
                          placeholder="e.g., 5000"
                          min="0"
                          step="100"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Button onClick={handleChangePassword} disabled={saving} className="w-full">
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Enable 2FA</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your OAuth integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Google Account</span>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">GitHub Account</span>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Project Updates</Label>
                  <p className="text-sm text-muted-foreground">New projects, status changes, and messages</p>
                </div>
                <Switch checked={projectNotifications} onCheckedChange={setProjectNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Offers & Requests</Label>
                  <p className="text-sm text-muted-foreground">When you receive offers or requests</p>
                </div>
                <Switch checked={offerNotifications} onCheckedChange={setOfferNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Messages</Label>
                  <p className="text-sm text-muted-foreground">When you receive new messages</p>
                </div>
                <Switch checked={messageNotifications} onCheckedChange={setMessageNotifications} />
              </div>

              <Button onClick={handleSaveNotifications} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Notification Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="visibility">Profile Visibility</Label>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Everyone can see</SelectItem>
                    <SelectItem value="verified-only">Verified Users Only</SelectItem>
                    <SelectItem value="connections">Connections Only</SelectItem>
                    <SelectItem value="private">Private - No one can see</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Show Rating & Reviews</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your ratings</p>
                </div>
                <Switch checked={showRating} onCheckedChange={setShowRating} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Show Earnings</Label>
                  <p className="text-sm text-muted-foreground">Display your total earnings publicly</p>
                </div>
                <Switch checked={showEarnings} onCheckedChange={setShowEarnings} />
              </div>

              <Button onClick={handleSavePrivacy} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">Download My Data</Button>
              <Button variant="outline" className="w-full">Request Account Deletion</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
