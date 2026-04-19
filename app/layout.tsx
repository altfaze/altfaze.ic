import type { Metadata } from "next";
import { MainNav } from "@/components/main-nav";
import { fontDisplay } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers";
import { ModeToggle } from "@/components/toggle";
import MobileNav from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { OrganizationSchema, LocalBusinessSchema, ServiceSchema, MarketplaceProductSchema, FAQSchema, BreadcrumbSchema, WebsiteSchema } from "@/app/schema-markup";
import "./globals.css";

export const metadata: Metadata = {
  title: "AltFaze – Hire Freelancers, Find Projects & Buy Website Templates",
  description: "AltFaze is the leading freelance marketplace. Hire web developers, UI/UX designers, and freelancers. Buy premium website templates, post projects, and work securely. 1000+ skilled professionals available.",
  keywords: [
    "AltFaze freelance marketplace",
    "hire web developers",
    "hire freelancers online",
    "website templates",
    "freelance jobs",
    "web development services",
    "UI/UX design",
    "buy templates",
    "freelance platform",
    "find freelancers",
    "project management",
    "remote work platform",
    "affordable web development"
  ],
  authors: [{ name: "AltFaze" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://altfaze.in",
    siteName: "AltFaze",
    title: "AltFaze – The #1 Freelance Marketplace Platform",
    description: "Hire professionals, find projects, buy templates. Complete freelance marketplace for businesses and remote workers.",
    images: [
      {
        url: "https://altfaze.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "AltFaze Freelance Marketplace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AltFaze – Hire Freelancers & Buy Templates",
    description: "The #1 freelance marketplace to hire developers, find projects, and buy website templates.",
    images: ["https://altfaze.in/og-image.png"],
    creator: "@altfaze"
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "https://altfaze.in",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning style={{ fontFamily: "var(--font-display)" }}>
      <head>
        <WebsiteSchema />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <ServiceSchema />
        <MarketplaceProductSchema />
        <FAQSchema />
        <BreadcrumbSchema items={[
          { name: 'Home', url: 'https://altfaze.in' },
          { name: 'Hire Freelancers', url: 'https://altfaze.in/hire' },
          { name: 'Buy Templates', url: 'https://altfaze.in/templates' },
          { name: 'Services', url: 'https://altfaze.in/services' },
          { name: 'Projects', url: 'https://altfaze.in/projects' },
          { name: 'Pricing', url: 'https://altfaze.in/pricing' },
          { name: 'FAQ', url: 'https://altfaze.in/faq' }
        ]} />
      </head>
      <body
        className={cn(
          "relative flex min-h-screen w-full flex-col justify-center scroll-smooth bg-background font-sans antialiased",
          fontDisplay.variable
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {/* <div className="flex min-h-screen flex-col">
            <header className="h-16 container sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between py-6 w-full">
              <MobileNav />
                <MainNav />
                <nav>
                  <div className="md:flex">
                    <div className="flex gap-4">
                      <ModeToggle />
                      <Link
                        href="/login"
                        className={cn(
                          buttonVariants({ variant: "secondary", size: "sm" }),
                          "px-4"
                        )}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </header> */}
          {/* <HeroPage /> */}

          <main className="flex-1">{children}</main>
          {/* Removed SpeedInsights and Analytics to fix performance monitoring issues */}
          {/* <SiteFooter /> */}
          <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
