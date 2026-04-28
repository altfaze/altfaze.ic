'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Toggle } from '@/components/ui/toggle'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import Link from 'next/link'

interface Settings {
  emailNotifications: boolean
  smsNotifications: boolean
  projectNotifications: boolean
  messageNotifications: boolean
  visibility?: 'public' | 'private'
  autoAcceptOffers?: boolean
  minHourlyRate?: number
  bio?: string
  preferredCategories?: string[]
  isAvailable?: boolean
}

export default function FreelancerSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    smsNotifications: false,
    projectNotifications: true,
    messageNotifications: true,
    visibility: 'public',
    autoAcceptOffers: false,
    minHourlyRate: 0,
    bio: '',
    preferredCategories: [],
    isAvailable: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)

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
  ]

  useEffect(() => {
    setIsClient(true)
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (isClient && status === 'authenticated') {
      fetchSettings()
    }
  }, [isClient, status])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch settings')
      
      const json = await res.json()
      const fetchedSettings = json.data?.settings || json.settings || {}
      setSettings({
        emailNotifications: fetchedSettings.emailNotifications ?? true,
        smsNotifications: fetchedSettings.smsNotifications ?? false,
        projectNotifications: fetchedSettings.projectNotifications ?? true,
        messageNotifications: fetchedSettings.messageNotifications ?? true,
        visibility: fetchedSettings.visibility ?? 'public',
        autoAcceptOffers: fetchedSettings.autoAcceptOffers ?? false,
        minHourlyRate: fetchedSettings.minHourlyRate ?? 0,
        bio: fetchedSettings.bio ?? '',
        preferredCategories: fetchedSettings.preferredCategories ?? [],
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to load settings:', error)
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        throw new Error('Failed to save settings')
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      })
      
      // Reload settings to confirm
      await fetchSettings()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleCategory = (category: string) => {
    const categories = settings.preferredCategories || []
    setSettings({
      ...settings,
      preferredCategories: categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category],
    })
  }

  if (!isClient || status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
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
            <Icons.settings className="h-6 w-6" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your preferences and account settings
          </p>
        </div>

        {/* Notification Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <Toggle
                pressed={settings.emailNotifications}
                onPressedChange={(pressed) =>
                  setSettings({ ...settings, emailNotifications: pressed })
                }
              >
                {settings.emailNotifications ? 'On' : 'Off'}
              </Toggle>
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about new matching projects
                </p>
              </div>
              <Toggle
                pressed={settings.projectNotifications}
                onPressedChange={(pressed) =>
                  setSettings({ ...settings, projectNotifications: pressed })
                }
              >
                {settings.projectNotifications ? 'On' : 'Off'}
              </Toggle>
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Message Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for new messages
                </p>
              </div>
              <Toggle
                pressed={settings.messageNotifications}
                onPressedChange={(pressed) =>
                  setSettings({ ...settings, messageNotifications: pressed })
                }
              >
                {settings.messageNotifications ? 'On' : 'Off'}
              </Toggle>
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get alerts via SMS (premium feature)
                </p>
              </div>
              <Toggle
                pressed={settings.smsNotifications}
                onPressedChange={(pressed) =>
                  setSettings({ ...settings, smsNotifications: pressed })
                }
                disabled
              >
                {settings.smsNotifications ? 'On' : 'Off'}
              </Toggle>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
              Control your profile visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3">Profile Visibility</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={settings.visibility === 'public'}
                    onChange={(e) =>
                      setSettings({ ...settings, visibility: e.target.value as 'public' | 'private' })
                    }
                    className="rounded-full"
                  />
                  <span className="text-sm">
                    <strong>Public</strong> - Visible to all clients and searchable
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={settings.visibility === 'private'}
                    onChange={(e) =>
                      setSettings({ ...settings, visibility: e.target.value as 'public' | 'private' })
                    }
                    className="rounded-full"
                  />
                  <span className="text-sm">
                    <strong>Private</strong> - Only visible to those with direct link
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Preferences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Work Preferences</CardTitle>
            <CardDescription>
              Set your minimum rates and preferred project categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Hourly Rate ($)</label>
              <Input
                type="number"
                value={settings.minHourlyRate}
                onChange={(e) =>
                  setSettings({ ...settings, minHourlyRate: Number(e.target.value) })
                }
                placeholder="50"
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You won&apos;t receive notifications for projects below this rate
              </p>
            </div>

            <div className="border-t pt-4" />

            <div>
              <label className="block text-sm font-medium mb-3">Preferred Categories</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(settings.preferredCategories || []).includes(category)}
                      onChange={() => handleToggleCategory(category)}
                      className="rounded"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Available for Work</p>
                <p className="text-sm text-muted-foreground">
                  Show your profile to clients looking for freelancers
                </p>
              </div>
              <Toggle
                pressed={settings.isAvailable ?? false}
                onPressedChange={async (pressed) => {
                  const newSettings = { ...settings, isAvailable: pressed }
                  setSettings(newSettings)
                  // Immediately save to DB
                  try {
                    setSaving(true)
                    const res = await fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newSettings),
                    })
                    if (!res.ok) throw new Error('Failed to update')
                    toast({
                      title: 'Success',
                      description: `You are now ${pressed ? 'available' : 'unavailable'} for work`,
                    })
                  } catch (error) {
                    toast({
                      title: 'Error',
                      description: 'Failed to update availability',
                      variant: 'destructive',
                    })
                    // Revert on error
                    setSettings(settings)
                  } finally {
                    setSaving(false)
                  }
                }}
              >
                {(settings.isAvailable ?? false) ? 'Available' : 'Unavailable'}
              </Toggle>
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Accept Offers</p>
                <p className="text-sm text-muted-foreground">
                  Automatically accept offers matching your criteria
                </p>
              </div>
              <Toggle
                pressed={settings.autoAcceptOffers}
                onPressedChange={(pressed) =>
                  setSettings({ ...settings, autoAcceptOffers: pressed })
                }
              >
                {settings.autoAcceptOffers ? 'On' : 'Off'}
              </Toggle>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Two-Factor Authentication
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full"
          size="lg"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
