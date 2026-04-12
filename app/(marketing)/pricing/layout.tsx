// app/(marketing)/pricing/layout.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'Affordable Pricing Plans - Hire Freelancers & Buy Templates',
  description: 'Transparent pricing for hiring freelancers and buying website templates. No hidden fees. Pay for what you use. Secure escrow payments and commission structure.',
  keywords: [
    'freelance pricing',
    'template pricing',
    'affordable services',
    'pricing plans',
    'commission',
    'freelance rates',
    'service pricing'
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
