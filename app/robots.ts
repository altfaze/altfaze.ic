// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/hire',
        '/templates',
        '/pricing',
        '/keywords',
        '/faq',
        '/login',
        '/register',
        '/services',
        '/projects',
        '/freelancers',
      ],
      disallow: [
        '/api',
        '/admin',
        '/client',
        '/freelancer',
        '/onboard',
        '/profile',
        '/wallet',
        '/*.json$',
        '/_next',
      ],
    },
    sitemap: [
      'https://altfaze.in/sitemap.xml',
    ],
  }
}
