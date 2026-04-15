'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function FindWorkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Work</h1>
        <p className="text-muted-foreground mt-2">Browse available projects and opportunities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Projects</CardTitle>
          <CardDescription>Find and apply for projects that match your skills</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
