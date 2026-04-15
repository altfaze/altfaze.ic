'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discounts & Offers</h1>
        <p className="text-muted-foreground mt-2">View available discounts and special offers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Offers</CardTitle>
          <CardDescription>Take advantage of current discounts and promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
