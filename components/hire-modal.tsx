'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Freelancer {
  id: string
  name: string
  email: string
  image: string | null
  freelancer: {
    title: string
    hourlyRate: number
    rating: number
    skills: string[]
  }
}

interface HireModalProps {
  freelancer: Freelancer
}

export function HireModal({ freelancer }: HireModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Project title is required', variant: 'destructive' })
      return
    }

    if (!formData.description.trim()) {
      toast({ title: 'Error', description: 'Project description is required', variant: 'destructive' })
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({ title: 'Error', description: 'Valid amount is required', variant: 'destructive' })
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/hire/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: freelancer.id,
          title: formData.title,
          description: formData.description,
          amount: parseFloat(formData.amount),
          deadline: formData.deadline || undefined,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to send offer')
      }

      const data = await res.json()

      toast({
        title: 'Success!',
        description: 'Hire offer sent to freelancer. You can chat with them now.',
      })

      setFormData({ title: '', description: '', amount: '', deadline: '' })
      setOpen(false)

      // Redirect to orders
      router.push('/client/orders')
    } catch (error) {
      console.error('Error sending hire offer:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send offer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Hire Freelancer</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Hire {freelancer.name}</SheetTitle>
          <SheetDescription>
            Send a project offer to {freelancer.name || 'this freelancer'}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {/* Freelancer Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={freelancer.image || undefined} />
                  <AvatarFallback>{freelancer.name?.charAt(0) || 'F'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{freelancer.name}</div>
                  <div className="text-sm text-muted-foreground">{freelancer.freelancer?.title}</div>
                  {freelancer.freelancer?.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm">⭐ {freelancer.freelancer.rating.toFixed(1)}</span>
                      <Badge variant="secondary" className="text-xs">
                        ${freelancer.freelancer.hourlyRate}/hr
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              {freelancer.freelancer?.skills && freelancer.freelancer.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {freelancer.freelancer.skills.slice(0, 4).map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                placeholder="e.g., Build a landing page"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Project Description *</label>
              <Textarea
                placeholder="Describe the project and what you need..."
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Budget ($) *</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Deadline (Optional)</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Offer'
              )}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
