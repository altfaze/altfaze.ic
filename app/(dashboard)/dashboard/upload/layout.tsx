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
  title: 'Upload Template | ATXEP - Sell Your Templates',
  description: 'Upload and sell your creative templates on ATXEP. Reach thousands of buyers and earn passive income. List web templates, designs, codes, and more.',
  keywords: [...baseKeywords, 'upload template', 'sell templates', 'template upload', 'passive income', 'digital products'].join(', '),
  openGraph: {
    title: 'Upload Template | ATXEP - Sell Your Work',
    description: 'Upload your templates and start earning on ATXEP. Simple upload process, high-quality marketplace.',
    url: 'https://atxep.com/dashboard/upload',
    siteName: 'ATXEP',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upload Template | ATXEP',
    description: 'Upload and sell templates on ATXEP marketplace'
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
    canonical: 'https://atxep.com/dashboard/upload'
  }
}

export default function UploadLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
