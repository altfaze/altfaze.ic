"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discounts & Offers</h1>
        <p className="text-muted-foreground mt-2">Apply coupons and view available discounts</p>
      </div>

      {/* Promo code input */}
      <Card>
        <CardHeader>
          <CardTitle>Apply Promo Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Promo / Coupon Code</label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
              />
              <Button>Apply</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active offers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Offers</h2>
        <div className="space-y-4">
          {[
            { code: "WELCOME20", discount: "20%", description: "New user welcome discount", expires: "30 days" },
            { code: "SAVE10", discount: "10%", description: "Save 10% on all templates", expires: "60 days" },
            { code: "REFER5", discount: "₹500", description: "Referral bonus credit", expires: "90 days" },
          ].map((offer) => (
            <Card key={offer.code}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg">{offer.code}</p>
                      <Badge variant="secondary">{offer.discount} OFF</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Expires in {offer.expires}</p>
                  </div>
                  <Button>Copy Code</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Applied discounts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applied Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No discounts currently applied</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
