// app/about/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema } from '@/lib/seo/seo-head'
import { MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = generateSEOMetadata({
  title: 'About Altfaze - Connecting Talent with Opportunity',
  description: 'Learn about Altfaze mission, values, and how we\'re revolutionizing the freelance marketplace for India and beyond. Connecting talented freelancers with businesses worldwide.',
  keywords: [
    'about altfaze',
    'altfaze mission',
    'freelance platform',
    'altfaze team',
    'freelance marketplace'
  ],
  path: '/about',
  ogTitle: 'About Altfaze - The Future of Freelancing',
  ogDescription: 'Discover how Altfaze is building the most trusted freelance marketplace for connecting Indian talent with global opportunities.',
  author: 'Altfaze Team'
})

const schemas = [
  generateSchema('webpage', {
    title: 'About Altfaze',
    description: 'Learn about Altfaze and our mission',
    path: '/about'
  }),
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ])
]

export default function AboutPage() {
  return (
    <>
      <MultiSchemaRenderer schemas={schemas.map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            About Altfaze
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Building the world's most trusted freelance marketplace connecting talented professionals with meaningful opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
              At Altfaze, we believe everyone deserves access to meaningful work and top talent, regardless of geography. We're building the most trusted and efficient platform to connect skilled professionals with businesses that need them.
              </p>
              <p className="text-lg text-muted-foreground">
                Our goal: Empower millions of freelancers in India and beyond to earn dignified income while enabling businesses to access world-class talent at fair rates.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg p-8 min-h-64 flex items-center justify-center">
              <p className="text-4xl font-bold text-center opacity-20">Altfaze</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Values</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">🤝</span>
                  Trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We build trust through transparency, secure payments, verified profiles, and fair dispute resolution. Your confidence in our platform is everything.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">💪</span>
                  Empowerment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We empower freelancers to achieve financial independence and businesses to scale without boundaries. Success of both sides is our success.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We make freelancing accessible to everyone - low platform fees, easy onboarding, support in local languages, and payment options for all.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We're obsessed with quality. Every interaction, every feature, every payment is designed to exceed expectations and deliver excellence.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">🔒</span>
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your data and money are safe with us. Bank-level encryption, secure escrow payments, IP protection, and continuous security updates.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">📈</span>
                  Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We're committed to your growth. Resources, tools, community, and opportunities to help you succeed and achieve your goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">By the Numbers</h2>
          
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</p>
              <p className="text-muted-foreground">Active Freelancers</p>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-green-600 mb-2">5K+</p>
              <p className="text-muted-foreground">Active Clients</p>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">50K+</p>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div className="text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">₹50Cr</p>
              <p className="text-muted-foreground">Payments Processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Altfaze */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose Altfaze?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Built for India</h3>
                <p className="text-muted-foreground">We understand Indian freelancers and businesses. Local payment methods, currency support, and 24/7 support in Hindi/English.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                <p className="text-muted-foreground">Every freelancer is verified with real reviews and ratings. Quality assurance in every transaction.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">Escrow protection on every project. Your money is safe. Instant withdrawals to your bank account.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lower Fees</h3>
                <p className="text-muted-foreground">10-15% commission is lower than competitors. More earnings for freelancers, better value for businesses.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">Our support team is always available. Instant help for disputes, payments, or technical issues.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
                <p className="text-muted-foreground">No hidden fees. Transparent pricing. Freelancers set rates. Clients know exactly what they're paying.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Altfaze?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're a freelancer looking for opportunities or a business seeking talent, Altfaze has the solution.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register?role=freelancer">
              <Button size="lg">Start Freelancing</Button>
            </Link>
            <Link href="/register?role=client">
              <Button size="lg" variant="outline">Hire Talent</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
