// app/(marketing)/hire-mern-stack-developer/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/seo-head'
import { SchemaRenderer, MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Hire MERN Stack Developers - Full-Stack Web Development',
  description: 'Hire experienced MERN stack developers for your web projects. MongoDB, Express, React, Node.js specialists. Expert full-stack developers available on Altfaze at affordable rates.',
  keywords: [
    'hire MERN stack developer',
    'MERN stack developer for hire',
    'hire full-stack developer',
    'React Node.js developer',
    'hire MongoDB developer',
    'MERN stack developer India'
  ],
  path: '/hire-mern-stack-developer',
  ogTitle: 'Hire MERN Stack Developers | Full-Stack Web Development',
  ogDescription: 'Expert MERN stack developers for hire. MongoDB, Express, React, Node.js specialists. Build scalable web applications with proven MERN developers.',
  author: 'Altfaze',
  publishedDate: new Date().toISOString()
})

const schemas = [
  generateSchema('webpage', {
    title: 'Hire MERN Stack Developers',
    description: 'Find experienced MERN stack developers for web development projects',
    path: '/hire-mern-stack-developer'
  }),
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hire', path: '/hire' },
    { name: 'MERN Developers', path: '/hire-mern-stack-developer' }
  ]),
  generateFAQSchema([
    {
      question: 'What is MERN stack?',
      answer: 'MERN is a powerful JavaScript full-stack framework: MongoDB (database), Express (backend framework), React (frontend library), Node.js (runtime). It allows building complete web applications with JavaScript throughout the stack.'
    },
    {
      question: 'Why hire MERN stack developers?',
      answer: 'MERN is widely used for modern web apps because it is fast, scalable, and uses JavaScript everywhere. Single technology stack reduces complexity. Developers can handle both frontend and backend.'
    },
    {
      question: 'What can MERN developers build?',
      answer: 'MERN developers can build: web applications, real-time chat apps, CMS platforms, SaaS products, dashboards, e-commerce sites, social networks, and more. Nearly any modern web project is possible with MERN.'
    },
    {
      question: 'What is the difference between MERN and MEAN stack?',
      answer: 'MEAN uses Angular instead of React. MERN is more modern with React being the industry standard. MERN is faster in development and more popular currently. Choose MERN for new projects.'
    }
  ])
]

