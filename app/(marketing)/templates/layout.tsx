// app/(marketing)/templates/layout.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'Buy Premium Website Templates - React, Next.js, Tailwind',
  description: 'Browse 100+ professional website templates for React, Next.js, and more. Buy affordable website templates for SaaS, e-commerce, dashboards, and landing pages. Ready to deploy.',
  keywords: [
    'website templates',
    'buy website templates',
    'React templates',
    'Next.js templates',
    'responsive templates',
    'SaaS templates',
    'e-commerce templates',
    'landing page templates',
    'responsive design'
  ],
  path: '/templates'
})

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
