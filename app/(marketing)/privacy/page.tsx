import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy – AltFaze Freelance Marketplace',
  description: 'Read AltFaze privacy policy. Learn how we collect, use, and protect your personal data on our freelance marketplace platform.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR compliance',
    'user privacy',
    'data security'
  ],
  path: '/privacy'
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">← Back</Link>
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: April 2026</p>
          </div>

          <div className="space-y-6 prose prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. Introduction</h2>
              <p className="text-muted-foreground">
                ALTFaze (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the ALTFaze website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. Information Collection and Use</h2>
              <p className="text-muted-foreground">
                We collect several different types of information for various purposes to provide and improve our service to you.
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Types of Data Collected:</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Personal Data:</strong> Name, email address, phone number, profile information</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, pages visited, time and date of visit</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our service</li>
                    <li><strong>Communication Data:</strong> Messages, feedback, and support inquiries</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. Use of Data</h2>
              <p className="text-muted-foreground">
                ALTFaze uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service</li>
                <li>To provide customer support</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. Security of Data</h2>
              <p className="text-muted-foreground">
                The security of your data is important to us but remember that no method of transmission over the internet is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date at the top of this privacy policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy, please contact us at support@altfaze.in
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, update, or delete the information we have on you. If you would like to exercise these rights, please contact us using the information below.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
