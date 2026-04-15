import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import HeroPage from "./hero/page";
import { Metadata } from "next";
import { generateMetadata, generatePageSchema } from "@/lib/seo/metadata-generator";

export const metadata: Metadata = generateMetadata({
  title: "Freelance Marketplace - Hire Developers, Buy Templates & Find Freelancers",
  description: "Altfaze is the best freelance marketplace to hire professional web developers, buy website templates, and launch projects fast. Find 1000+ skilled freelancers for your business. Affordable web development services in India and worldwide.",
  keywords: [
    "freelance marketplace",
    "hire web developers",
    "buy website templates",
    "freelance jobs online",
    "web development services",
    "hire developers",
    "freelancer platform",
    "website templates",
    "affordable web development",
    "hire developers india",
    "UI/UX design services",
    "project management",
    "startup services",
    "find freelancers"
  ],
  path: "/",
  ogTitle: "Altfaze - The #1 Freelance Marketplace",
  ogDescription: "Hire developers, designers, and freelancers. Buy premium website templates. Launch your projects faster with expert professionals."
});

export default function Home() {
  return (
      <HeroPage />
  );
}
