// app/(marketing)/react-developer-india/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/seo-head'
import { SchemaRenderer, MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Hire React Developers in India - Expert Frontend Developers',
  description: 'Hire experienced React developers in India. Expert in React.js, Next.js, React Native. Build interactive, fast, and scalable UIs. Affordable rates, verified talent on Altfaze.',
  keywords: [
    'hire React developer India',
    'React developer for hire',
    'React.js developer',
    'hire frontend developer',
    'hire Next.js developer',
    'React specialist India'
  ],
  path: '/react-developer-india',
  ogTitle: 'Hire React Developers in India | Expert Frontend Specialists',
  ogDescription: 'Find and hire expert React developers in India. Build modern, interactive web applications. Experienced React, Next.js, and React Native developers available.',
  author: 'Altfaze',
  publishedDate: new Date().toISOString()
})

const schemas = [
  generateSchema('webpage', {
    title: 'Hire React Developers in India',
    description: 'Find skilled React developers for hire in India',
    path: '/react-developer-india'
  }),
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hire', path: '/hire' },
    { name: 'React Developers', path: '/react-developer-india' }
  ]),
  generateFAQSchema([
    {
      question: 'What is React.js?',
      answer: 'React is a JavaScript library for building user interfaces with reusable components. Developed by Facebook. Most popular frontend library in 2024. Makes building interactive UIs easy and efficient.'
    },
    {
      question: 'Why hire a React developer?',
      answer: 'React developers can build fast, interactive, modern web applications. Component-based architecture makes development scalable. React has the largest developer community and ecosystem. Perfect for single-page applications (SPAs).'
    },
    {
      question: 'What is the difference between React and Vue?',
      answer: 'React is more popular with larger ecosystem and job market. Vue is simpler to learn but smaller community. React is better for large, complex projects. Most companies prefer React developers.'
    },
    {
      question: 'Can React developers build mobile apps?',
      answer: 'Yes! React developers can use React Native to build iOS and Android apps using React knowledge. Many React developers also know React Native for cross-platform mobile development.'
    }
  ])
]

