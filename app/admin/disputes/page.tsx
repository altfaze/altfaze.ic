'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDisputesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disputes Management</h1>
        <p className="text-muted-foreground">Resolve project disputes and conflicts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Dispute resolution system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow admins to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>View pending disputes between clients and freelancers</li>
            <li>Review dispute details and evidence</li>
            <li>Make binding resolutions</li>
            <li>Release funds based on dispute outcome</li>
            <li>Generate dispute reports for analytics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
