"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/more-icons"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarNavItem {
  href: string
  title: string
  icon: React.ReactNode
  roles?: string[]
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const role = session?.user?.role || "CLIENT"

  const navItems: SidebarNavItem[] = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <Icons.dashboard className="h-4 w-4" />,
    },
    {
      href: "/dashboard/hire",
      title: "Hire Freelancer",
      icon: <Icons.briefcase className="h-4 w-4" />,
      roles: ["CLIENT"],
    },
    {
      href: "/dashboard/work",
      title: "Find Work",
      icon: <Icons.search className="h-4 w-4" />,
      roles: ["FREELANCER"],
    },
    {
      href: "/dashboard/templates",
      title: "Templates",
      icon: <Icons.package className="h-4 w-4" />,
    },
    {
      href: "/dashboard/projects",
      title: "My Projects",
      icon: <Icons.folder className="h-4 w-4" />,
    },
    {
      href: "/dashboard/upload",
      title: "Upload Project",
      icon: <Icons.upload className="h-4 w-4" />,
      roles: ["FREELANCER"],
    },
    {
      href: "/dashboard/ai-help",
      title: "AI Help",
      icon: <Icons.sparkles className="h-4 w-4" />,
    },
    {
      href: "/dashboard/requests",
      title: "Requests",
      icon: <Icons.bell className="h-4 w-4" />,
    },
    {
      href: "/dashboard/wallet",
      title: "Wallet & Payments",
      icon: <Icons.creditCard className="h-4 w-4" />,
    },
    {
      href: "/dashboard/offers",
      title: "Discounts & Offers",
      icon: <Icons.gift className="h-4 w-4" />,
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
      icon: <Icons.settings className="h-4 w-4" />,
    },
  ]

  const filteredNavItems = navItems.filter((item) => {
    if (item.roles && !item.roles.includes(role)) {
      return false
    }
    return true
  })

  return (
    <div className="flex h-full flex-col gap-4 border-r border-border bg-background py-4">
      <div className="px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-2">
            <Icons.logo className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">ATXEP</span>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border px-4 py-4">
        <div className="mb-4 flex items-center gap-3 rounded-md bg-accent p-3">
          <img
            src={session?.user?.image || "https://avatar.vercel.sh/"}
            alt="User"
            className="h-8 w-8 rounded-full"
          />
          <div className="flex-1 text-sm">
            <p className="font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={async () => {
            await signOut({ redirect: true, callbackUrl: "/" })
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
