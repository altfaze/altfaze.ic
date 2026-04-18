'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Platform insights and analytics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Analytics and reporting system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will provide admins with:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>User growth and activity trends</li>
            <li>Project statistics and completion rates</li>
            <li>Revenue and earnings breakdown</li>
            <li>Fraud detection and risk analysis</li>
            <li>Performance metrics and KPIs</li>
            <li>Exportable reports (PDF, CSV)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
