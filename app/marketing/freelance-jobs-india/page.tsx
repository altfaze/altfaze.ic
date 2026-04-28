// app/(marketing)/freelance-jobs-india/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/seo-head'
import { SchemaRenderer, MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Freelance Jobs in India - Remote Work Opportunities',
  description: 'Find thousands of freelance jobs in India on Altfaze. Earn money online with flexible remote work. Web development, design, writing, marketing, and more. Work from home today.',
  keywords: [
    'freelance jobs India',
    'online jobs India',
    'work from home India',
    'remote jobs India',
    'freelance opportunities',
    'earn money online',
    'side hustle jobs'
  ],
  path: '/freelance-jobs-india',
  ogTitle: 'Freelance Jobs in India | Earn Money Online | Altfaze',
  ogDescription: 'Discover thousands of freelance job opportunities in India. Earn money working remotely. Web development, design, writing, and more. Join thousands of freelancers.',
  author: 'Altfaze',
  publishedDate: new Date().toISOString()
})

const schemas = [
  generateSchema('webpage', {
    title: 'Freelance Jobs in India',
    description: 'Find remote freelance job opportunities in India',
    path: '/freelance-jobs-india'
  }),
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/projects' },
    { name: 'Freelance Jobs India', path: '/freelance-jobs-india' }
  ]),
  generateFAQSchema([
    {
      question: 'What types of freelance jobs are available in India?',
      answer: 'Altfaze offers diverse freelance opportunities: web development, mobile app development, UI/UX design, graphic design, content writing, digital marketing, virtual assistance, data entry, and more. Browse thousands of active projects daily.'
    },
    {
      question: 'How much can I earn as a freelancer in India?',
      answer: 'Earnings vary based on skills and experience. Entry-level jobs start at ₹3000-10000 per project. Experienced freelancers earn ₹50000-500000+ per month. Your earning potential depends on specialization and reputation.'
    },
    {
      question: 'Is freelance work legitimate in India?',
      answer: 'Yes! Freelancing is completely legitimate in India. Altfaze is a licensed platform connecting genuine clients with verified freelancers. All transactions are secure and protected by Indian law.'
    },
    {
      question: 'How do I get paid for freelance work?',
      answer: 'Clients deposit funds in escrow. When you complete milestones and the client approves, funds are released to your account. Altfaze supports bank transfers, PayPal, and other payment methods.'
    }
  ])
]

