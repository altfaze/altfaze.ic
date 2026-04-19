// app/schema-markup.tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Altfaze",
    alternateName: "Alt Faze",
    url: "https://altfaze.in",
    logo: "https://altfaze.in/logo.png",
    description: "The leading freelance marketplace to hire web developers, designers, and freelancers. Buy premium website templates and launch projects fast.",
    sameAs: [
      "https://www.facebook.com/altfaze",
      "https://www.twitter.com/altfaze",
      "https://www.linkedin.com/company/altfaze",
      "https://www.instagram.com/altfaze"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      telephone: "+91-1234567890",
      email: "support@altfaze.in"
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "India"
    },
    foundingDate: "2023",
    priceCurrency: "INR",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2500",
      bestRating: "5",
      worstRating: "1"
    },
    numberOfEmployees: "50"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Altfaze",
    image: "https://altfaze.in/logo.png",
    url: "https://altfaze.in",
    telephone: "+91-1234567890",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tech Park, Mumbai",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400001",
      addressCountry: "IN"
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    },
    areaServed: "IN",
    knowsAbout: ["Web Development", "Freelance Jobs", "Website Templates", "UI/UX Design"]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Freelance Hiring & Template Marketplace",
    description: "Platform to hire freelancers and buy website templates",
    provider: {
      "@type": "Organization",
      name: "Altfaze",
      url: "https://altfaze.in"
    },
    areaServed: "US",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hire Freelancers"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Buy Website Templates"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Development Services"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UI/UX Design Services"
          }
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function AggregateOfferSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "25",
    highPrice: "5000",
    offerCount: "1000+",
    seller: {
      "@type": "Organization",
      name: "Altfaze"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ Schema for SEO - Shows FAQs in search results
export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Altfaze?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Altfaze is a leading freelance marketplace where you can hire web developers, designers, and professional freelancers. You can also buy premium website templates and post projects for thousands of skilled professionals to bid on."
        }
      },
      {
        "@type": "Question",
        name: "How do I hire a freelancer on Altfaze?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sign up as a client, post your project with details and budget, and experienced freelancers will submit proposals. Review their portfolios, ratings, and hire the best match for your project."
        }
      },
      {
        "@type": "Question",
        name: "Can I earn money as a freelancer on Altfaze?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Sign up as a freelancer, build your profile, and start bidding on projects. You can offer web development services, UI/UX design, content writing, and more. Payments are processed securely through our escrow system."
        }
      },
      {
        "@type": "Question",
        name: "Are payments secure on Altfaze?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. We use escrow protection for all projects. Funds are held securely until the project is completed and approved. This protects both clients and freelancers from fraud and disputes."
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Marketplace Product Schema - For product rich snippets
export function MarketplaceProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Freelance Marketplace Services",
    description: "Access to hire freelancers and buy website templates",
    brand: {
      "@type": "Brand",
      name: "Altfaze"
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "399",
      highPrice: "250000",
      availability: "https://schema.org/InStock",
      offerCount: "1000+"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2500"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Navigation Schema - For better SERP display
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  if (!items || !Array.isArray(items)) {
    return null
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Website Schema with Sitelinks and Search Box - CRITICAL for Google Sitelinks
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AltFaze",
    alternateName: "Alt Faze",
    url: "https://altfaze.in",
    logo: "https://altfaze.in/logo.png",
    description: "AltFaze - The leading freelance marketplace to hire web developers, designers, and freelancers. Buy premium website templates and launch projects fast.",
    sameAs: [
      "https://www.facebook.com/altfaze",
      "https://www.twitter.com/altfaze",
      "https://www.linkedin.com/company/altfaze",
      "https://www.instagram.com/altfaze"
    ],
    // Site Search Box - Enables search functionality in Google SERPs
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://altfaze.in/search?q={search_term_string}"
      },
      query_input: "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
