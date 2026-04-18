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

export default function FreelancerAIHelpPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'proposal' | 'pricing'>('profile')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  
  // Form states
  const [profileInput, setProfileInput] = useState('')
  const [profileContext, setProfileContext] = useState('')
  
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')
  const [proposalProfile, setProposalProfile] = useState('')
  
  const [pricingInput, setPricingInput] = useState('')
  const [generatedProposal, setGeneratedProposal] = useState('')

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
    if (!profileInput && !proposalTitle && !pricingInput) {
      toast({
        title: 'Error',
        description: 'Please provide input',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const type = activeTab === 'profile' ? 'freelancer' : 'pricing'
      const input = activeTab === 'profile' ? profileInput : pricingInput
      const context = activeTab === 'profile' ? profileContext : undefined

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
  }, [profileInput, profileContext, pricingInput, activeTab, toast, proposalTitle])

  const handleGenerateProposal = useCallback(async () => {
    if (!proposalTitle || !proposalDescription || !proposalProfile) {
      toast({
        title: 'Error',
        description: 'Please fill in all proposal fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: proposalTitle,
          projectDescription: proposalDescription,
          freelancerProfile: proposalProfile,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to generate proposal')
      }

      const json = await res.json()
      setGeneratedProposal(json.data?.proposal || '')

      toast({
        title: 'Success',
        description: 'Proposal generated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate proposal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [proposalTitle, proposalDescription, proposalProfile, toast])

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(generatedProposal)
    toast({
      title: 'Copied',
      description: 'Proposal copied to clipboard',
    })
  }

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
            Get AI-powered suggestions to improve your profile and win more projects
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b overflow-x-auto">
          {(['profile', 'proposal', 'pricing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSuggestions([])
              }}
              className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'profile' && '👤 Profile'}
              {tab === 'proposal' && '📝 Proposal'}
              {tab === 'pricing' && '💰 Pricing'}
            </button>
          ))}
        </div>

        {/* Profile Suggestions */}
        {activeTab === 'profile' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Improve Your Profile</CardTitle>
              <CardDescription>
                Get suggestions to make your profile more attractive to clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Title/Expertise</label>
                <Input
                  placeholder="e.g., Full-Stack Developer, UI/UX Designer"
                  value={profileInput}
                  onChange={(e) => setProfileInput(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Bio (Optional)</label>
                <Textarea
                  placeholder="Your current profile bio..."
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
                {loading ? 'Analyzing...' : 'Get Profile Suggestions'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Proposal Generator */}
        {activeTab === 'proposal' && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Generate Winning Proposals</CardTitle>
                <CardDescription>
                  AI-powered proposal generator to help you stand out
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title</label>
                  <Input
                    placeholder="e.g., Build an E-commerce Website"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <Textarea
                    placeholder="Paste the project description from the listing..."
                    value={proposalDescription}
                    onChange={(e) => setProposalDescription(e.target.value)}
                    disabled={loading}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Profile Summary</label>
                  <Textarea
                    placeholder="e.g., 5+ years React, 3+ years Node.js, expert in PostgreSQL"
                    value={proposalProfile}
                    onChange={(e) => setProposalProfile(e.target.value)}
                    disabled={loading}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerateProposal}
                  disabled={loading || !proposalTitle || !proposalDescription || !proposalProfile}
                  className="w-full"
                >
                  {loading ? 'Generating...' : 'Generate Proposal'}
                </Button>
              </CardContent>
            </Card>

            {generatedProposal && (
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle>Your Generated Proposal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-4 rounded-lg border">
                    <p className="text-sm whitespace-pre-wrap">{generatedProposal}</p>
                  </div>
                  <Button onClick={handleCopyProposal} variant="outline" className="w-full">
                    <Icons.copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Pricing Suggestions */}
        {activeTab === 'pricing' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pricing Recommendations</CardTitle>
              <CardDescription>
                Get suggestions for competitive and fair pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Details</label>
                <Textarea
                  placeholder="Describe the project, your experience level, and current market situation..."
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
                  <div className="bg-background p-4 rounded-lg">
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
          <h3 className="text-xl font-bold mb-2">Ready to take action?</h3>
          <p className="text-muted-foreground mb-4">
            Implement these suggestions and start winning more projects
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/freelancer/profile">
              <Button variant="outline">Update Profile</Button>
            </Link>
            <Link href="/freelancer/my-requests">
              <Button>View Job Opportunities</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
