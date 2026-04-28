// app/(marketing)/pricing/layout.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'AltFaze Pricing – Affordable Plans for Freelancers & Clients',
  description: 'Choose from our flexible pricing plans to hire freelancers, post projects, or sell website templates. No hidden fees. Transparent, secure, and affordable.',
  keywords: [
    'AltFaze pricing',
    'freelance platform pricing',
    'affordable freelance rates',
    'template marketplace pricing',
    'hiring freelancers cost',
    'freelance project pricing',
    'AltFaze plans'
  ],
  path: '/pricing',
  ogTitle: 'AltFaze Pricing – Simple & Transparent',
  ogDescription: 'Choose the perfect plan for your needs. Start hiring or earning today with AltFaze.'
})

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
