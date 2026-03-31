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
  title: 'Requests | ATXEP - Manage Work Requests',
  description: 'View and manage all work requests on ATXEP. Accept, decline, or negotiate project proposals from clients. Keep track of all incoming opportunities.',
  keywords: [...baseKeywords, 'work requests', 'project proposals', 'client requests', 'job offers', 'opportunity management'].join(', '),
  openGraph: {
    title: 'Requests | ATXEP - Manage Your Opportunities',
    description: 'Manage all work requests and project proposals in one place. Accept opportunities and grow your freelance business.',
    url: 'https://atxep.com/dashboard/requests',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Requests | ATXEP',
    description: 'Manage work requests and project proposals on ATXEP'
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
    canonical: 'https://atxep.com/dashboard/requests'
  }
}

export default function RequestsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
