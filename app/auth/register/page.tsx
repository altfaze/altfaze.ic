import Link from "next/link"
import { Metadata } from "next"
import { generateMetadata } from "@/lib/seo/metadata-generator"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/more-icons"
import { UserAuthForm } from "@/components/user-auth-form"

// Register page needs separate metadata to override layout metadata
export const metadata: Metadata = generateMetadata({
  title: "AltFaze Sign Up – Join as Freelancer or Client",
  description: "Create your free AltFaze account. Join as a freelancer to earn money or as a client to hire top talent. Quick registration process.",
  keywords: [
    "AltFaze sign up",
    "register freelancer",
    "create account",
    "join freelance platform"
  ],
  path: "/register",
  ogTitle: "Join AltFaze – Start Your Freelance Journey",
  ogDescription: "Register for free and start hiring freelancers or earning as a freelancer on AltFaze."
})

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <UserAuthForm isSignUp={true} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}