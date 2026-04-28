// app/login/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "AltFaze Login",
  description: "Sign in to your AltFaze account",
  robots: {
    index: false,
    follow: false,
  }
}

export default function LoginPage() {
  redirect('/auth/login')
}
