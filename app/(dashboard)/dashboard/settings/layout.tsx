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
  title: 'Settings | ATXEP - Manage Your Account',
  description: 'Manage your ATXEP account settings. Update profile, preferences, notifications, and security settings. Control your account and privacy.',
  keywords: [...baseKeywords, 'account settings', 'profile management', 'user preferences', 'account security', 'notification settings'].join(', '),
  openGraph: {
    title: 'Settings | ATXEP - Account Management',
    description: 'Manage your ATXEP account settings, profile, and preferences all in one place.',
    url: 'https://atxep.com/dashboard/settings',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settings | ATXEP - Account Management',
    description: 'Manage your ATXEP account and settings'
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
    canonical: 'https://atxep.com/dashboard/settings'
  }
}

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
