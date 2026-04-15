import { MainNav } from "@/components/main-nav";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { generateMetadata } from "@/lib/seo/metadata-generator";

import { fontSans } from "@/lib/fonts";
import Link from "@/node_modules/next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle";

import { SiteFooter } from "@/components/site-footer";

import MobileNav from "@/components/mobile-nav";
import { getCurrentUser } from "@/lib/session";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateMetadata({
  title: 'ALTfaze - Hire Freelancers, Buy Website Templates, Find Web Developers',
  description: 'The #1 freelance marketplace platform. Hire professional web developers, find UI/UX designers, and purchase ready-to-deploy website templates. Secure payments and escrow protection.',
  keywords: [
    'freelance marketplace',
    'hire web developers',
    'website templates',
    'freelance platform',
    'web development services',
    'buy templates',
    'UI/UX designers',
    'affordable freelancers',
    'template marketplace',
    'web development marketplace',
    'find freelancers',
    'project management',
    'secure payments'
  ],
  path: '/',
  ogTitle: 'ALTfaze - Freelance Marketplace',
  ogDescription: 'Hire talented freelancers and buy professional website templates. ALTfaze connects businesses with expert developers for fast project delivery.'
});

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
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
                    buttonVariants({ variant: "default", size: "sm" }),
                    "px-4"
                  )}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
