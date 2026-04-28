import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service – AltFaze Freelance Marketplace',
  description: 'Review AltFaze terms of service. Understand the rules, conditions, and agreements for using our freelance marketplace platform.',
  keywords: [
    'terms of service',
    'user agreement',
    'platform rules',
    'conditions',
    'terms and conditions'
  ],
  path: '/terms'
})

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">← Back</Link>
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: April 2026</p>
          </div>

          <div className="space-y-6 prose prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using the ALTFaze platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Use License</h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of the materials (information or software) on ALTFaze for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on ALTFaze</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or &quot;mirroring&quot; the materials on any other server</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on ALTFaze are provided on an &apos;as is&apos; basis. ALTFaze makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall ALTFaze or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ALTFaze, even if ALTFaze or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Accuracy of Materials</h2>
              <p className="text-muted-foreground">
                The materials appearing on ALTFaze could include technical, typographical, or photographic errors. ALTFaze does not warrant that any of the materials on its website are accurate, complete, or current. ALTFaze may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. Links</h2>
              <p className="text-muted-foreground">
                ALTFaze has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ALTFaze of the site. Use of any such linked website is at the user&apos;s own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Modifications</h2>
              <p className="text-muted-foreground">
                ALTFaze may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which ALTFaze operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
