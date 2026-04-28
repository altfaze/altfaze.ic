// app/(marketing)/hire-freelance-developers-india/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/seo-head'
import { SchemaRenderer, MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

// Server-side metadata
export const metadata: Metadata = generateSEOMetadata({
  title: 'Hire Freelance Developers in India - Top Talent on Altfaze',
  description: 'Hire experienced freelance developers in India on Altfaze. Access 500+ vetted web developers, mobile developers, and full-stack engineers. Get quality work at affordable rates. Post your project today.',
  keywords: [
    'hire freelance developers India',
    'freelance web developers India',
    'hire React developer India',
    'hire Node.js developer India',
    'freelance developer marketplace India',
    'hire remote developers',
    'affordable developers India'
  ],
  path: '/hire-freelance-developers-india',
  ogTitle: 'Hire Top Freelance Developers in India | Altfaze',
  ogDescription: 'Find and hire experienced freelance developers in India. Web developers, mobile developers, full-stack engineers available at competitive rates.',
  author: 'Altfaze',
  publishedDate: new Date().toISOString()
})

const schemas = [
  generateSchema('webpage', {
    title: 'Hire Freelance Developers in India',
    description: 'Hire vetted freelance developers in India on Altfaze',
    path: '/hire-freelance-developers-india'
  }),
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hire', path: '/hire' },
    { name: 'Hire Developers India', path: '/hire-freelance-developers-india' }
  ]),
  generateFAQSchema([
    {
      question: 'How do I hire freelance developers in India on Altfaze?',
      answer: 'Create a free account on Altfaze, post your project details with requirements and budget, and receive proposals from qualified developers. Review their portfolios, ratings, and hire the best fit for your project.'
    },
    {
      question: 'Are freelance developers from India reliable?',
      answer: 'Yes! Indian developers are highly skilled and cost-effective. Altfaze verifies all developers and displays ratings from previous clients. Our escrow protection ensures secure transactions.'
    },
    {
      question: 'What is the average rate for freelance developers in India?',
      answer: 'Rates vary based on experience and expertise. Junior developers start at ₹300-500/hour, mid-level at ₹500-1000/hour, and senior developers at ₹1000+/hour. Altfaze shows all rates transparently.'
    },
    {
      question: 'Can I hire part-time or full-time developers through Altfaze?',
      answer: 'Yes! Altfaze supports both project-based work and long-term contracts. You can hire developers for specific projects or retainer arrangements.'
    }
  ])
]

