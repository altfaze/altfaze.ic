// app/(marketing)/hire/layout.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'

export const metadata: Metadata = generateMetadata({
  title: 'Hire Web Developers, Designers & Freelancers - Best Freelance Platform',
  description: 'Hire expert web developers, UI/UX designers, and professional freelancers on Altfaze. Find skilled developers for web development, design, and more. Affordable rates, secure payments.',
  keywords: [
    'hire web developers',
    'hire developers',
    'freelance marketplace',
    'hire freelancers',
    'web developers for hire',
    'UI/UX designers',
    'freelance developers',
    'hire remote developers',
    'freelance platform'
  ],
  path: '/hire'
})

export default function HireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
