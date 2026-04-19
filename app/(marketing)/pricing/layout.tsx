// app/(marketing)/pricing/layout.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'AltFaze Pricing – Affordable Plans to Hire Freelancers & Buy Templates',
  description: 'Simple, transparent pricing on AltFaze. Hire freelancers, buy website templates, and manage projects with flexible pricing. No hidden fees. Secure escrow protection.',
  keywords: [
    'AltFaze pricing',
    'freelance pricing AltFaze',
    'affordable freelance services',
    'AltFaze rates',
    'commission structure',
    'transparent pricing',
    'freelance platform pricing'
  ],
  path: '/pricing'
})

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
