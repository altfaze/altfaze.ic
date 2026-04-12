'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { Session } from 'next-auth'

interface Template {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string | null
  rating: number
  downloads: number
  features: string[]
  uploader: { id: string; name: string; image: string | null }
  createdAt: string
}

interface TemplateDetailResponse {
  success: boolean
  data: { template: Template }
}

interface PurchaseResponse {
  success: boolean
  data: { downloadToken: string }
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  const fetchTemplate = useCallback(async () => {
    try {
      const res = await fetch(`/api/templates/${params.id}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch template')

      const json: TemplateDetailResponse = await res.json()
      setTemplate(json.data.template)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load template',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, toast])

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet', {
        cache: 'no-store',
      })
      if (!res.ok) return

      const json: any = await res.json()
      setWalletBalance(json.data.user.walletBalance)
    } catch (error) {
      console.error('Failed to fetch wallet:', error)
    }
  }, [])

  const checkPurchase = useCallback(async () => {
    try {
      const res = await fetch('/api/template-purchases', {
        cache: 'no-store',
      })
      if (!res.ok) return

      const json: any = await res.json()
      const hasPurchased = json.data.purchases.some(
        (p: any) => p.templateId === params.id
      )
      setPurchased(hasPurchased)
    } catch (error) {
      console.error('Failed to check purchase:', error)
    }
  }, [params.id])

  useEffect(() => {
    fetchTemplate()
    if (session?.user) {
      const userId = (session.user as any).id || session.user.email
      if (userId) {
        fetchWallet()
        checkPurchase()
      }
    }
  }, [session?.user, fetchTemplate, fetchWallet, checkPurchase])

  const handlePurchase = async () => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    setPurchasing(true)
    try {
      const res = await fetch('/api/template-purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: params.id }),
      })

      const json: PurchaseResponse = await res.json()

      if (!res.ok) throw new Error(json.success ? 'Purchase failed' : 'Purchase failed')

      setPurchased(true)
      setWalletBalance((prev) => (template ? prev - template.price : prev))
      toast({
        title: 'Success',
        description: 'Template purchased! You can now download it.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Purchase failed',
        variant: 'destructive',
      })
    } finally {
      setPurchasing(false)
    }
  }

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/templates/${params.id}/download`, { method: 'POST' })
      if (!res.ok) throw new Error('Download failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${template?.name}.zip`
      link.click()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download template',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Template not found</p>
        <Button asChild className="mt-4">
          <Link href="/templates">Back to Templates</Link>
        </Button>
      </div>
    )
  }

  const canAfford = walletBalance >= template.price

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/templates">← Back to Templates</Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div>
            {template.image && (
              <div className="h-96 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={template.image}
                  alt={template.name}
                  width={600}
                  height={384}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{template.name}</h1>
              <p className="text-muted-foreground text-lg">{template.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{template.rating}</div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{template.downloads}</div>
                  <p className="text-xs text-muted-foreground">Downloads</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">
                    {template.price === 0 ? 'Free' : `$${template.price}`}
                  </div>
                  <p className="text-xs text-muted-foreground">Price</p>
                </CardContent>
              </Card>
            </div>

            {/* Category & Info */}
            <div>
              <div className="flex gap-2 mb-4">
                <Badge>{template.category}</Badge>
                {template.rating > 4.5 && <Badge variant="secondary">Popular</Badge>}
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Uploaded by:</strong> {template.uploader.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Features */}
            {template.features && template.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {template.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="text-primary">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purchase Section */}
            <div className="pt-4 border-t space-y-3">
              {session ? (
                <>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    <p className="text-2xl font-bold">${walletBalance}</p>
                  </div>

                  {purchased ? (
                    <>
                      <Button onClick={handleDownload} className="w-full" size="lg">
                        Download Template
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Already purchased ✓
                      </p>
                    </>
                  ) : template.price === 0 ? (
                    <Button onClick={handlePurchase} className="w-full" size="lg">
                      Get Free Template
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handlePurchase}
                        disabled={!canAfford || purchasing}
                        className="w-full"
                        size="lg"
                      >
                        {purchasing ? 'Processing...' : `Purchase for $${template.price}`}
                      </Button>
                      {!canAfford && (
                        <p className="text-xs text-destructive">
                          Insufficient wallet balance. Need ${template.price - walletBalance} more.
                        </p>
                      )}
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/wallet">Add Funds to Wallet</Link>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Button asChild className="w-full" size="lg">
                  <Link href="/auth/login">Sign in to Purchase</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
