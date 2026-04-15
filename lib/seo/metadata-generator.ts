// lib/seo/metadata-generator.ts
import { Metadata } from 'next'
import { ALL_KEYWORDS } from './keywords'

interface MetadataOptions {
  title: string
  description: string
  keywords?: string[]
  path: string
  image?: string
  ogTitle?: string
  ogDescription?: string
}

export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    path,
    image = 'https://altfaze.in/og-image.png',
    ogTitle = title,
    ogDescription = description
  } = options

  const allKeywords = [...keywords, ...getHighPriorityKeywords()].slice(0, 10)
  const url = `https://altfaze.in${path}`

  return {
    title: `${title} | Altfaze`,
    description,
    keywords: allKeywords,
    authors: [{ name: 'Altfaze' }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title: ogTitle,
      description: ogDescription,
      siteName: 'Altfaze',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [image],
      creator: '@altfaze'
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    },
    alternates: {
      canonical: url
    }
  }
}

// Helper to get high-priority keywords
function getHighPriorityKeywords(): string[] {
  return [
    'freelance marketplace',
    'hire freelancers',
    'hire developers',
    'website templates',
    'web development',
    'freelance jobs',
    'design templates',
    'build website online',
    'affordable web development',
    'hire developers India',
    'freelance services',
    'project management platform',
    'web design agency',
    'startup services',
    'remote work platform'
  ]
}

// Generate schema for pages
export function generatePageSchema(
  title: string,
  description: string,
  path: string,
  keywords: string[] = []
) {
  const url = `https://altfaze.in${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name: title,
    description,
    image: 'https://altfaze.in/og-image.png',
    keywords: [...keywords, ...getHighPriorityKeywords()].join(', '),
    publisher: {
      '@type': 'Organization',
      name: 'Altfaze',
      logo: {
        '@type': 'ImageObject',
        url: 'https://altfaze.in/logo.png'
      }
    }
  }
}

// Generate FAQ schema with keywords
export function generateFAQSchema(
  faqs: Array<{
    question: string
    answer: string
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Generate breadcrumb schema with keywords
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://altfaze.in${item.url}`
    }))
  }
}

// Get keywords for specific page type
export function getPageKeywords(pageType: string): string[] {
  const keywordMap: Record<string, string[]> = {
    homepage: [
      'freelance marketplace',
      'hire freelancers',
      'buy website templates',
      'freelance jobs online',
      'web development services'
    ],
    templates: [
      'buy website templates',
      'website templates marketplace',
      'responsive templates',
      'React templates',
      'ecommerce templates'
    ],
    freelancers: [
      'hire web developers',
      'freelance marketplace',
      'hire developers online',
      'web development services',
      'remote freelance jobs'
    ],
    services: [
      'web development services',
      'UI UX design services',
      'mobile app development',
      'custom website development',
      'freelance services online'
    ],
    earning: [
      'earn money online',
      'sell website templates',
      'freelancing income',
      'make money freelancing',
      'digital product income'
    ]
  }

  return keywordMap[pageType] || []
}

export const KEYWORD_DENSITY = {
  optimal: '1-2%',
  range: {
    min: 0.5,
    max: 3
  }
}
