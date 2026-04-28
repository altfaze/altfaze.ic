// app/(marketing)/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { generateSEOMetadata, generateSchema, generateBreadcrumbSchema } from '@/lib/seo/seo-head'
import { MultiSchemaRenderer } from '@/components/seo/schema-renderer'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog/blog-data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Article Not Found'
    }
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    path: `/blog/${post.slug}`,
    ogTitle: post.title,
    ogDescription: post.description,
    ogImage: post.image,
    author: post.author,
    publishedDate: post.publishedDate,
    modifiedDate: post.modifiedDate
  })
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, 3)

  const schema = generateSchema('article', {
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    author: post.author,
    publishedDate: post.publishedDate,
    modifiedDate: post.modifiedDate
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` }
  ])

  return (
    <>
      <MultiSchemaRenderer schemas={[
        { schema },
        { schema: breadcrumbSchema }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 py-12 md:py-16">
        <div className="container max-w-[48rem]">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700">Blog</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 px-3 py-1 rounded">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            {post.description}
          </p>
          
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>By {post.author}</span>
              <span>•</span>
              <span>
                {new Date(post.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[48rem]">
          <article className="prose dark:prose-invert max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
          </article>

          {/* Tags */}
          <div className="mt-12 pt-12 border-t">
            <h3 className="font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog?tag=${tag}`}>
                  <Button variant="outline" size="sm">
                    #{tag}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="mt-12 pt-12 border-t bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">About the Author</h3>
            <p className="text-muted-foreground">
              {post.author} is part of the Altfaze team dedicated to helping freelancers and businesses build successful working relationships.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-12 border-t">
            <div className="bg-blue-50 dark:bg-blue-950 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Apply These Insights?</h3>
              <p className="text-muted-foreground mb-6">
                {post.category === 'Hiring' ? (
                  'Start hiring freelancers today on Altfaze'
                ) : (
                  'Begin your freelancing journey today'
                )}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                {post.category === 'Hiring' ? (
                  <>
                    <Link href="/register?role=client">
                      <Button size="lg">Post Your Project</Button>
                    </Link>
                    <Link href="/hire">
                      <Button size="lg" variant="outline">Browse Freelancers</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/register?role=freelancer">
                      <Button size="lg">Start Freelancing</Button>
                    </Link>
                    <Link href="/projects">
                      <Button size="lg" variant="outline">Browse Jobs</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-[64rem]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Related Articles</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 px-3 py-1 rounded">
                          {relatedPost.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {relatedPost.readingTime} min
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 text-base">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {relatedPost.description}
                      </p>
                      <Button variant="link" size="sm" className="text-blue-600 p-0">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="py-8">
        <div className="container max-w-[48rem]">
          <Link href="/blog">
            <Button variant="outline">← Back to Blog</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
