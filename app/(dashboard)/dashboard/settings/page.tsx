"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { icons } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" className="mt-2" disabled />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-3 py-2 mt-2 border border-input rounded-md bg-background"
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Role settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Role</CardTitle>
          <CardDescription>Change your account type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Current Role: <span className="text-primary">Client</span></p>
            <p className="text-sm text-muted-foreground mb-4">
              Changing your role will update your dashboard and available features.
            </p>
            <Button variant="outline">Switch to Freelancer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm">Email notifications for new requests</label>
            <input type="checkbox" defaultChecked className="cursor-pointer" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Email notifications for messages</label>
            <input type="checkbox" defaultChecked className="cursor-pointer" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Weekly digest of activity</label>
            <input type="checkbox" className="cursor-pointer" />
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive">Delete Account</Button>
          <p className="text-xs text-muted-foreground">
            Deleting your account will permanently remove all your data and cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
