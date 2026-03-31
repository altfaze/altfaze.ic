"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/more-icons"

export default function UploadProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Project</h1>
        <p className="text-muted-foreground mt-2">Sell your templates, components, themes, or digital products</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Project</CardTitle>
          <CardDescription>Share your creation with the ATXEP community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input id="title" placeholder="Enter project title" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select className="w-full px-3 py-2 mt-2 border border-input rounded-md bg-background">
                <option>Select category</option>
                <option>React Components</option>
                <option>Website Template</option>
                <option>UI Kit</option>
                <option>Design Assets</option>
                <option>Full Project</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                placeholder="Describe your project..."
                rows={5}
                className="w-full px-3 py-2 mt-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" placeholder="0.00" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="file">Project File *</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <Icons.upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">ZIP, RAR, or TAR files up to 500MB</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button>Publish Project</Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your uploads */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Uploads</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Icons.upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects uploaded yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
