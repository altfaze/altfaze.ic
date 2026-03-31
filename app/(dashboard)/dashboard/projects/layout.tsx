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
  title: 'Projects | ATXEP - Manage Your Freelance Work',
  description: 'Browse, create, and manage freelance projects on ATXEP. Post projects, track progress, and collaborate with talented freelancers. Start your next project today.',
  keywords: [...baseKeywords, 'project management', 'freelance projects', 'project tracking', 'job posting', 'collaboration tools'].join(', '),
  openGraph: {
    title: 'Projects | ATXEP - Manage Your Freelance Work',
    description: 'Browse and manage freelance projects. Connect with talented professionals and get your work done.',
    url: 'https://atxep.com/dashboard/projects',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | ATXEP - Manage Your Work',
    description: 'Browse and manage freelance projects on ATXEP marketplace'
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
    canonical: 'https://atxep.com/dashboard/projects'
  }
}

export default function ProjectsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
