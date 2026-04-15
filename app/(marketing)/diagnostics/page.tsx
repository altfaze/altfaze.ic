'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RoutingDiagnostics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const res = await fetch('/api/debug/route-test', { cache: 'no-store' })
        const data = await res.json()
        setDiagnostics(data)
      } catch (err) {
        console.error('Failed to fetch diagnostics:', err)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchDiagnostics()
    } else {
      setLoading(false)
    }
  }, [status])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">🔧 Routing Diagnostics</h1>
          <p className="text-muted-foreground">Check your authentication and routing status</p>
        </div>

        {status === 'unauthenticated' && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">❌ Not Authenticated</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-red-800">
                You need to log in first to access dashboards
              </p>
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {status === 'loading' && (
          <Card>
            <CardContent className="pt-6">
              <p>Loading session information...</p>
            </CardContent>
          </Card>
        )}

        {status === 'authenticated' && (
          <>
            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-mono text-sm">{session?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-mono text-sm">{session?.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="font-mono text-sm font-bold text-blue-600">
                      {(session?.user as any)?.role || '⚠️ NOT SET'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diagnostics */}
            {diagnostics && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>🔍 System Diagnostics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Session-JWT-DB Consistency:{' '}
                        <span
                          className={
                            diagnostics.diagnostics.roleConsistency.isConsistent
                              ? 'text-green-600 font-bold'
                              : 'text-red-600 font-bold'
                          }
                        >
                          {diagnostics.diagnostics.roleConsistency.isConsistent
                            ? '✅ OK'
                            : '❌ MISMATCH'}
                        </span>
                      </p>

                      {diagnostics.diagnostics.roleConsistency.isConsistent ? (
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>✅ Session role: {diagnostics.diagnostics.roleConsistency.sessionRole}</p>
                          <p>✅ JWT role: {diagnostics.diagnostics.roleConsistency.jwtRole}</p>
                          <p>✅ Database role: {diagnostics.diagnostics.roleConsistency.dbRole}</p>
                        </div>
                      ) : (
                        <div className="text-xs text-red-600 space-y-1 bg-red-50 p-3 rounded">
                          <p>❌ Session role: {diagnostics.diagnostics.roleConsistency.sessionRole}</p>
                          <p>❌ JWT role: {diagnostics.diagnostics.roleConsistency.jwtRole}</p>
                          <p>❌ Database role: {diagnostics.diagnostics.roleConsistency.dbRole}</p>
                          <p className="mt-2 font-bold">
                            Issue: Role mismatch detected. Try logging out and back in.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Access */}
                <Card>
                  <CardHeader>
                    <CardTitle>🚀 Dashboard Access</CardTitle>
                    <CardDescription>Direct links to your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {diagnostics.diagnostics.dbUser?.role === 'CLIENT' && (
                        <Button asChild className="w-full" size="lg">
                          <Link href={diagnostics.redirectUrls.clientDashboard}>
                            ✅ Go to Client Dashboard
                          </Link>
                        </Button>
                      )}

                      {diagnostics.diagnostics.dbUser?.role === 'FREELANCER' && (
                        <Button asChild className="w-full" size="lg">
                          <Link href={diagnostics.redirectUrls.freelancerDashboard}>
                            ✅ Go to Freelancer Dashboard
                          </Link>
                        </Button>
                      )}

                      {!diagnostics.diagnostics.dbUser?.role && (
                        <Button asChild className="w-full" size="lg" variant="outline">
                          <Link href="/onboard">
                            ⚠️ Complete Onboarding (Select Role)
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Raw Diagnostics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">📊 Raw Diagnostics Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(diagnostics, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </>
            )}

            {loading && <p className="text-center text-muted-foreground">Loading diagnostics...</p>}
          </>
        )}

        {/* Browser Console Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-900">💡 Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              Open your browser Developer Tools (F12) and check the Console tab for detailed logs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
