"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/more-icons"

export default function FindWorkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Work</h1>
        <p className="text-muted-foreground mt-2">Browse available projects and find your next opportunity</p>
      </div>

      {/* Search and filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Search projects..." />
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Available projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Projects</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>Project Title {i}</CardTitle>
                    <CardDescription>Posted 2 days ago</CardDescription>
                  </div>
                  <div className="text-lg font-bold text-primary">₹5,000 - ₹15,000</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">Project description goes here. This is an excellent opportunity for experienced developers...</p>
                <div>
                  <p className="text-xs font-semibold mb-2">Skills Required:</p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="bg-primary/10 text-xs px-2 py-1 rounded">React</span>
                    <span className="bg-primary/10 text-xs px-2 py-1 rounded">TypeScript</span>
                    <span className="bg-primary/10 text-xs px-2 py-1 rounded">Design</span>
                  </div>
                </div>
                <Button className="w-full">View Details & Apply</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
