// app/schema-markup.tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Altfaze",
    alternateName: "Alt Faze",
    url: "https://altfaze.com",
    logo: "https://altfaze.com/logo.png",
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
      telephone: "+1-800-ALTFAZE",
      email: "support@altfaze.com"
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Remote"
    },
    foundingDate: "2023",
    priceCurrency: "USD",
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
    image: "https://altfaze.com/logo.png",
    url: "https://altfaze.com",
    telephone: "+1-800-ALTFAZE",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Tech Street",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94102",
      addressCountry: "US"
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00"
    },
    areaServed: "US",
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
      url: "https://altfaze.com"
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
