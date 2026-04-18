'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Icons } from "@/components/more-icons"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Redirect non-admin users
  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user?.role !== "ADMIN") {
      router.push("/client/dashboard")
      return
    }
  }, [session, status, router])

  if (status === "loading" || session?.user?.role !== "ADMIN") {
    return null
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "🏠",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: "👥",
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: "📋",
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: "💰",
    },
    {
      title: "Disputes",
      href: "/admin/disputes",
      icon: "⚖️",
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: "📊",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: "⚙️",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Icons.logo className="h-6 w-6" />
            <span>ALTFaze Admin</span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-muted",
                "active:bg-muted"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Welcome, {session?.user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