export default function HireFreelanceDevelopersIndiaPage() {
  return (
    <>
      {/* Render schemas */}
      <MultiSchemaRenderer schemas={schemas.map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Hire Freelance Developers in India
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Access India's top freelance developers. Hire experienced web developers, mobile developers, and full-stack engineers at competitive rates. Secure payments, verified talents, and 100% satisfaction guaranteed.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register?role=client">
              <Button size="lg" className="text-lg">Post Your Project Now</Button>
            </Link>
            <Link href="/hire">
              <Button size="lg" variant="outline" className="text-lg">Browse Developers</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Hire Freelance Developers from India?</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">💰 Cost-Effective</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get premium quality development work at 40-60% lower costs compared to Western developers. More budget flexibility for your projects without compromising quality.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">⭐ Highly Skilled</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Indian developers are known for strong technical skills. They stay updated with latest technologies like React, Node.js, Cloud Computing, and AI/ML.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🕐 Time Zone Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <p>IST timezone overlaps with Europe. Get real-time communication, quick feedback, and faster project turnaround times compared to other regions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">✅ Verified Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All developers on Altfaze are verified with verified portfolios, client reviews, and work history. Transparent ratings help you make informed decisions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🔒 Secure Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our escrow system protects both you and developers. Funds are held securely until milestones are completed and approved.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📈 Scalability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Need a single developer or a full team? Altfaze makes it easy to scale your development resources up or down based on project needs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Types of Developers Available */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Types of Developers Available</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Web Developers</h3>
              <p className="text-muted-foreground mb-3">Full-stack, Frontend, and Backend developers skilled in React, Node.js, Django, PHP, Java, and modern frameworks. Build scalable web applications and APIs.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded">React</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 rounded">Node.js</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded">Django</span>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded">Java</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Mobile Developers</h3>
              <p className="text-muted-foreground mb-3">Native and Cross-platform mobile app developers. Build iOS, Android, and React Native apps with perfect UI/UX and performance.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded">iOS</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 rounded">Android</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded">React Native</span>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded">Flutter</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Full-Stack Developers</h3>
              <p className="text-muted-foreground mb-3">MERN (MongoDB, Express, React, Node.js), MEAN, LAMP stack specialists. Handle entire project from frontend to backend and database.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded">MERN</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 rounded">MEAN</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded">LAMP</span>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded">Database Design</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">DevOps & Cloud Engineers</h3>
              <p className="text-muted-foreground mb-3">Infrastructure, DevOps, and cloud specialists. Deploy and manage applications on AWS, Google Cloud, Azure. Container orchestration and CI/CD pipelines.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded">AWS</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 rounded">Docker</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded">Kubernetes</span>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded">CI/CD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works - 4 Simple Steps</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Post Your Project</h3>
                <p className="text-muted-foreground">Describe your project requirements, skills needed, timeline, and budget. Be as detailed as possible to attract the right developers.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Proposals</h3>
                <p className="text-muted-foreground">Qualified developers from India will submit detailed proposals with their experience, portfolio links, and proposed timelines. Compare multiple options.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Hire the Best</h3>
                <p className="text-muted-foreground">Review portfolios, client reviews, and ratings. Interview top candidates and select the developer that best fits your project needs.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center font-bold text-lg">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Collaborate & Complete</h3>
                <p className="text-muted-foreground">Work directly with your developer, track progress, make payments securely through escrow, and complete your project with confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Transparent Pricing - No Hidden Costs</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Entry Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold">₹250-500</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ Basic projects</li>
                  <li>✓ 1-3 years experience</li>
                  <li>✓ Good for learning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mid-Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold">₹500-1000</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ Complex projects</li>
                  <li>✓ 3-7 years experience</li>
                  <li>✓ Best value</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Senior/Expert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold">₹1000+</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ Enterprise projects</li>
                  <li>✓ 7+ years experience</li>
                  <li>✓ Tech leads</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
            <p className="text-center text-sm text-muted-foreground">
              No platform fees for first ₹5000. Secure escrow payments. Money-back guarantee if project is not completed satisfactorily.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold">What is the average turnaround time?</summary>
              <p className="mt-2 text-muted-foreground">Depends on project complexity. Small projects: 3-7 days. Medium projects: 2-4 weeks. Large projects: 1-3 months. Discuss timeline with your selected developer.</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold">What if I'm not satisfied with the work?</summary>
              <p className="mt-2 text-muted-foreground">We offer unlimited revisions until you're satisfied. If the developer doesn't meet requirements, we provide a replacement or full refund through our quality guarantee program.</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold">Can I test the developer first?</summary>
              <p className="mt-2 text-muted-foreground">Yes! You can hire on hourly basis for initial tasks or small projects to assess the developer's quality before committing to larger projects.</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold">What about confidentiality?</summary>
              <p className="mt-2 text-muted-foreground">All developers sign NDAs for project confidentiality. Your source code, business logic, and ideas are protected. Altfaze ensures complete data security.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Hire Top Freelance Developers?</h2>
          <p className="text-lg mb-8 opacity-90">Post your first project today and get proposals from qualified developers within 24 hours. It takes less than 5 minutes to get started.</p>
          <Link href="/register?role=client">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg">
              Start Hiring Now →
            </Button>
          </Link>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h3 className="text-xl font-bold mb-6">Related Pages</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/hire-mern-stack-developer" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire MERN Stack Developers</h4>
              <p className="text-sm text-muted-foreground">Specialized MongoDB, Express, React, Node.js developers</p>
            </Link>
            <Link href="/react-developer-india" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire React Developers in India</h4>
              <p className="text-sm text-muted-foreground">Expert React developers for frontend-heavy projects</p>
            </Link>
            <Link href="/hire" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Browse All Freelancers</h4>
              <p className="text-sm text-muted-foreground">View hundreds of vetted professionals across all skills</p>
            </Link>
            <Link href="/blog" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hiring Guide & Blog</h4>
              <p className="text-sm text-muted-foreground">Tips for hiring developers and project management</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
