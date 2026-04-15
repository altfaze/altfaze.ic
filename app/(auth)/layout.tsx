import { Metadata } from "next"
import { generateMetadata } from "@/lib/seo/metadata-generator"
import { ThemeProvider } from "@/components/theme-provider"

interface AuthLayoutProps {
  children: React.ReactNode
}

// Auth pages don't get individual metadata - use a generic auth metadata
export const metadata: Metadata = generateMetadata({
  title: "Authentication - Altfaze Freelance Marketplace",
  description: "Sign in or create a free account on Altfaze to hire freelancers or start earning as a freelancer.",
  keywords: [
    "login",
    "sign up",
    "register",
    "create account",
    "freelancer login",
    "account"
  ],
  path: "/auth",
  ogTitle: "Sign In to Altfaze",
  ogDescription: "Access your Altfaze account to hire talent or start freelancing."
})

export default function AuthLayout({ children }: AuthLayoutProps) {
    return  <div className="min-h-screen">
       
    {children}
 
    </div>
   
      
  }