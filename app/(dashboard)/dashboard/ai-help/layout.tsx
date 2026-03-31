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
  title: 'AI Help | ATXEP - Get Assistance & Answers',
  description: 'Get AI-powered assistance on ATXEP. Get answers to your questions, recommendations, and support. Learn how to use the platform effectively.',
  keywords: [...baseKeywords, 'AI support', 'help center', 'platform assistance', 'smart assistance', 'get help'].join(', '),
  openGraph: {
    title: 'AI Help | ATXEP - Get Assistance',
    description: 'Get AI-powered help and answers on ATXEP platform. Find assistance with projects, account, and more.',
    url: 'https://atxep.com/dashboard/ai-help',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Help | ATXEP',
    description: 'Get AI assistance on ATXEP platform'
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
    canonical: 'https://atxep.com/dashboard/ai-help'
  }
}

export default function AiHelpLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
