// app/(marketing)/contact/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema } from '@/lib/seo/seo-head'
import { MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact Altfaze - Support & Business Inquiries',
  description: 'Get in touch with the Altfaze team. We\'re here to help with support, partnerships, or any questions about our freelance marketplace.',
  keywords: ['contact altfaze', 'support', 'help', 'business inquiries'],
  path: '/contact',
  ogTitle: 'Contact Altfaze',
  ogDescription: 'Reach out to our team at Altfaze. Available 24/7 for support and inquiries.'
})

const schemas = [
  generateSchema('webpage', {
    title: 'Contact Altfaze',
    description: 'Get in touch with Altfaze support',
    path: '/contact'
  }),
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' }
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Altfaze',
    email: 'support@altfaze.in',
    telephone: '+91-XXXXX-XXXXX',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India'
    }
  }
]

export default function ContactPage() {
  return (
    <>
      <MultiSchemaRenderer schemas={schemas.slice(0, 2).map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Get in Touch
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Have questions? Our support team is available 24/7 to help. We typically respond within 1 hour.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start a live chat with our support team. Available Monday-Sunday, 9 AM - 11 PM IST.
                </p>
                <Link href="/contact?method=chat">
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">📧</span>
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>support@altfaze.in</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  For detailed issues, email us and we'll get back within 2 hours.
                </p>
                <Link href="mailto:support@altfaze.in">
                  <Button variant="outline" className="w-full">Send Email</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Call us for urgent issues.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Mon-Fri: 9 AM - 6 PM IST</strong>
                </p>
                <Link href="tel:+91-XXXXX-XXXXX">
                  <Button variant="outline" className="w-full">Call Us</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
                <summary className="font-semibold">What are the support hours?</summary>
                <p className="mt-3 text-muted-foreground">
                  Email and chat support: 24/7, available every day. Phone support: Monday-Friday, 9 AM - 6 PM IST. Average response time: 30 minutes for chat, 2 hours for email.
                </p>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
                <summary className="font-semibold">How do I report a bug or issue?</summary>
                <p className="mt-3 text-muted-foreground">
                  Use the chat support or email support@altfaze.in with details about the issue. Include screenshots if possible. Our technical team will investigate immediately.
                </p>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
                <summary className="font-semibold">Can I schedule a call with someone?</summary>
                <p className="mt-3 text-muted-foreground">
                  For business inquiries or special requirements, you can request a callback through chat or email. Our team will schedule a call at your convenience.
                </p>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
                <summary className="font-semibold">What about data privacy?</summary>
                <p className="mt-3 text-muted-foreground">
                  Your data is completely safe. We follow GDPR, ISO 27001, and Indian data protection laws. Read our Privacy Policy for details.
                </p>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
                <summary className="font-semibold">Who do I contact for partnerships?</summary>
                <p className="mt-3 text-muted-foreground">
                  Email partnerships@altfaze.in with your proposal. We're open to collaborations with platforms, agencies, and businesses.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[48rem]">
          <h2 className="text-3xl font-bold mb-8 text-center">Send us a Message</h2>
          
          <form className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <Input placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <Input type="email" placeholder="your@email.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Subject *</label>
              <Input placeholder="How can we help?" required />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Message *</label>
              <textarea
                className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 min-h-32 resize-none"
                placeholder="Tell us more about your inquiry..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required>
                <option value="">-- Select Category --</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing & Payments</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              Send Message
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We'll respond to your message within 2 hours. Your data is secure and won't be shared with third parties.
            </p>
          </form>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl font-bold mb-8 text-center">Other Contact Options</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ In-app chat with support team</li>
                <li>✓ Help & resources section</li>
                <li>✓ Community forums</li>
                <li>✓ Email: freelancer-support@altfaze.in</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">For Clients</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ In-app chat with support team</li>
                <li>✓ Project management help</li>
                <li>✓ Dedicated account manager (for Enterprise)</li>
                <li>✓ Email: client-support@altfaze.in</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl font-bold mb-8">Need Help?</h2>
          
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/faq">
              <Button variant="outline">FAQ</Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">About Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
