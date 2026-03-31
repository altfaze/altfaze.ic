import { Metadata } from 'next'

const baseKeywords = [
  'freelance platform',
  'hire developers',
  'freelance marketplace',
  'web development services',
  'template marketplace',
  'hire freelancers',
  'web designers',
  'web developers',
  'SaaS marketplace',
  'project management',
  'remote work',
  'freelance jobs',
  'developer for hire',
  'web development',
  'UI/UX design',
  'app development',
  'coding services',
  'template builder',
  'freelancer portfolio',
  'digital services'
]

export const metadata: Metadata = {
  title: 'Templates | ATXEP - Buy & Sell High-Quality Templates',
  description: 'Browse and purchase high-quality templates from talented creators on ATXEP. Sell your own templates and earn passive income. Find templates for web design, development, and more.',
  keywords: [...baseKeywords, 'templates for sale', 'design templates', 'code templates', 'template marketplace', 'digital products'].join(', '),
  openGraph: {
    title: 'Templates | ATXEP - Buy & Sell Templates',
    description: 'Browse premium templates or sell your creations on ATXEP. High-quality designs, code, and digital products.',
    url: 'https://atxep.com/dashboard/templates',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Templates | ATXEP - Premium Digital Products',
    description: 'Buy and sell templates on ATXEP marketplace'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  },
  alternates: {
    canonical: 'https://atxep.com/dashboard/templates'
  }
}

export default function TemplatesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
