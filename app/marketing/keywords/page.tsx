// app/(marketing)/keywords/page.tsx
import { Metadata } from 'next'
import { KEYWORDS_DATABASE } from '@/lib/seo/keywords'
import { generateMetadata } from '@/lib/seo/metadata-generator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = generateMetadata({
  title: 'AltFaze Services & Categories – Browse All Freelance Services',
  description: 'Explore all AltFaze services by category. Hire freelancers for web development, design, marketing, and more. Find the talent you need on AltFaze.',
  keywords: [
    'AltFaze categories',
    'AltFaze services',
    'freelance services categories',
    'hire freelancers by category',
    'web development services',
    'design services',
    'marketing services'
  ],
  path: '/keywords'
})

export default function KeywordsPage() {
  const categories = Object.entries(KEYWORDS_DATABASE).map(([key, value]) => ({
    slug: key,
    ...value
  }))

  return (
    <section className="container py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore All Services & Categories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our complete marketplace. Find freelancers, hire developers, buy templates, and discover professional services tailored to your needs.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {categories.map((category) => (
          <Link key={category.slug} href={`/keywords/${category.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>
                  {category.keywords.length} trending keywords
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {category.keywords.slice(0, 3).map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                  {category.keywords.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{category.keywords.length - 3} more
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Explore Category →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 mb-12">
        <div className="grid gap-8 md:grid-cols-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">
              {categories.length}
            </div>
            <p className="text-muted-foreground">Categories</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">
              {categories.reduce((sum, cat) => sum + cat.keywords.length, 0)}+
            </div>
            <p className="text-muted-foreground">Keywords</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">25K+</div>
            <p className="text-muted-foreground">Freelancers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <p className="text-muted-foreground">Clients</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Find What You Need</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you&apos;re looking to hire freelancers, buy templates, or earn money as a professional, Altfaze has you covered.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/hire">
            <Button size="lg">Browse Freelancers</Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">Browse Templates</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
