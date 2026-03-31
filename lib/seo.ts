import { Metadata } from 'next'

export const seoConfig = {
  baseKeywords: [
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
  ],
}

export function generatePageMetadata(
  title: string,
  description: string,
  additionalKeywords: string[] = [],
  pathname: string = ''
): Metadata {
  const allKeywords = [...seoConfig.baseKeywords, ...additionalKeywords]
  const url = `https://atxep.com${pathname ? `/${pathname}` : ''}`

  return {
    title,
    description,
    keywords: allKeywords.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName: 'ATXEP',
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

export const pageMetadata = {
  dashboard: generatePageMetadata(
    'Dashboard | ATXEP - Freelance Marketplace',
    'Manage your projects, earnings, and freelance activities on ATXEP platform',
    ['dashboard', 'project dashboard', 'earnings dashboard', 'freelancer dashboard'],
    'dashboard'
  ),
  wallet: generatePageMetadata(
    'Wallet & Payments | ATXEP - Manage Your Earnings',
    'Track your earnings, view transaction history, and manage withdrawals on ATXEP',
    ['wallet', 'earnings', 'payments', 'transaction history', 'withdrawal'],
    'wallet'
  ),
  projects: generatePageMetadata(
    'Projects | ATXEP - Manage Your Work',
    'View, create, and manage your freelance projects on ATXEP marketplace',
    ['projects', 'my projects', 'project management', 'freelance projects', 'project listings'],
    'projects'
  ),
  hire: generatePageMetadata(
    'Hire Freelancers | ATXEP - Find Top Talent',
    'Browse and hire talented freelancers for your projects on ATXEP marketplace',
    ['hire freelancers', 'find freelancers', 'freelancer search', 'hire developers', 'freelance marketplace'],
    'hire'
  ),
  templates: generatePageMetadata(
    'Templates | ATXEP - Buy Premium Templates',
    'Explore and purchase high-quality templates for web development and design',
    ['templates', 'template marketplace', 'buy templates', 'web templates', 'design templates'],
    'templates'
  ),
  settings: generatePageMetadata(
    'Settings | ATXEP - Manage Your Account',
    'Update your profile, preferences, and account settings on ATXEP',
    ['settings', 'account settings', 'profile', 'preferences', 'account management'],
    'settings'
  ),
}
