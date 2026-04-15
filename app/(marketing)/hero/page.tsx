import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata-generator'
import { BentoDemo } from "@/components/bento-features";
import { Icons } from "@/components/more-icons";
import BlurIn from "@/components/magicui/blur-in";
import { BorderBeam } from "@/components/magicui/border-beam";
import ShineBorder from "@/components/magicui/shine-border";
import { Companies } from "@/components/social-proof";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "@/node_modules/next/link";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = generateMetadata({
  title: 'Freelance Marketplace - Hire Web Developers & Buy Website Templates | ALTfaze',
  description: 'Connect with top freelancers, hire web developers, and buy premium website templates. ALTfaze is the #1 marketplace for web development services, UI/UX design, and template solutions.',
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
    'web development marketplace'
  ],
  path: '/hero',
  ogTitle: 'ALTfaze - Hire Freelancers & Buy Website Templates',
  ogDescription: 'The #1 marketplace to hire professional web developers and purchase premium website templates. Launch your projects faster with expert freelancers.'
})

function HeroPage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center sm:mb-10 lg:mb-20 md:sm-20">
          <ShineBorder
            className="text-center capitalize bg-muted px-4 py-1.5 text-lg font-medium absolute"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            Welcome to ALTfaze 🚀
          </ShineBorder>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-20">
            Best Freelance Marketplace to Hire Web Developers & Buy Website Templates
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            The #1 freelance platform to hire professional developers, find skilled UI/UX designers, buy premium website templates, and launch your projects in days. Get expert web development services from top freelancers worldwide.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Hire Freelancers Now
            </Link>
            <a
              href="/#why-choose"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-sm-2")}
            >
              Browse Templates 👇🏻
            </a>
          </div>
        </div>
        <div className="relative rounded-xl mx-auto justify-center flex flex-col items-center lg:max-w-[1000px] overflow-hidden md:overflow-auto lg:overflow-auto">
          <Image
            src="/darkoutput.png"
            alt="ALTfaze Platform Dashboard"
            width={1000}
            height={600}
            className="hidden lg:max-w-[1000px] rounded-[inherit] border object-contain shadow-lg dark:block overflow-hidden md:overflow-auto lg:overflow-auto"
          />
          <Image
            src="/lightoutput.png"
            alt="ALTFaze Platform Dashboard"
            width={1000}
            height={600}
            className="block lg:max-w-[1000px] rounded-[inherit] border object-contain shadow-lg dark:hidden overflow-hidden md:overflow-auto lg:overflow-auto"
          />
          <BorderBeam size={250} />
        </div>
      </section>

      {/* ===== TRUSTED BY SECTION ===== */}
      <Companies />

      {/* ===== WHY CHOOSE ALTFaze SECTION ===== */}
      <section
        id="why-choose"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-10"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h3 className="text-center text-sm font-semibold text-gray-500 pb-2">
            BEST FREELANCE PLATFORM & TEMPLATE MARKETPLACE
          </h3>
          <h2 className="text-2xl md:text-4xl font-bold">Why Choose Altfaze for Hiring Freelancers & Buying Website Templates?</h2>
        </div>
        <BentoDemo />
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            How It Works - Hire Freelancers or Sell Templates in 3 Steps
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Simple process to find web developers, designers, or buy premium website templates for your projects
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                1
              </div>
            </div>
            <h3 className="font-heading text-xl">Sign Up - Become a Freelancer or Client</h3>
            <p className="text-muted-foreground">Create your free account in minutes. Join thousands of freelancers or hire the best developers for your projects.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                2
              </div>
            </div>
            <h3 className="font-heading text-xl">Post Projects or Browse Services</h3>
            <p className="text-muted-foreground">
              <Link href="/projects" className="text-primary underline hover:no-underline">Post your web development project</Link> or hire from thousands of available freelancers. Find website templates or offer your services.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                3
              </div>
            </div>
            <h3 className="font-heading text-xl">Collaborate & Get Paid Securely</h3>
            <p className="text-muted-foreground">Work together with secure payments, escrow protection, and built-in project management. Earn money as a freelancer or get your project delivered.</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURED TEMPLATES SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Premium Website Templates - Buy Now & Launch Today
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Responsive, modern website templates built with React & Next.js. Speed up your projects with ready-to-deploy designs. Affordable templates for every business need.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🎨</div>
              <CardTitle>SaaS Landing Page Template</CardTitle>
              <CardDescription>Professional SaaS landing page ready to deploy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Modern responsive SaaS landing page template with hero section, features showcase, pricing table, FAQ, and high-converting CTA buttons. Perfect for tech startups.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge>React</Badge>
                <Badge>Tailwind</Badge>
                <Badge>Responsive</Badge>
              </div>
              <Link href="/templates">
                <button className="text-primary underline text-sm">Buy This Template →</button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">⚙️</div>
              <CardTitle>Admin Dashboard Template</CardTitle>
              <CardDescription>Complete admin panel for web applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Full-featured admin dashboard template with analytics, user management, reports, and data visualization. Build your project faster with this professional template.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Admin</Badge>
              </div>
              <Link href="/templates">
                <button className="text-primary underline text-sm">Buy This Template →</button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🛍️</div>
              <CardTitle>E-Commerce Store Template</CardTitle>
              <CardDescription>Complete online shop ready to launch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Full-featured e-commerce store template with product catalog, shopping cart, secure checkout with Stripe, and order management. Start selling online today.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge>Next.js</Badge>
                <Badge>Stripe</Badge>
                <Badge>E-Commerce</Badge>
              </div>
              <Link href="/templates">
                <button className="text-primary underline text-sm">Buy This Template →</button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="text-center pt-4">
          <Link href="/templates">
            <button className={cn(buttonVariants({ variant: "outline" }))}>
              Browse 100+ Website Templates - Affordable Prices
            </button>
          </Link>
        </div>
      </section>

      {/* ===== TOP FREELANCERS SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Hire Top Web Developers, UI/UX Designers & Freelancers
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Work with highly-rated professional developers and designers. Hire freelancers for web development, design, content, and more. Quality talent at affordable rates.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Alex Chen", title: "Full-stack Web Developer", rating: 4.9, projects: 127, emoji: "👨‍💻" },
            { name: "Maria García", title: "UI/UX Designer - Web & App", rating: 4.8, projects: 89, emoji: "👩‍🎨" },
            { name: "James Wilson", title: "Python & Backend Developer", rating: 4.9, projects: 156, emoji: "👨‍💼" },
            { name: "Sofia Rodriguez", title: "SEO & Content Writer", rating: 4.7, projects: 203, emoji: "📝" },
            { name: "David Kim", title: "React & Mobile Developer", rating: 5.0, projects: 78, emoji: "📱" },
            { name: "Emma Thompson", title: "Digital Marketer & SEO", rating: 4.8, projects: 112, emoji: "📊" },
            { name: "Lucas Silva", title: "Backend Engineer & DevOps", rating: 4.9, projects: 134, emoji: "⚙️" },
            { name: "Nina Patel", title: "Product Manager & Consultant", rating: 4.8, projects: 56, emoji: "🎯" },
          ].map((freelancer, idx) => (
            <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow text-center p-6">
              <div className="text-4xl mb-3">{freelancer.emoji}</div>
              <h3 className="font-semibold">{freelancer.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{freelancer.title}</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-yellow-500">★ {freelancer.rating}</span>
                <span className="text-muted-foreground">({freelancer.projects})</span>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center pt-4">
          <Link href="/hire">
            <button className={cn(buttonVariants({ variant: "outline" }))}>
              View 1000+ Available Freelancers - Find Your Perfect Match
            </button>
          </Link>
        </div>
      </section>

      {/* ===== USE CASES SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Perfect For Every Need - Hire Freelancers, Buy Templates, Earn Money
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            From startups to enterprises, freelancers to agencies - Altfaze works for everyone. Build websites, hire developers, and grow your business online.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="text-4xl mb-2">🚀</div>
              <CardTitle>For Startup Founders & Entrepreneurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Launch your MVP and startup website quickly by hiring experienced developers and designers. Buy pre-built website templates to get started in hours instead of weeks. Check out our <Link href="/pricing" className="text-primary underline hover:no-underline">affordable pricing plans</Link> for teams.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Cost-effective freelance hiring
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Ready-to-use templates & themes
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Flexible team scaling
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="text-4xl mb-2">💻</div>
              <CardTitle>For Developers & Freelancers - Earn Money Online</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Earn money by taking on web development projects that match your skills. Build your freelance portfolio and reputation. Sell your own website templates and services.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Flexible work schedule & remote jobs
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Competitive freelance rates
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Secure payments & escrow protection
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="text-4xl mb-2">🏢</div>
              <CardTitle>For Agencies & Enterprises - Scale Your Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Scale your operations with dedicated teams of specialists. Hire web developers and designers for short-term and long-term projects. Access top talent worldwide.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Dedicated account management
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Team collaboration tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Custom workflows & processes
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Real Success Stories - Join Thousands of Satisfied Users
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            See how clients and freelancers are earning money and building amazing projects on Altfaze. Success stories from hiring developers to selling website templates.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote: "Found the perfect web developer on Altfaze for our project. The platform made it easy to hire and manage the project. Delivered on time, exceeded expectations.",
              author: "Sarah Johnson",
              role: "Founder, TechStartup Inc",
            },
            {
              quote: "As a freelancer, I've earned over $50K on Altfaze. The platform connects me with quality clients and projects. Easy to get started, and payments are always secure.",
              author: "Marcus Chen",
              role: "Full-Stack Developer & Freelancer",
            },
            {
              quote: "Bought 5 website templates from Altfaze and saved weeks of development time. Templates are professional, well-built, and easy to customize. Best investment for my agency.",
              author: "Emily Rodriguez",
              role: "Creative Director & Agency Owner",
            },
          ].map((testimonial, idx) => (
            <Card key={idx} className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="container bg-slate-50 dark:bg-slate-900 rounded-lg py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Trusted by Thousands - Altfaze Marketplace Statistics</h2>
          <p className="text-muted-foreground">The #1 platform for freelancers, developers, and businesses</p>
        </div>
        <div className="grid gap-8 md:grid-cols-4 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">50K+</div>
            <p className="text-muted-foreground">Web Development Projects Completed</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">25K+</div>
            <p className="text-muted-foreground">Expert Web Developers & Freelancers</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">10K+</div>
            <p className="text-muted-foreground">Happy Clients & Business Owners</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">$500M+</div>
            <p className="text-muted-foreground">Total Secure Payments Processed</p>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Everything you need to know about ALTFaze - Hire freelancers, buy templates, and manage projects
          </p>
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              q: "How do I get started?",
              a: "Simply sign up with your email, complete your profile, and start browsing projects or freelancers. It takes less than 5 minutes.",
            },
            {
              q: "What are the payment options?",
              a: "We support credit cards, PayPal, and bank transfers. All payments are secure and protected by escrow.",
            },
            {
              q: "How do you verify freelancers?",
              a: "We verify identity, portfolio, and past work. Reviews and ratings from clients provide additional credibility.",
            },
            {
              q: "What if I'm not satisfied with the work?",
              a: "We offer a satisfaction guarantee. If you're not happy, we'll work to resolve it or refund your money.",
            },
            {
              q: "How do I hire a freelancer?",
              a: "Browse our directory, review portfolios, check ratings, and send a message. If interested, create a contract and start collaborating.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="text-muted-foreground text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center pt-6">
          <Link href="/faq">
            <button className={cn(buttonVariants({ variant: "outline" }))}>
              View All FAQs & Get Help
            </button>
          </Link>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Start Your ALTFaze Journey Today
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join thousands of creators and businesses already building on ALTFaze. Get access to top talent, premium templates, and the tools you need to succeed.
          </p>
          <div className="space-x-4 pt-6">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started Now
            </Link>
            <Link href="/services" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroPage;
