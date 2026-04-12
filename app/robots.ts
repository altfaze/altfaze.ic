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
      ],
      disallow: [
        '/api',
        '/admin',
        '/dashboard',
        '/freelancer-dashboard',
        '/profile',
        '/wallet',
      ],
    },
    sitemap: 'https://altfaze.com/sitemap.xml',
  }
}
