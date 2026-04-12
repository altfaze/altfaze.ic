import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import HeroPage from "./hero/page";
import { Metadata } from "next";
import { generateMetadata, generatePageSchema } from "@/lib/seo/metadata-generator";

export const metadata: Metadata = generateMetadata({
  title: "Freelance Marketplace - Hire Developers, Web Designers & Templates",
  description: "Altfaze is the best freelance marketplace to hire professional web developers, buy website templates, and launch projects fast. Get expert services for your business.",
  keywords: [
    "freelance marketplace",
    "hire web developers",
    "buy website templates",
    "freelance jobs online",
    "web development services",
    "hire developers",
    "freelancer platform",
    "website templates"
  ],
  path: "/"
});

export default function Home() {
  return (
      <HeroPage />
  );
}
