// lib/seo/seo-head.ts
// Centralized SEO metadata and schema system for all pages
import { Metadata } from 'next'

export interface SEOHeadConfig {
  // Basic metadata
  title: string
  description: string
  keywords?: string[]
  path: string

  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'

  // Twitter
  twitterCard?: 'summary' | 'summary_large_image'
  twitterImage?: string

  // Indexing
  index?: boolean
  follow?: boolean

  // Canonical
  canonical?: string

  // Structured data
  schema?: 'page' | 'article' | 'job' | 'product' | 'faq' | 'breadcrumb' | 'local-business' | 'organization'

  // Author & publication
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

const DOMAIN = 'https://altfaze.in'
const DEFAULT_IMAGE = `${DOMAIN}/og-image.png`
const DEFAULT_KEYWORDS = [
  'freelance marketplace',
  'hire freelancers',
  'hire developers',
  'website templates',
  'freelance jobs',
  'Altfaze'
]

/**
 * Generate Next.js Metadata object from SEO config
 * Handles all meta tags, Open Graph, Twitter Cards, and canonical URLs
 */
export function generateSEOMetadata(config: SEOHeadConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    path,
    ogTitle = title,
    ogDescription = description,
    ogImage = DEFAULT_IMAGE,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    twitterImage = ogImage,
    index = true,
    follow = true,
    canonical = `${DOMAIN}${path}`,
    author = 'Altfaze',
    publishedDate,
    modifiedDate
  } = config

  const fullKeywords = [...keywords, ...DEFAULT_KEYWORDS].slice(0, 15)

  return {
    title: `${title} | Altfaze`,
    description,
    keywords: fullKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: 'Altfaze',
    robots: {
      index,
      follow,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index,
        follow,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    openGraph: {
      type: (ogType === 'product' ? 'website' : ogType) as 'article' | 'website',
      url: canonical,
      title: ogTitle,
      description: ogDescription,
      siteName: 'Altfaze',
      locale: 'en_IN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png'
        }
      ],
      ...(publishedDate && { publishedTime: publishedDate }),
      ...(modifiedDate && { modifiedTime: modifiedDate })
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: [twitterImage],
      creator: '@altfaze',
      site: '@altfaze'
    },
    alternates: {
      canonical
    },
    icons: {
      icon: `${DOMAIN}/favicon.ico`,
      apple: `${DOMAIN}/apple-touch-icon.png`
    }
  }
}

/**
 * Generate schema.org JSON-LD structured data
 */
export interface SchemaConfig {
  title: string
  description: string
  path: string
  image?: string
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

export function generateSchema(type: string, config: SchemaConfig): Record<string, any> {
  const url = `${DOMAIN}${config.path}`
  const image = config.image || DEFAULT_IMAGE

  const baseSchema = {
    '@context': 'https://schema.org',
    url,
    name: config.title,
    description: config.description,
    image,
    inLanguage: 'en-IN'
  }

  switch (type) {
    case 'webpage':
      return {
        ...baseSchema,
        '@type': 'WebPage',
        publisher: {
          '@type': 'Organization',
          name: 'Altfaze',
          logo: {
            '@type': 'ImageObject',
            url: `${DOMAIN}/logo.png`,
            width: 250,
            height: 60
          }
        }
      }

    case 'article':
      return {
        ...baseSchema,
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: config.author || 'Altfaze Team'
        },
        datePublished: config.publishedDate,
        dateModified: config.modifiedDate || config.publishedDate,
        publisher: {
          '@type': 'Organization',
          name: 'Altfaze',
          logo: {
            '@type': 'ImageObject',
            url: `${DOMAIN}/logo.png`
          }
        }
      }

    case 'product':
      return {
        ...baseSchema,
        '@type': 'Product',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: '0',
          highPrice: '100000',
          offerCount: '1000+',
          url: url
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '2500'
        }
      }

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage'
      }

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList'
      }

    default:
      return baseSchema
  }
}

/**
 * Generate FAQ schema for pages
 */
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[]): Record<string, any> {
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

/**
 * Generate Job Posting schema
 */
export interface JobPostingConfig {
  title: string
  description: string
  location: string
  salary?: {
    currency: string
    amount: number
    unit: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
  }
  skills: string[]
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'OTHER'
  postedDate: string
  validThrough?: string
}

export function generateJobPostingSchema(config: JobPostingConfig): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: config.title,
    description: config.description,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressLocality: config.location
      }
    },
    employmentType: config.jobType,
    ...(config.salary && {
      baseSalary: {
        '@type': 'PriceSpecification',
        priceCurrency: config.salary.currency,
        price: config.salary.amount,
        unitText: config.salary.unit
      }
    }),
    skills: config.skills,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Altfaze',
      sameAs: 'https://altfaze.in',
      logo: `${DOMAIN}/logo.png`
    },
    datePosted: config.postedDate,
    ...(config.validThrough && { validThrough: config.validThrough })
  }
}

/**
 * Generate BreadcrumbList schema
 */
export interface BreadcrumbItem {
  name: string
  path: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${DOMAIN}${item.path}`
    }))
  }
}
