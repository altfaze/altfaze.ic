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
  title: 'Hire Talent | ATXEP - Find & Hire Freelancers',
  description: 'Browse and hire talented freelancers on ATXEP. Find web developers, designers, writers, and other professionals. Post projects and connect with experts.',
  keywords: [...baseKeywords, 'hire talent', 'find freelancers', 'freelancer profiles', 'expert hiring', 'talent marketplace'].join(', '),
  openGraph: {
    title: 'Hire Talent | ATXEP - Find & Hire Freelancers',
    description: 'Browse talented freelancers and hire the best professionals for your projects. Easy hiring, secure payments.',
    url: 'https://atxep.com/dashboard/hire',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Talent | ATXEP - Find Freelancers',
    description: 'Browse and hire talented freelancers on ATXEP marketplace'
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
    canonical: 'https://atxep.com/dashboard/hire'
  }
}

export default function HireLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