export default function HireMernDeveloperPage() {
  return (
    <>
      <MultiSchemaRenderer schemas={schemas.map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Hire MERN Stack Developers
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Find expert MongoDB, Express, React, and Node.js developers. Build scalable, modern web applications with proven MERN specialists. Quality developers available on Altfaze.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register?role=client">
              <Button size="lg" className="text-lg">Post Your Project</Button>
            </Link>
            <Link href="/hire">
              <Button size="lg" variant="outline" className="text-lg">Browse MERN Devs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is MERN Section */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What is MERN Stack?</h2>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🗂️</span>
                  MongoDB
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>NoSQL Database</strong></p>
                <p className="text-muted-foreground">Document-oriented database that stores data in JSON-like format. Flexible schema. Highly scalable. Perfect for handling large datasets and rapid prototyping.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔧</span>
                  Express.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Backend Framework</strong></p>
                <p className="text-muted-foreground">Lightweight web framework for Node.js. Fast routing, middleware support, easy API development. Handles server logic, authentication, and database operations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">⚛️</span>
                  React
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Frontend Library</strong></p>
                <p className="text-muted-foreground">JavaScript library for building user interfaces. Component-based architecture. Reusable components make development faster. Superior performance with virtual DOM.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  Node.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Runtime Environment</strong></p>
                <p className="text-muted-foreground">JavaScript runtime for server-side code. Event-driven, non-blocking I/O model. Handles thousands of concurrent connections efficiently.</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border">
            <p className="text-center"><strong>Together:</strong> MERN enables building complete web applications using JavaScript throughout the entire stack - from database queries to user interface - making development faster and more coherent.</p>
          </div>
        </div>
      </section>

      {/* Why Hire MERN Developers */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Hire MERN Stack Developers?</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Fast Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Single language (JavaScript) across the stack means faster development, easier debugging, and quicker time-to-market for your projects.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Highly Scalable</CardTitle>
              </CardHeader>
              <CardContent>
                <p>MERN architecture is designed to scale. Handle millions of users. MongoDB scales horizontally. Node.js handles concurrent connections efficiently.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💪 Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>React's virtual DOM provides fast rendering. Node.js non-blocking I/O ensures quick response times. MongoDB indexing enables fast queries.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔄 Flexibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p>MongoDB's flexible schema allows easy schema evolution. React components are reusable and modular. Express is minimalist and highly customizable.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💼 Industry Standard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>MERN is used by major companies: Netflix, Facebook, Uber, and more. Large community, abundant resources, easy to find developers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💰 Cost-Effective</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Open-source and free. Reduced development time means lower costs. Easier hiring - more developers know MERN compared to other stacks.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Provided */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What Can MERN Developers Build?</h2>
          
          <div className="space-y-4">
            {[
              { title: 'Web Applications', desc: 'Complex, interactive web apps with real-time features, user dashboards, and advanced functionality.' },
              { title: 'Real-Time Communication', desc: 'Chat applications, collaborative tools, live notifications using WebSockets with Node.js' },
              { title: 'SaaS Products', desc: 'Subscription-based software with user management, billing, and multi-tenant architecture' },
              { title: 'E-Commerce Platforms', desc: 'Shopping carts, product catalogs, payment integration, inventory management' },
              { title: 'Admin Dashboards', desc: 'Data visualization, analytics, real-time metrics, and business intelligence tools' },
              { title: 'Content Management Systems', desc: 'Blog platforms, CMS systems with flexible content structures' },
              { title: 'Social Networks', desc: 'User profiles, feeds, messaging, and community features' },
              { title: 'Progressive Web Apps (PWA)', desc: 'App-like experience in browsers, offline functionality, push notifications' },
              { title: 'Mobile-First Platforms', desc: 'Responsive design for mobile and desktop, progressive enhancement' },
              { title: 'API Services', desc: 'RESTful APIs, GraphQL APIs for frontend and third-party integrations' }
            ].map(item => (
              <div key={item.title} className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Hire */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How to Hire a MERN Stack Developer</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Define Your Requirements</h3>
                <p className="text-muted-foreground">Clearly describe what you want built: features, functionality, design requirements, timeline, and budget. More details = better proposals.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Post Your Project</h3>
                <p className="text-muted-foreground">Create a project post on Altfaze specifying MERN stack requirement. Experienced MERN developers will see your project immediately.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Review Proposals</h3>
                <p className="text-muted-foreground">Receive proposals from MERN specialists. Check portfolios with previous MERN projects, client reviews, and expertise level.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interview & Select</h3>
                <p className="text-muted-foreground">Conduct technical interviews. Discuss architecture, database design, and approach. Select the developer with best fit for your project.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Development</h3>
                <p className="text-muted-foreground">Collaborate with developer, track progress with milestones, ensure regular communication. Release payments as milestones are completed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Look For */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What to Look For in a MERN Developer</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>✅ MERN Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Check portfolio for real MERN projects. Not just theoretical knowledge. See actual working applications they've built.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⭐ Client Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Read feedback from previous clients. Look for 4.5+ ratings. Comments about code quality, communication, and reliability matter.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📚 Latest Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Ensure they're updated with: Modern React patterns, ES6+, latest Node.js versions, MongoDB best practices, and tools like Docker.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Problem Solving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Look for developers who have solved complex problems. Experience with scaling, performance optimization, and security.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💬 Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Good communication is crucial. They should explain technical decisions, provide regular updates, and be responsive to your questions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Scalability Mindset</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">Ask about database design, API design, caching strategies. They should think about scalability from day one.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">MERN Developer Rates</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { level: 'Junior', rate: '₹300-500', exp: '0-2 years', good: 'Small projects, learning' },
              { level: 'Mid-Level', rate: '₹500-1000', exp: '2-5 years', good: 'Most projects, good quality' },
              { level: 'Senior', rate: '₹1000-2000+', exp: '5+ years', good: 'Complex projects, tech leads' }
            ].map(level => (
              <Card key={level.level}>
                <CardHeader>
                  <CardTitle>{level.level}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="text-2xl font-bold">{level.rate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="text-sm">{level.exp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best For</p>
                    <p className="text-sm">{level.good}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Common Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Can MERN be used for mobile development?</summary>
              <p className="mt-2 text-muted-foreground">React.js is for web only, but React Native uses the same concepts for mobile apps. Some MERN devs also know React Native for cross-platform mobile development.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Is MERN good for startups?</summary>
              <p className="mt-2 text-muted-foreground">Perfect for startups! Fast development, scalable from day one, large developer pool, open-source (free), and cost-effective. Ideal for MVP to scale-up journey.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">What about SEO with React apps?</summary>
              <p className="mt-2 text-muted-foreground">Client-side rendering has SEO challenges. Solution: Use Next.js (React framework) for server-side rendering, or build APIs and use static site generators for SEO-critical pages.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Can existing projects be migrated to MERN?</summary>
              <p className="mt-2 text-muted-foreground">Depends on current stack. Migration is possible but may take time. Better for new projects. Discuss migration strategy with your chosen MERN developer.</p>
            </details>

            <details className="bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">How long does MERN development take?</summary>
              <p className="mt-2 text-muted-foreground">Depends on complexity. Simple app: 1-2 weeks. Medium app: 4-8 weeks. Complex app: 3-6 months. MERN's rapid development helps reduce timelines compared to other stacks.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build with MERN Stack?</h2>
          <p className="text-lg mb-8 opacity-90">Post your project now and connect with experienced MERN developers within hours. Get quality proposals from vetted professionals.</p>
          <Link href="/register?role=client">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg">
              Post Your MERN Project →
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h3 className="text-xl font-bold mb-6">Related Hiring Pages</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/hire-freelance-developers-india" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire Freelance Developers</h4>
              <p className="text-sm text-muted-foreground">All types of developers across technologies</p>
            </Link>
            <Link href="/react-developer-india" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire React Developers</h4>
              <p className="text-sm text-muted-foreground">Expert React specialists for frontend projects</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
