'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'

interface UserProfile {
  user: {
    id: string
    name: string
    email: string
    image: string
    role: string
  }
  freelancer?: {
    title: string
    bio: string
    skills: string[]
    hourlyRate: number
  }
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'FREELANCER'>(
    (session?.user?.role as 'CLIENT' | 'FREELANCER') || 'CLIENT'
  )
  const [switchingRole, setSwitchingRole] = useState(false)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const endpoint =
        session?.user?.role === 'FREELANCER'
          ? '/api/freelancers/me/profile'
          : '/api/clients/me/profile'

      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('Failed to fetch profile')

      const data = await res.json()
      setProfile(data.data)
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
  }, [session?.user?.role, toast])

  useEffect(() => {
    fetchProfile()
  }, [session?.user?.role, fetchProfile])

  const handleRoleSwitch = async (newRole: 'CLIENT' | 'FREELANCER') => {
    if (newRole === session?.user?.role) {
      return
    }

    try {
      setSwitchingRole(true)
      const res = await fetch('/api/users/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to switch role')
      }

      const data = await res.json()

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          role: newRole,
        },
      })

      setSelectedRole(newRole)

      toast({
        title: 'Success',
        description: `Switched to ${newRole} role. Page will reload...`,
      })

      // Reload page after short delay
      setTimeout(() => {
        router.refresh()
        location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error switching role:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to switch role',
        variant: 'destructive',
      })
    } finally {
      setSwitchingRole(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation depends on specific profile fields
    // This is a placeholder for the actual implementation
    toast({
      title: 'Coming Soon',
      description: 'Profile editing is being configured',
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="role">Role & Access</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={profile?.user?.name || ''}
                    disabled
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    value={profile?.user?.email || ''}
                    disabled
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Current Role</label>
                  <Badge variant="outline" className="text-base py-1 px-3">
                    {session?.user?.role || 'CLIENT'}
                  </Badge>
                </div>

                {session?.user?.role === 'FREELANCER' && profile?.freelancer && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        defaultValue={profile.freelancer.title || ''}
                        placeholder="e.g., Senior React Developer"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Hourly Rate</label>
                      <Input
                        type="number"
                        defaultValue={profile.freelancer.hourlyRate || 0}
                        placeholder="0"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Bio</label>
                      <Textarea
                        defaultValue={profile.freelancer.bio || ''}
                        placeholder="Tell clients about yourself"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.freelancer.skills?.map(skill => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role & Access Tab */}
        <TabsContent value="role" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Switch Role</CardTitle>
              <CardDescription>
                Switch between Client and Freelancer roles to access different features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    selectedRole === 'CLIENT'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRole('CLIENT')}
                >
                  <div className="font-semibold mb-2">Client</div>
                  <p className="text-sm text-muted-foreground">
                    Browse freelancers, hire talent, post projects
                  </p>
                </Card>

                <Card
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    selectedRole === 'FREELANCER'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRole('FREELANCER')}
                >
                  <div className="font-semibold mb-2">Freelancer</div>
                  <p className="text-sm text-muted-foreground">
                    Offer services, upload work, accept projects
                  </p>
                </Card>
              </div>

              <div className="pt-4">
                {selectedRole === session?.user?.role ? (
                  <p className="text-sm text-muted-foreground">
                    You are currently using the {selectedRole} role
                  </p>
                ) : (
                  <Button
                    onClick={() => handleRoleSwitch(selectedRole)}
                    disabled={switchingRole}
                    className="w-full"
                  >
                    {switchingRole ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Switching...
                      </>
                    ) : (
                      `Switch to ${selectedRole}`
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security and sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Account Status</h3>
                <Badge variant="outline">Active</Badge>
              </div>

              <div className="pt-4">
                <Button
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
