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
  title: 'Find Work | ATXEP - Freelance Opportunities',
  description: 'Find and apply for freelance work on ATXEP. Browse available projects, remote jobs, and opportunities. Connect with clients and grow your freelance career.',
  keywords: [...baseKeywords, 'find work', 'freelance opportunities', 'remote jobs', 'freelance jobs', 'work opportunities'].join(', '),
  openGraph: {
    title: 'Find Work | ATXEP - Freelance Opportunities',
    description: 'Browse available freelance projects and opportunities. Find work that matches your skills and interests.',
    url: 'https://atxep.com/dashboard/work',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Work | ATXEP - Freelance Opportunities',
    description: 'Browse freelance jobs and opportunities on ATXEP'
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
    canonical: 'https://atxep.com/dashboard/work'
  }
}

export default function WorkLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
