"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/more-icons"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Suggestion {
  id: number
  title: string
  description: string
  improvement?: string
  suggestion?: string
  severity?: 'low' | 'medium' | 'high' | 'info'
}

type SuggestionType = 'project' | 'freelancer' | 'pricing'

export default function AIHelpPage() {
  const [selectedType, setSelectedType] = useState<SuggestionType>('project')
  const [input, setInput] = useState("")
  const [context, setContext] = useState<Record<string, any>>({})
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGetSuggestions = async () => {
    if (!input.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setLoading(true)
    setError("")
    setSuggestions([])

    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          input,
          context,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.data?.suggestions || [])
      } else {
        setError("Failed to get suggestions. Please try again.")
      }
    } catch (err) {
      console.error("Error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Help Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Get AI-powered suggestions to improve your projects, profile, and pricing
        </p>
      </div>

      {/* Type selector */}
      <div className="grid gap-4 md:grid-cols-3">
        {(['project', 'freelancer', 'pricing'] as const).map((type) => (
          <Card
            key={type}
            className={`cursor-pointer transition-all ${
              selectedType === type
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => {
              setSelectedType(type)
              setSuggestions([])
            }}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                {type === 'project' && <Icons.briefcase className="h-5 w-5" />}
                {type === 'freelancer' && <Icons.user className="h-5 w-5" />}
                {type === 'pricing' && <Icons.creditCard className="h-5 w-5" />}
                <CardTitle className="text-lg capitalize">{type}</CardTitle>
              </div>
              <CardDescription>
                {type === 'project' && "Improve your project description"}
                {type === 'freelancer' && "Optimize your profile"}
                {type === 'pricing' && "Get pricing recommendations"}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Input section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedType === 'project' && "Project Description"}
            {selectedType === 'freelancer' && "About Your Profile"}
            {selectedType === 'pricing' && "Project/Service Details"}
          </CardTitle>
          <CardDescription>
            {selectedType === 'project' &&
              "Describe your project and get suggestions to attract better proposals"}
            {selectedType === 'freelancer' &&
              "Tell us about yourself and get suggestions to improve your profile"}
            {selectedType === 'pricing' &&
              "Provide project details and get pricing recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={
              selectedType === 'project'
                ? "Describe your project..."
                : selectedType === 'freelancer'
                  ? "Tell us about your skills and experience..."
                  : "Describe your service or project requirements..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="resize-none"
          />

          {/* Context fields */}
          {selectedType === 'project' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="e.g., web-development"
                  value={context.category || ""}
                  onChange={(e) => setContext({ ...context, category: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget (INR)</label>
                <Input
                  type="number"
                  placeholder="e.g., 50000"
                  value={context.budget || ""}
                  onChange={(e) => setContext({ ...context, budget: e.target.value })}
                />
              </div>
            </div>
          )}

          {selectedType === 'freelancer' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Number of Skills</label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={context.skillCount || ""}
                  onChange={(e) => setContext({ ...context, skillCount: e.target.value })}
                />
              </div>
            </div>
          )}

          {selectedType === 'pricing' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="e.g., web-development"
                  value={context.category || ""}
                  onChange={(e) => setContext({ ...context, category: e.target.value })}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGetSuggestions}
            disabled={loading || !input.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Getting suggestions...
              </>
            ) : (
              <>
                <Icons.zap className="mr-2 h-4 w-4" />
                Get AI Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Suggestions display */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Suggestions ({suggestions.length})</h2>
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                      {suggestion.severity && (
                        <Badge className={`${getSeverityColor(suggestion.severity)} text-xs`}>
                          {suggestion.severity.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{suggestion.description}</CardDescription>
                  </div>
              </div>
              </CardHeader>
              {(suggestion.improvement || suggestion.suggestion) && (
                <CardContent>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">💡 Suggestion:</p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.improvement || suggestion.suggestion}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.zap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Enter your details and click "Get AI Suggestions" to start improving
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icons.check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Technology Recommendations</p>
                <p className="text-sm text-muted-foreground">Suggested tech stack based on your requirements</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icons.check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Freelancer Suggestions</p>
                <p className="text-sm text-muted-foreground">Recommended freelancers for your project</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icons.check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Template Recommendations</p>
                <p className="text-sm text-muted-foreground">Suggested templates to accelerate development</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icons.check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Budget Estimation</p>
                <p className="text-sm text-muted-foreground">Estimated project costs and timeline</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