export default function FreelanceJobsIndiaPage() {
  return (
    <>
      <MultiSchemaRenderer schemas={schemas.map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Freelance Jobs in India - Earn Money Online
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Thousands of remote job opportunities for Indian freelancers. Work from home, earn in your own time. Get paid securely for every project. No experience needed - jobs for all skill levels.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register?role=freelancer">
              <Button size="lg" className="text-lg">Find Jobs Now</Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="text-lg">Browse All Jobs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Freelance Jobs on Altfaze?</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">💼 Daily New Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Hundreds of new projects posted every day across all categories. Always something new to work on. Jobs matching your skills appear in your dashboard automatically.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">💰 Fair Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Set your own rates or bid on project budgets. Clients respect quality freelancers and pay premium rates for excellent work. Earn what you deserve.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🔒 Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our escrow system ensures you get paid. Clients deposit funds before you start. No unpaid invoices. Funds released when work is approved and accepted.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">⏱️ Flexible Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Work whenever you want. Full-time, part-time, or side hustle. Choose projects that fit your schedule. Balance freelancing with other commitments easily.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📈 Build Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Every completed project builds your profile and reputation. High ratings lead to better job offers at higher rates. Long-term clients choose top-rated freelancers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🌍 Global Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connect with clients worldwide. Work with startups, agencies, and enterprises. International exposure helps you build a global freelance career.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Popular Job Categories</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '💻', name: 'Web Development', desc: 'React, Node.js, Django, PHP projects' },
              { icon: '📱', name: 'Mobile Development', desc: 'iOS, Android, React Native apps' },
              { icon: '🎨', name: 'Design & UI/UX', desc: 'Website design, app UI, graphics' },
              { icon: '✍️', name: 'Content Writing', desc: 'Blog posts, articles, copywriting' },
              { icon: '📊', name: 'Digital Marketing', desc: 'SEO, social media, Google Ads' },
              { icon: '📧', name: 'Virtual Assistance', desc: 'Email, scheduling, data entry' },
              { icon: '⚙️', name: 'DevOps & Cloud', desc: 'AWS, Docker, Kubernetes, CI/CD' },
              { icon: '🔍', name: 'Data & Analytics', desc: 'Data analysis, Python, SQL' },
              { icon: '🛍️', name: 'E-Commerce', desc: 'Shopify, WooCommerce setup' },
            ].map(cat => (
              <Card key={cat.name}>
                <CardContent className="pt-6">
                  <p className="text-3xl mb-2">{cat.icon}</p>
                  <h3 className="font-semibold mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Potential */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Earning Potential by Skill Level</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Beginner Freelancer</h3>
                <span className="text-2xl font-bold text-green-600">₹5K - 25K/month</span>
              </div>
              <p className="text-muted-foreground">Entry-level tasks, simple projects, good for building portfolio. Takes 1-3 months to get first reviews and higher-paying jobs.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Intermediate Freelancer</h3>
                <span className="text-2xl font-bold text-blue-600">₹25K - 100K/month</span>
              </div>
              <p className="text-muted-foreground">Good experience, positive reviews, can handle complex projects. Most freelancers reach this level within 6-12 months of consistent work.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Advanced Freelancer</h3>
                <span className="text-2xl font-bold text-purple-600">₹100K - 500K+/month</span>
              </div>
              <p className="text-muted-foreground">Expert level, premium rates, recurring clients, long-term contracts. Achieved through consistent delivery and high-quality work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How to Start Earning - 5 Steps</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">Sign up as a freelancer on Altfaze. Add your photo, bio, skills, and hourly rates. Show your expertise and personality to attract clients.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Showcase Your Portfolio</h3>
                <p className="text-muted-foreground">Add previous work samples, projects, and achievements. If you're new, create 2-3 sample projects to showcase your skills. Quality portfolio = more job offers.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse & Bid on Jobs</h3>
                <p className="text-muted-foreground">Find projects matching your skills. Write personalized proposals explaining how you'll solve the client's problem. Better proposals = more job wins.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center font-bold text-lg">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Win & Complete Projects</h3>
                <p className="text-muted-foreground">When a client chooses you, finalize details and get started. Communicate well, deliver quality work, and complete before deadline. Success leads to better jobs.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center font-bold text-lg">5</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Paid & Build Reputation</h3>
                <p className="text-muted-foreground">When client approves work, payment is released to your account. Get review and rating. Positive feedback helps you win bigger, better-paying jobs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Success */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Tips to Win More Freelance Jobs</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>✍️ Write Strong Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Don't use generic proposals. Read job requirements carefully and explain specifically how you'll help. Show you understand the project. Personalization wins jobs.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⭐ Build Great Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Every client review matters. Deliver excellent quality, communicate regularly, meet deadlines. 5-star reviews are your best marketing tool on Altfaze.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💡 Specialize Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Don't claim you can do everything. Pick your strongest skills and become expert in that area. Specialists earn more than generalists.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Start with Small Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Begin with small, quick projects to build reputation. Once you have reviews and ratings, you can charge premium rates for bigger projects.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📱 Respond Quickly</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Reply to messages fast. Active freelancers appear higher in job listings. Quick responses show professionalism and increase job win rate.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Keep Profile Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Regularly update portfolio with latest work. Add new skills as you learn them. Fresh profile appears in more job searches.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">FAQ for Freelancers</h2>
          
          <div className="space-y-4">
            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Is Altfaze safe for freelancers?</summary>
              <p className="mt-2 text-muted-foreground">Yes! Altfaze is completely safe. We verify clients, have secure payments, handle disputes fairly, and protect your personal information.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">What if a client doesn't pay after I complete work?</summary>
              <p className="mt-2 text-muted-foreground">This rarely happens because of our escrow system. Clients deposit funds before work starts. If disputes occur, our support team resolves fairly.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Can I work with multiple clients simultaneously?</summary>
              <p className="mt-2 text-muted-foreground">Yes! Many freelancers work with multiple clients. Just ensure you meet all deadlines and maintain quality. Time management is key.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Are there platform fees?</summary>
              <p className="mt-2 text-muted-foreground">Altfaze takes a small commission (10-20%) only on completed projects. No upfront fees. More work = more earnings for you.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">How long does payment take?</summary>
              <p className="mt-2 text-muted-foreground">Once client approves work, payment is released immediately to your Altfaze wallet. Bank transfer takes 1-2 business days depending on your bank.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-green-600 text-white">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Freelance Journey Today</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of Indian freelancers earning money online. Browse 1000+ jobs available right now. First project within 24 hours guaranteed or your money back.</p>
          <Link href="/register?role=freelancer">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg">
              Sign Up Now & Find Jobs →
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h3 className="text-xl font-bold mb-6">More Resources for Freelancers</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/hire-freelance-developers-india" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire Freelance Developers</h4>
              <p className="text-sm text-muted-foreground">Understand what clients are looking for</p>
            </Link>
            <Link href="/pricing" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Pricing & Commission</h4>
              <p className="text-sm text-muted-foreground">See how much you can earn</p>
            </Link>
            <Link href="/projects" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Browse Active Jobs</h4>
              <p className="text-sm text-muted-foreground">1000+ opportunities posted daily</p>
            </Link>
            <Link href="/faq" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Help & Support</h4>
              <p className="text-sm text-muted-foreground">Get answers to common questions</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
