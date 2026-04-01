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
import React from "react";

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
            Welcome to ATXEP 🚀
          </ShineBorder>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-20">
            Build. Hire. Launch — All in One Platform
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            The all-in-one platform to hire freelancers, build projects, buy templates, and get professional support. Everything you need to succeed.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <a
              href="/#why-choose"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-sm-2")}
            >
              Learn More 👇🏻
            </a>
          </div>
        </div>
        <div className="relative rounded-xl mx-auto justify-center flex flex-col items-center lg:max-w-[1000px] overflow-hidden md:overflow-auto lg:overflow-auto">
          <img
            src="/darkoutput.png"
            alt="ATXEP Platform Dashboard"
            className="hidden lg:max-w-[1000px] rounded-[inherit] border object-contain shadow-lg dark:block overflow-hidden md:overflow-auto lg:overflow-auto"
          />
          <img
            src="/lightoutput.png"
            alt="ATXEP Platform Dashboard"
            className="block lg:max-w-[1000px] rounded-[inherit] border object-contain shadow-lg dark:hidden overflow-hidden md:overflow-auto lg:overflow-auto"
          />
          <BorderBeam size={250} />
        </div>
      </section>

      {/* ===== TRUSTED BY SECTION ===== */}
      <Companies />

      {/* ===== WHY CHOOSE ATXEP SECTION ===== */}
      <section
        id="why-choose"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-10"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h3 className="text-center text-sm font-semibold text-gray-500 pb-2">
            WHY CHOOSE ATXEP
          </h3>
        </div>
        <BentoDemo />
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            How It Works
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Three simple steps to get started with ATXEP
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                1
              </div>
            </div>
            <h3 className="font-heading text-xl">Sign Up</h3>
            <p className="text-muted-foreground">Create your free account in minutes and set up your profile.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                2
              </div>
            </div>
            <h3 className="font-heading text-xl">Post or Browse</h3>
            <p className="text-muted-foreground">Post your project or browse thousands of available freelancers.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                3
              </div>
            </div>
            <h3 className="font-heading text-xl">Collaborate & Pay</h3>
            <p className="text-muted-foreground">Work together with secure payments and built-in project management.</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURED TEMPLATES SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Featured Templates
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Speed up your projects with professional templates
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🎨</div>
              <CardTitle>SaaS Landing Page</CardTitle>
              <CardDescription>Ready-to-deploy landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Modern SaaS landing page with hero section, features, pricing, and CTA.
              </p>
              <div className="flex gap-2">
                <Badge>React</Badge>
                <Badge>Tailwind</Badge>
              </div>
              <Link href="/templates">
                <button className="text-primary underline text-sm">View Template →</button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">⚙️</div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Complete admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Full-featured admin dashboard with analytics, users, and reports.
              </p>
              <div className="flex gap-2">
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
              </div>
              <Link href="/templates">
                <button className="text-primary underline text-sm">View Template →</button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🛍️</div>
              <CardTitle>E-Commerce Store</CardTitle>
              <CardDescription>Shop ready to launch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Complete e-commerce platform with products, cart, and checkout.
              </p>
              <div className="flex gap-2">
                <Badge>Next.js</Badge>
                <Badge>Stripe</Badge>
              </div>
              <Link href="/templates">
                <button className="text-primary underline text-sm">View Template →</button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="text-center pt-4">
          <Link href="/templates">
            <button className={cn(buttonVariants({ variant: "outline" }))}>
              Browse All Templates
            </button>
          </Link>
        </div>
      </section>

      {/* ===== TOP FREELANCERS SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Top Freelancers
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Work with highly-rated professionals across all skill levels
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Alex Chen", title: "Full-stack Developer", rating: 4.9, projects: 127, emoji: "👨‍💻" },
            { name: "Maria García", title: "UI/UX Designer", rating: 4.8, projects: 89, emoji: "👩‍🎨" },
            { name: "James Wilson", title: "Python Developer", rating: 4.9, projects: 156, emoji: "👨‍💼" },
            { name: "Sofia Rodriguez", title: "Content Writer", rating: 4.7, projects: 203, emoji: "📝" },
            { name: "David Kim", title: "Mobile Developer", rating: 5.0, projects: 78, emoji: "📱" },
            { name: "Emma Thompson", title: "Digital Marketer", rating: 4.8, projects: 112, emoji: "📊" },
            { name: "Lucas Silva", title: "Backend Engineer", rating: 4.9, projects: 134, emoji: "⚙️" },
            { name: "Nina Patel", title: "Product Manager", rating: 4.8, projects: 56, emoji: "🎯" },
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
              Browse All Freelancers
            </button>
          </Link>
        </div>
      </section>

      {/* ===== USE CASES SECTION ===== */}
      <section className="container space-y-8 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Perfect For Every Need
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            From startups to enterprises, ATXEP works for everyone
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="text-4xl mb-2">🚀</div>
              <CardTitle>For Startup Founders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Launch your MVP quickly by hiring experienced developers and designers without the overhead of full-time employees.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Cost-effective hiring
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Flexible team scaling
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Ready templates
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="text-4xl mb-2">💻</div>
              <CardTitle>For Developers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Earn money by taking on projects that match your skills. Build your portfolio and reputation while working flexibly.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Flexible work schedule
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Competitive rates
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Security & support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="text-4xl mb-2">🏢</div>
              <CardTitle>For Enterprises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Scale your operations with dedicated teams of specialists. Access top talent for short-term and long-term projects.
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
                  Custom workflows
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
            What Our Users Say
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Join thousands of satisfied clients and freelancers
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote: "ATXEP made it incredibly easy to find the right developer for our project. We launched 3 months earlier than expected.",
              author: "Sarah Johnson",
              role: "Founder, TechStartup Inc",
            },
            {
              quote: "The quality of freelancers on ATXEP is outstanding. I've completed over 50 projects here and earned more than I expected.",
              author: "Marcus Chen",
              role: "Senior Developer",
            },
            {
              quote: "Best platform for finding design talent. Our agency now uses ATXEP to scale our team based on project demand.",
              author: "Emily Rodriguez",
              role: "Creative Director",
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
        <div className="grid gap-8 md:grid-cols-4 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">50K+</div>
            <p className="text-muted-foreground">Projects Completed</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">25K+</div>
            <p className="text-muted-foreground">Active Freelancers</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">10K+</div>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">$500M+</div>
            <p className="text-muted-foreground">Total Payments</p>
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
            Everything you need to know about ATXEP
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
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Start Your ATXEP Journey Today
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join thousands of creators and businesses already building on ATXEP. Get access to top talent, premium templates, and the tools you need to succeed.
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
