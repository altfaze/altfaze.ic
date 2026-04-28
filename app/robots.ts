// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/hire',
          '/projects',
          '/templates',
          '/pricing',
          '/keywords',
          '/faq',
          '/services',
          '/about',
          '/contact',
          '/hire-freelance-developers-india',
          '/freelance-jobs-india',
          '/hire-mern-stack-developer',
          '/react-developer-india',
        ],
        disallow: [
          '/api/',
          '/admin',
          '/client/',
          '/freelancer/',
          '/auth/',
          '/login',
          '/register',
          '/onboard',
          '/select-role',
          '/profile',
          '/wallet',
          '/*.json$',
          '/_next/',
          '/public/',
        ],
      },
      // Google-specific rules - no crawl delay
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/client/',
          '/freelancer/',
          '/auth/',
          '/login',
          '/register',
        ],
        crawlDelay: 0,
      },
      // Bing specific rules
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/client/',
          '/freelancer/',
          '/auth/',
          '/login',
          '/register',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      'https://altfaze.in/sitemap.xml',
    ],
    host: 'https://altfaze.in',
  }
}
