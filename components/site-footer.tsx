import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import Link from "next/link"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container grid gap-8 py-12 md:py-16 lg:py-20">
        {/* Footer Top Section - Brand and Links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold text-lg">AltFaze</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The leading freelance marketplace for hiring talent and buying templates.
            </p>
          </div>

          {/* For Clients */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">For Clients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/hire" className="hover:text-foreground hover:underline">
                  Hire Freelancers
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-foreground hover:underline">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground hover:underline">
                  Post Projects
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">For Freelancers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground hover:underline">
                  Start Earning
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-foreground hover:underline">
                  Offer Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground hover:underline">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground hover:underline">
                  Sell Templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-foreground hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground hover:underline">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/keywords" className="hover:text-foreground hover:underline">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <a href="https://altfaze.in/contact" className="hover:text-foreground hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section - Copyright and Social */}
        <div className="border-t pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2026 AltFaze. Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Next.js
            </a>
            . All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-6">
            <a href="https://twitter.com/altfaze" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/altfaze" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://facebook.com/altfaze" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Facebook</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
