'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Icons } from '@/components/icons'

interface Suggestion {
  id: number
  title: string
  description: string
  improvement: string
  severity: 'low' | 'medium' | 'high'
}

export default function ClientAIHelpPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'project' | 'profile' | 'pricing'>('project')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  
  // Form states
  const [projectInput, setProjectInput] = useState('')
  const [projectContext, setProjectContext] = useState('')
  
  const [profileInput, setProfileInput] = useState('')
  const [profileContext, setProfileContext] = useState('')
  
  const [pricingInput, setPricingInput] = useState('')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleGetSuggestions = useCallback(async () => {
    if (!projectInput && !profileInput && !pricingInput) {
      toast({
        title: 'Error',
        description: 'Please provide input for suggestions',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const type = activeTab === 'project' ? 'project' : activeTab === 'profile' ? 'freelancer' : 'pricing'
      const input = activeTab === 'project' ? projectInput : activeTab === 'profile' ? profileInput : pricingInput
      const context = activeTab === 'project' ? projectContext : activeTab === 'profile' ? profileContext : undefined

      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, input, context }),
      })

      if (!res.ok) {
        throw new Error('Failed to get suggestions')
      }

      const json = await res.json()
      setSuggestions(json.data?.suggestions || [])

      toast({
        title: 'Success',
        description: 'AI suggestions generated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate suggestions',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [projectInput, projectContext, profileInput, profileContext, pricingInput, activeTab, toast])

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icons.sparkles className="h-6 w-6" />
            <h1 className="text-4xl font-bold">AI Help Center</h1>
          </div>
          <p className="text-muted-foreground">
            Get AI-powered suggestions to improve your projects and attract freelancers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {(['project', 'profile', 'pricing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSuggestions([])
              }}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'project' && '📋 Project'}
              {tab === 'profile' && '👤 Profile'}
              {tab === 'pricing' && '💰 Pricing'}
            </button>
          ))}
        </div>

        {/* Project Suggestions */}
        {activeTab === 'project' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Description Suggestions</CardTitle>
              <CardDescription>
                Get AI suggestions to make your project more attractive to freelancers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title</label>
                <Input
                  placeholder="e.g., Build an E-commerce Website"
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Description (Optional)</label>
                <Textarea
                  placeholder="Paste your current project description..."
                  value={projectContext}
                  onChange={(e) => setProjectContext(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGetSuggestions}
                disabled={loading || !projectInput}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Get AI Suggestions'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Suggestions */}
        {activeTab === 'profile' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Client Profile Suggestions</CardTitle>
              <CardDescription>
                Get suggestions to complete and improve your client profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company/Name</label>
                <Input
                  placeholder="Your company or name"
                  value={profileInput}
                  onChange={(e) => setProfileInput(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Bio (Optional)</label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={profileContext}
                  onChange={(e) => setProfileContext(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGetSuggestions}
                disabled={loading || !profileInput}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Get Profile Suggestions'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pricing Suggestions */}
        {activeTab === 'pricing' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Budget & Pricing Suggestions</CardTitle>
              <CardDescription>
                Get AI suggestions for competitive project budgeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Details</label>
                <Textarea
                  placeholder="Describe your project and what you're looking to pay..."
                  value={pricingInput}
                  onChange={(e) => setPricingInput(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGetSuggestions}
                disabled={loading || !pricingInput}
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Get Pricing Suggestions'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Suggestions Display */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Suggestions</h2>
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </div>
                    <Badge className={getSeverityColor(suggestion.severity)}>
                      {suggestion.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">💡 Suggestion:</p>
                    <p className="text-sm text-muted-foreground">{suggestion.improvement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Ready to post your project?</h3>
          <p className="text-muted-foreground mb-4">
            Follow these suggestions and post your project to get proposals from expert freelancers
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/client/projects">
              <Button variant="outline">View My Projects</Button>
            </Link>
            <Link href="/client/hire">
              <Button>Post New Project</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
