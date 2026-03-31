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
  title: 'Wallet & Transactions | ATXEP - Manage Your Finances',
  description: 'Manage your wallet, view transaction history, and handle payments securely on ATXEP. Track earnings, withdrawals, and financial transactions with transparency.',
  keywords: [...baseKeywords, 'wallet management', 'payment processing', 'transaction history', 'earnings tracking', 'withdrawal system'].join(', '),
  openGraph: {
    title: 'Wallet & Transactions | ATXEP',
    description: 'Manage your wallet and view complete transaction history. Safe, secure payment processing for freelancers and clients.',
    url: 'https://atxep.com/dashboard/wallet',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallet & Transactions | ATXEP',
    description: 'Manage your wallet and view complete transaction history'
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
    canonical: 'https://atxep.com/dashboard/wallet'
  }
}

export default function WalletLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
