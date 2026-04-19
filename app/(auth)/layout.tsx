import { Metadata } from "next"
import { generateMetadata } from "@/lib/seo/metadata-generator"
import { ThemeProvider } from "@/components/theme-provider"

interface AuthLayoutProps {
  children: React.ReactNode
}

// Auth pages don't get individual metadata - use a generic auth metadata
export const metadata: Metadata = generateMetadata({
  title: "AltFaze Login – Sign In to Your Freelance Account",
  description: "Sign in to your AltFaze account to hire freelancers, find projects, or start earning as a freelancer. Secure login for the #1 freelance marketplace.",
  keywords: [
    "AltFaze login",
    "AltFaze sign in",
    "freelancer login",
    "client account",
    "AltFaze account access",
    "sign in freelance"
  ],
  path: "/auth",
  ogTitle: "AltFaze Login",
  ogDescription: "Access your AltFaze account to hire talent or start freelancing."
})

export default function AuthLayout({ children }: AuthLayoutProps) {
    return  <div className="min-h-screen">
       
    {children}
 
    </div>
   
      
  }