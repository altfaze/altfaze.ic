'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/more-icons'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-6 text-center px-4">
        <div>
          <Icons.logo className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight mt-2">Page Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex gap-4 flex-col">
          <Button onClick={() => router.back()} className="w-full">
            Go Back
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
