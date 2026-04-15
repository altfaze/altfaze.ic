'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UploadProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Project</h1>
        <p className="text-muted-foreground mt-2">Share your work and templates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Project</CardTitle>
          <CardDescription>Upload your template or project for sale</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
