import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import HeroPage from "./marketing/hero/page";
import { Metadata } from "next";
import { generateMetadata, generatePageSchema } from "@/lib/seo/metadata-generator";

export const metadata: Metadata = generateMetadata({
  title: 'AltFaze – Freelance Marketplace to Hire Developers, Buy Templates, Find Projects',
  description: 'AltFaze is the leading freelance marketplace platform. Hire web developers and designers, buy premium website templates, post projects, and earn as a freelancer. Trusted marketplace with secure payments.',
  keywords: [
    'AltFaze freelance platform',
    'hire freelancers online AltFaze',
    'AltFaze projects marketplace',
    'AltFaze client dashboard',
    'AltFaze freelancer services',
    'AltFaze job posting platform',
    'AltFaze hire developers',
    'AltFaze remote work',
    'freelance marketplace',
    'hire web developers'
  ],
  path: "/",
  ogTitle: "AltFaze – The #1 Freelance Marketplace for Hiring & Projects",
  ogDescription: "Hire professionals, find projects, buy templates. AltFaze is your complete freelance marketplace for web development, design, and remote work."
});

export default function Home() {
  return (
      <HeroPage />
  );
}
