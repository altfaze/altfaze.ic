import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Templates | ATXEP - Buy & Sell Templates",
  description: "Browse and buy professional templates for websites, apps, designs, and more. Accelerate your projects with production-ready templates.",
};

const templates = [
  { id: 1, name: "SaaS Landing Page", category: "Web Design", price: 29, isFree: false, image: "🎨" },
  { id: 2, name: "React Admin Dashboard", category: "Web Development", price: 49, isFree: false, image: "⚙️" },
  { id: 3, name: "Mobile App UI Kit", category: "UI Design", price: 0, isFree: true, image: "📱" },
  { id: 4, name: "E-commerce Template", category: "Web Design", price: 39, isFree: false, image: "🛍️" },
  { id: 5, name: "Startup Pitch Deck", category: "Presentations", price: 19, isFree: false, image: "📊" },
  { id: 6, name: "Next.js Blog Starter", category: "Web Development", price: 0, isFree: true, image: "📝" },
  { id: 7, name: "Portfolio Website", category: "Web Design", price: 24, isFree: false, image: "💼" },
  { id: 8, name: "Social Media Kit", category: "Design", price: 15, isFree: false, image: "📸" },
  { id: 9, name: "Affiliate Website", category: "Web Design", price: 34, isFree: false, image: "🔗" },
  { id: 10, name: "Design System", category: "Design", price: 59, isFree: false, image: "🎯" },
  { id: 11, name: "Mobile App Template", category: "Mobile", price: 0, isFree: true, image: "📲" },
  { id: 12, name: "SaaS Dashboard", category: "Web Development", price: 69, isFree: false, image: "📈" },
];

export default function TemplatesPage() {
  const freeTemplates = templates.filter((t) => t.isFree);
  const paidTemplates = templates.filter((t) => !t.isFree);

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Professional Templates
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Speed up your projects with production-ready templates. Free and premium options for web, mobile, and design projects.
          </p>
        </div>
      </section>

      {/* Free Templates Section */}
      <section className="container space-y-6 py-8 md:py-12">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">Free Templates</h2>
            <p className="text-muted-foreground">Get started with our free collection</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeTemplates.map((template) => (
              <Card key={template.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{template.image}</div>
                    <Badge variant="outline" className="bg-green-50">FREE</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                  <Button className="w-full">Download</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Paid Templates Section */}
      <section className="container space-y-6 py-8 md:py-12">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">Premium Templates</h2>
            <p className="text-muted-foreground">Advanced templates for professional projects</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paidTemplates.map((template) => (
              <Card key={template.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{template.image}</div>
                    <Badge variant="outline">${template.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                  <div className="space-x-2">
                    <Button className="flex-1">Buy Now</Button>
                    <Button variant="outline" className="flex-1">Preview</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sell Templates CTA */}
      <section className="container bg-slate-50 dark:bg-slate-900 rounded-lg py-12 md:py-16 my-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Have Templates to Sell?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground">
            Join our creator program and earn passive income by selling your designs and code. Get competitive revenue share and marketing support.
          </p>
          <Button size="lg" className="mt-4">Become a Template Creator</Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] md:text-5xl">
            Get Your Project Started Today
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Find the perfect template and launch your project faster than ever.
          </p>
          <div className="space-x-4 pt-4">
            <Link href="/login">
              <Button size="lg">Sign In to Download</Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
