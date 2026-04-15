import type { Metadata } from "next";
import { MainNav } from "@/components/main-nav";
import { fontDisplay } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers";
import { ModeToggle } from "@/components/toggle";
import MobileNav from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { OrganizationSchema, LocalBusinessSchema, ServiceSchema, MarketplaceProductSchema, FAQSchema, BreadcrumbSchema } from "@/app/schema-markup";
import "./globals.css";

export const metadata: Metadata = {
  title: "Altfaze - Best Freelance Marketplace to Hire Developers & Buy Website Templates",
  description: "Altfaze is the leading freelance marketplace. Hire web developers, UI/UX designers, and freelancers for your projects. Buy premium website templates & build online fast. Access 1000+ skilled professionals.",
  keywords: [
    "freelance marketplace",
    "hire web developers",
    "website templates",
    "freelance jobs",
    "hire freelancers",
    "web development services",
    "UI/UX design",
    "buy templates",
    "hire developers India",
    "affordable web development",
    "startup services",
    "freelance hiring platform",
    "find freelancers online"
  ],
  authors: [{ name: "Altfaze" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://altfaze.in",
    siteName: "Altfaze",
    title: "Altfaze - Best Freelance Marketplace",
    description: "Hire developers, designers, and freelancers. Buy website templates. Launch projects faster.",
    images: [
      {
        url: "https://altfaze.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Altfaze Freelance Marketplace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Altfaze - Hire Freelancers & Buy Templates",
    description: "The #1 freelance marketplace to hire developers and buy website templates.",
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