export default function HireReactDeveloperPage() {
  return (
    <>
      <MultiSchemaRenderer schemas={schemas.map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Hire React Developers in India
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Expert React.js, Next.js, and React Native developers. Build interactive, performant web applications. Vetted professionals available at competitive rates on Altfaze.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register?role=client">
              <Button size="lg" className="text-lg">Post Your Project</Button>
            </Link>
            <Link href="/hire">
              <Button size="lg" variant="outline" className="text-lg">Browse Developers</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* React Ecosystem Section */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">React Ecosystem & Specializations</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">⚛️</span>
                  React.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Core Library</strong></p>
                <p className="text-muted-foreground">Build interactive user interfaces with reusable components. State management, hooks, context API. Perfect for single-page applications (SPAs).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">▲</span>
                  Next.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>React Framework</strong></p>
                <p className="text-muted-foreground">Server-side rendering, static generation, and API routes. Better SEO for React apps. Full-stack development with React and Node.js.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  React Native
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Mobile Development</strong></p>
                <p className="text-muted-foreground">Build iOS and Android apps using React knowledge. Single codebase for multiple platforms. Share logic between web and mobile.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  UI/Component Libraries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>UI Frameworks</strong></p>
                <p className="text-muted-foreground">Material-UI, Ant Design, Chakra UI, Tailwind CSS. Pre-built components for faster development. Professional styling and accessibility.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  State Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Data Management</strong></p>
                <p className="text-muted-foreground">Redux, Zustand, Recoil, Context API. Manage complex application state. Handle side effects with Redux Thunk/Saga.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🧪</span>
                  Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Quality Assurance</strong></p>
                <p className="text-muted-foreground">Jest, React Testing Library, Cypress. Unit testing, integration testing, E2E testing. Build reliable applications.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits of React */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose React Developers?</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Virtual DOM makes React faster. Efficient re-rendering. Code splitting and lazy loading for better performance. Optimized for web and mobile.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔄 Component Reusability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Build once, use anywhere. Reusable components save development time. Consistent UI across application. Easier maintenance and updates.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📚 Large Ecosystem</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Thousands of libraries and tools. Solutions for any problem. Active community. Lots of tutorials, courses, and documentation available.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👥 Developer Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p>JSX makes code readable. Declarative approach. Excellent developer tools and browser extensions. Easy debugging and profiling.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌍 Job Market</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Most in-demand skill in web development. Highest-paying frontend positions. Abundant job opportunities. Skills are future-proof.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💼 Used by Tech Giants</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Facebook, Netflix, Airbnb, Uber, Instagram use React. Production-proven at scale. Trusted by leading tech companies worldwide.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What React Developers Can Build */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What React Developers Can Build</h2>
          
          <div className="space-y-4">
            {[
              { title: 'Single Page Applications (SPAs)', desc: 'Gmail-like interfaces, Twitter/Facebook, Trello, Figma - fast, interactive experiences without page reloads' },
              { title: 'Dashboards & Analytics', desc: 'Real-time data visualization, business intelligence, admin panels with interactive charts and metrics' },
              { title: 'Progressive Web Apps (PWAs)', desc: 'App-like experience in browser, offline functionality, push notifications, installable on home screen' },
              { title: 'E-Commerce Applications', desc: 'Shopping carts, product filters, payment integration, real-time inventory, order tracking' },
              { title: 'Social Networks', desc: 'User profiles, feeds, messaging, notifications, real-time updates, social features' },
              { title: 'Collaboration Tools', desc: 'Google Docs-like editors, Figma-like design tools, project management platforms with real-time collaboration' },
              { title: 'Mobile Apps (React Native)', desc: 'iOS and Android apps, cross-platform development, native performance with React knowledge' },
              { title: 'Streaming Platforms', desc: 'Video streaming, live streaming, interactive media players, recommendation engines' },
              { title: 'Chat Applications', desc: 'Real-time messaging, group chats, notifications, user presence indicators' },
              { title: 'Content Management Systems', desc: 'Blog platforms, CMS interfaces, content editing, publishing workflows' }
            ].map(item => (
              <div key={item.title} className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of React Developers */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Types of React Developers</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>📱 Frontend React Dev</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>UI & Interaction Focus</strong></p>
                <p className="text-muted-foreground">Specializes in user interfaces, components, and interactions. Works with APIs. Knowledge of CSS, responsive design, and accessibility.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔄 Full-Stack React Dev</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Frontend + Backend</strong></p>
                <p className="text-muted-foreground">Uses Next.js to handle frontend and backend. Can build complete applications. Knowledge of databases and APIs. Handles both React and Node.js.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📱 React Native Dev</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Mobile Apps</strong></p>
                <p className="text-muted-foreground">Builds iOS and Android apps using React. Native performance. Single codebase for multiple platforms. Mobile-first approach.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 React UI Specialist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Design & Components</strong></p>
                <p className="text-muted-foreground">Expert in UI libraries, component architecture, design systems. Builds reusable component libraries. Focus on user experience and design.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Performance Engineer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Optimization & Speed</strong></p>
                <p className="text-muted-foreground">Optimizes React apps for performance. Code splitting, lazy loading, memoization. Improves Core Web Vitals and page speed.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧪 React Test Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3"><strong>Quality Assurance</strong></p>
                <p className="text-muted-foreground">Expert in testing React applications. Unit tests, integration tests, E2E tests. Ensures code reliability and catches bugs early.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How to Hire a React Developer</h2>
          
          <div className="space-y-6">
            {[
              { num: '1', title: 'Define Your Needs', desc: 'Specify React version, libraries, project scope, timeline, and expertise level needed for your project.' },
              { num: '2', title: 'Post on Altfaze', desc: 'Create a detailed project post. React developers will receive notifications immediately.' },
              { num: '3', title: 'Review Portfolios', desc: 'Check previous React projects. Look for modern patterns, component architecture, and code quality.' },
              { num: '4', title: 'Technical Interview', desc: 'Ask about React concepts, hooks, state management, performance optimization. Check their problem-solving approach.' },
              { num: '5', title: 'Start Project', desc: 'Begin with milestones. Maintain regular communication. Payments are secure with escrow protection.' }
            ].map((step, idx) => (
              <div key={step.num} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold">{step.num}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills to Look For */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Key Skills to Look For</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold">Core React Skills</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ React Fundamentals (JSX, components, state)</li>
                <li>✓ React Hooks (useState, useEffect, useContext)</li>
                <li>✓ Component Lifecycle</li>
                <li>✓ Props & State Management</li>
                <li>✓ Event Handling & Forms</li>
                <li>✓ List Rendering & Keys</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold">Advanced Skills</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ State Management (Redux, Zustand)</li>
                <li>✓ Performance Optimization</li>
                <li>✓ Server-side Rendering (Next.js)</li>
                <li>✓ API Integration (REST, GraphQL)</li>
                <li>✓ Testing (Jest, React Testing Library)</li>
                <li>✓ Build Tools (Webpack, Vite)</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold">Supporting Skills</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ JavaScript (ES6+)</li>
                <li>✓ HTML & CSS</li>
                <li>✓ Web APIs</li>
                <li>✓ Asynchronous Programming</li>
                <li>✓ Git & Version Control</li>
                <li>✓ DevTools & Debugging</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold">Bonus Skills</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ TypeScript</li>
                <li>✓ React Native</li>
                <li>✓ Next.js</li>
                <li>✓ Tailwind CSS</li>
                <li>✓ GraphQL</li>
                <li>✓ Node.js Backend</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">React Developer Rates</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { level: 'Entry-Level', rate: '₹250-400/hr', good: 'Learning projects, basic UIs' },
              { level: 'Mid-Level', rate: '₹400-800/hr', good: 'Most projects, good quality' },
              { level: 'Senior/Expert', rate: '₹800-1500+/hr', good: 'Complex apps, tech leadership' }
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
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">FAQ</h2>
          
          <div className="space-y-4">
            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Should I hire React.js or Angular?</summary>
              <p className="mt-2 text-muted-foreground">React is more popular (80% vs 20% developer preference). Larger ecosystem, easier to learn, faster development. Better choice for most projects.</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Can React developers do backend?</summary>
              <p className="mt-2 text-muted-foreground">Pure React developers focus on frontend. Full-stack React devs using Next.js can handle backend. For backend-only, hire Node.js developers.</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">What's the learning curve for React?</summary>
              <p className="mt-2 text-muted-foreground">Basics: 1-2 weeks. Intermediate: 2-3 months. Advanced: 6+ months. Your hired dev should already know it, not be learning!</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">How many React developers do I need?</summary>
              <p className="mt-2 text-muted-foreground">Depends on project scope. Small project: 1 dev. Medium app: 2-3 devs. Large platform: 5+ devs. Consider complexity and timeline.</p>
            </details>

            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg cursor-pointer border">
              <summary className="font-semibold">Is React good for SEO?</summary>
              <p className="mt-2 text-muted-foreground">Client-side React has SEO challenges. Solution: Use Next.js for server-side rendering, or build APIs with static pages for SEO-critical content.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Hire a React Developer?</h2>
          <p className="text-lg mb-8 opacity-90">Post your project and get proposals from experienced React developers within hours. Build modern, interactive applications today.</p>
          <Link href="/register?role=client">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg">
              Post Your React Project →
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem]">
          <h3 className="text-xl font-bold mb-6">Explore More Hiring Options</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/hire-mern-stack-developer" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire MERN Stack Developer</h4>
              <p className="text-sm text-muted-foreground">Full-stack React with Node.js and MongoDB</p>
            </Link>
            <Link href="/hire-freelance-developers-india" className="block p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              <h4 className="font-semibold">Hire All Types of Developers</h4>
              <p className="text-sm text-muted-foreground">Web, mobile, backend, DevOps developers</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
