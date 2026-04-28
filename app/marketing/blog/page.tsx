// app/(marketing)/blog/page.tsx
import { Metadata } from 'next'
import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo/seo-head'
import { MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/lib/blog/blog-data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog - Freelance Hiring & Remote Work Tips | Altfaze',
  description: 'Read expert articles on hiring freelancers, freelancing tips, remote work trends, and building successful freelance careers. Updated regularly with actionable advice.',
  keywords: [
    'freelance blog',
    'hiring tips',
    'remote work',
    'freelancer advice',
    'business tips'
  ],
  path: '/blog',
  ogTitle: 'Altfaze Blog - Freelancing & Hiring Insights',
  ogDescription: 'Expert articles on hiring freelancers, earning online, remote work trends, and freelancing success strategies.',
  author: 'Altfaze Team',
  publishedDate: new Date().toISOString()
})

const schemas = [
  generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' }
  ])
]

export default function BlogPage() {
  const allPosts = getAllBlogPosts()
  const featuredPosts = getFeaturedBlogPosts()

  return (
    <>
      <MultiSchemaRenderer schemas={schemas.map(schema => ({ schema }))} />

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Freelancing & Hiring Insights
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-lg text-muted-foreground">
            Expert articles on hiring freelancers, remote work trends, earning money online, and building a successful freelance career. Updated regularly with actionable advice.
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container max-w-[64rem]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Featured Articles</h2>
            
            <div className="grid gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-1 rounded">
                              {post.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {post.readingTime} min read
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <Button variant="link" className="text-blue-600">
                              Read Article →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-[64rem]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">All Articles</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {allPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 px-3 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.readingTime} min
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <Button variant="link" size="sm" className="text-blue-600">
                        Read →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[64rem] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Action?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Apply the insights from our blog to hire freelancers or start your freelancing journey today.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register?role=client">
              <Button size="lg">Hire Freelancers</Button>
            </Link>
            <Link href="/register?role=freelancer">
              <Button size="lg" variant="outline">Start Freelancing</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
