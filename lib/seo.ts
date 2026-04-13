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
    'digital services','altfaze',
  'altfaze platform',
  'altfaze freelancers',
  'altfaze marketplace',
  'altfaze services',

  'hire freelancers online',
  'freelance marketplace india',
  'best freelance platform',
  'find freelance jobs online',
  'freelance work platform',
  'freelance services marketplace',
  'hire remote freelancers',
  'freelance gigs platform',

  'hire web developers india',
  'hire graphic designers online',
  'hire freelancers for startup',
  'affordable freelancers india',
  'hire developers online india',
  'freelance hiring platform',

  'earn money online freelancing',
  'how to earn from freelancing',
  'online income platform india',
  'side hustle freelance jobs',
  'work from home freelancing',
  'passive income digital products',

  'buy website templates india',
  'sell digital products online',
  'ui templates marketplace',
  'website templates marketplace',
  'digital downloads platform',
  'buy portfolio templates',
  'sell templates online india',

  'startup freelancer platform',
  'saas freelance marketplace',
  'build hire earn platform',
  'all in one freelance platform',
  'freelancer marketplace startup',

  'best fiverr alternative india',
  'upwork alternative platform',
  'freelancer platform like fiverr'
  ],
}

export function generatePageMetadata(
  title: string,
  description: string,
  additionalKeywords: string[] = [],
  pathname: string = ''
): Metadata {
  const allKeywords = [...seoConfig.baseKeywords, ...additionalKeywords]
  const url = `https://atxep.in${pathname ? `/${pathname}` : ''}`

  return {
    title,
    description,
    keywords: allKeywords.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName: 'ALTFaze',
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
    'Dashboard | ALTFaze - Freelance Marketplace',
    'Manage your projects, earnings, and freelance activities on ALTFaze platform',
    ['dashboard', 'project dashboard', 'earnings dashboard', 'freelancer dashboard'],
    'dashboard'
  ),
  wallet: generatePageMetadata(
    'Wallet & Payments | ALTFaze - Manage Your Earnings',
    'Track your earnings, view transaction history, and manage withdrawals on ALTFaze',
    ['wallet', 'earnings', 'payments', 'transaction history', 'withdrawal'],
    'wallet'
  ),
  projects: generatePageMetadata(
    'Projects | ALTFaze - Manage Your Work',
    'View, create, and manage your freelance projects on ALTFaze marketplace',
    ['projects', 'my projects', 'project management', 'freelance projects', 'project listings'],
    'projects'
  ),
  hire: generatePageMetadata(
    'Hire Freelancers | ALTFaze - Find Top Talent',
    'Browse and hire talented freelancers for your projects on ALTFaze marketplace',
    ['hire freelancers', 'find freelancers', 'freelancer search', 'hire developers', 'freelance marketplace'],
    'hire'
  ),
  templates: generatePageMetadata(
    'Templates | ALTFaze - Buy Premium Templates',
    'Explore and purchase high-quality templates for web development and design',
    ['templates', 'template marketplace', 'buy templates', 'web templates', 'design templates'],
    'templates'
  ),
  settings: generatePageMetadata(
    'Settings | ALTFaze - Manage Your Account',
    'Update your profile, preferences, and account settings on ALTFaze',
    ['settings', 'account settings', 'profile', 'preferences', 'account management'],
    'settings'
  ),
}
