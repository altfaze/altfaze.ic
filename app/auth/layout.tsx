import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

interface AuthLayoutProps {
  children: React.ReactNode
}

// Auth pages should NOT be indexed - they're internal authentication pages
export const metadata: Metadata = {
  title: "AltFaze – Secure Sign In",
  description: "Sign in to your AltFaze account to hire freelancers, find projects, or start earning as a freelancer.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </ThemeProvider>
  )
}