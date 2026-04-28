// app/(marketing)/templates/layout.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'AltFaze Templates – Buy Premium Website Templates | React, Next.js',
  description: 'Browse 1000+ professional website templates on AltFaze. Buy ready-to-deploy React, Next.js, and Tailwind templates for SaaS, e-commerce, dashboards, and more. Launch fast.',
  keywords: [
    'AltFaze templates',
    'buy website templates AltFaze',
    'React templates',
    'Next.js templates',
    'website templates marketplace',
    'SaaS templates',
    'e-commerce templates',
    'responsive templates',
    'affordable templates'
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
