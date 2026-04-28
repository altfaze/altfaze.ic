// app/sitemap.ts - Production-Grade SEO Sitemap
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://altfaze.in'
  const currentDate = new Date().toISOString().split('T')[0]

  // ✅ CRITICAL: Homepage - Highest Priority
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // ✅ CORE MARKETPLACE PAGES - Very High Priority
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/marketing`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/hire`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ✅ SEO LANDING PAGES - High Priority (These drive organic traffic)
  const landingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/hire-freelance-developers-india`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/freelance-jobs-india`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hire-mern-stack-developer`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/react-developer-india`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ✅ INFORMATIONAL PAGES - Medium Priority
  const infoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // ✅ LEGAL PAGES - Low Priority (Required but not for ranking)
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // ✅ COMBINE ALL PAGES
  // ❌ EXCLUDE: /keywords (thin content), /login, /register, /auth, /client, /freelancer, /admin, /api
  return [
    ...homepage,
    ...corePages,
    ...landingPages,
    ...infoPages,
    ...legalPages,
  ]
}
