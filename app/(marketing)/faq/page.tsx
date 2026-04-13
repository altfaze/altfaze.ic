// app/(marketing)/faq/page.tsx
import { Metadata } from 'next'
import { generateMetadata, generateFAQSchema } from '@/lib/seo/metadata-generator'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'

const faqs = [
  {
    question: "What is Altfaze?",
    answer: "Altfaze is a leading freelance marketplace where you can hire web developers, designers, and professional freelancers. You can also buy premium website templates and post projects for thousands of skilled professionals to bid on."
  },
  {
    question: "How do I hire a freelancer on Altfaze?",
    answer: "Sign up as a client, post your project with details and budget, and experienced freelancers will submit proposals. Review their portfolios, ratings, and hire the best match for your project."
  },
  {
    question: "Can I earn money as a freelancer on Altfaze?",
    answer: "Yes! Sign up as a freelancer, build your profile, and start bidding on projects. You can offer web development services, UI/UX design, content writing, and more. Payments are processed securely through our escrow system."
  },
  {
    question: "Are payments secure on Altfaze?",
    answer: "Absolutely. We use escrow protection for all projects. Funds are held securely until the project is completed and approved. This protects both clients and freelancers from fraud and disputes."
  },
  {
    question: "How much do website templates cost?",
    answer: "Template prices range from $25 to $500+ depending on complexity and features. All templates are ready-to-deploy, fully customizable, and come with source code and documentation."
  },
  {
    question: "What payment methods does Altfaze accept?",
    answer: "We accept credit cards, PayPal, and bank transfers. All payments are processed securely. Freelancers can withdraw their earnings weekly or monthly based on their verification level."
  },
  {
    question: "What types of freelancers are available on Altfaze?",
    answer: "We have web developers, UI/UX designers, mobile app developers, backend engineers, content writers, digital marketers, and more. All freelancers are vetted and rated by clients."
  },
  {
    question: "How do I start selling my website template on Altfaze?",
    answer: "Create a seller account, upload your template with description, pricing, and documentation. Our team will review and approve it. Once approved, you start earning from every sale."
  },
  {
    question: "Is there a free trial or sample?",
    answer: "Some templates offer free previews or demos. Most freelancers offer free consultations for initial project discussions. Create an account today to explore options."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. Small projects might take days, while larger web development projects could take weeks or months. Discuss timelines with freelancers before hiring."
  },
]

export const metadata: Metadata = generateMetadata({
  title: 'Frequently Asked Questions - Altfaze Freelance Marketplace',
  description: 'Common questions about hiring freelancers, buying website templates, earning money, and using Altfaze marketplace. Find answers to your questions.',
  keywords: [
    'FAQ',
    'frequently asked questions',
    'hiring freelancers',
    'buying templates',
    'freelance marketplace',
    'how to hire',
    'how to earn',
    'website templates'
  ],
  path: '/faq'
})

const faqSchema = generateFAQSchema(faqs)

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      <section className="container py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Altfaze - hiring freelancers, buying templates, earning money, and more.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-12">
          <Accordion type="single" collapsible>
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Help Section */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Didn&apos;t find your answer?</h2>
            <p className="text-muted-foreground mb-6">
              Contact our support team and we&apos;ll be happy to help you.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
