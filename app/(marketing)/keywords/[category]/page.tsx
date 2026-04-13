// app/(marketing)/keywords/[category]/page.tsx
import { Metadata } from 'next'
import { KEYWORDS_DATABASE } from '@/lib/seo/keywords'
import { generateMetadata as generateMetadataHelper, generatePageSchema } from '@/lib/seo/metadata-generator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

// Generate static params for all categories
export async function generateStaticParams() {
  return Object.keys(KEYWORDS_DATABASE).map(category => ({
    category: category
  }))
}

interface Props {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryData = KEYWORDS_DATABASE[params.category as keyof typeof KEYWORDS_DATABASE]
  
  if (!categoryData) {
    return {
      title: 'Keyword Category Not Found | Altfaze',
      description: 'The keyword category you are looking for does not exist.'
    }
  }

  const title = `${categoryData.category} - Altfaze`
  const description = categoryData.description

  return generateMetadataHelper({
    title,
    description,
    keywords: categoryData.keywords.slice(0, 10),
    path: `/keywords/${params.category}`,
    ogTitle: title,
    ogDescription: description
  })
}

export default function CategoryPage({ params }: Props) {
  const categoryData = KEYWORDS_DATABASE[params.category as keyof typeof KEYWORDS_DATABASE]

  if (!categoryData) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The keyword category you are looking for does not exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generatePageSchema(
              categoryData.category,
              categoryData.description,
              `/keywords/${params.category}`,
              categoryData.keywords.slice(0, 10)
            )
          )
        }}
      />

      <section className="container py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryData.category}</h1>
          <p className="text-lg text-muted-foreground mb-6">{categoryData.description}</p>
          <Link href="/login">
            <Button size="lg" className="mb-8">
              {categoryData.cta}
            </Button>
          </Link>
        </div>

        {/* Keywords Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Keywords in {categoryData.category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryData.keywords.map((keyword, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{keyword}</CardTitle>
                  {categoryData.volume && (
                    <CardDescription>Search volume: {categoryData.volume}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-4">Trending</Badge>
                  <p className="text-sm text-muted-foreground">
                    Find expert professionals and resources related to "{keyword}" on Altfaze.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Choose Altfaze for {categoryData.category}?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">✓ Verified Professionals</h3>
              <p className="text-muted-foreground">All freelancers are carefully vetted and rated by clients.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Secure Payments</h3>
              <p className="text-muted-foreground">Escrow protection ensures safe transactions for both parties.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Quality Guaranteed</h3>
              <p className="text-muted-foreground">Portfolio reviews and ratings ensure high-quality deliverables.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Fast Turnaround</h3>
              <p className="text-muted-foreground">Get your project completed quickly with experienced experts.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and freelancers using Altfaze for {categoryData.category.toLowerCase()}.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register?role=client">
              <Button size="lg">
                Post a Project
              </Button>
            </Link>
            <Link href="/register?role=freelancer">
              <Button size="lg" variant="outline">
                Become a Freelancer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
