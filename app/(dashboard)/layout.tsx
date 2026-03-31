// "use client";
import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"

import { getCurrentUser } from "@/lib/session"
import { getAuthSession } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ModeToggle } from "@/components/toggle"

{/* @ts-ignore */}

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Dashboard | ATXEP - Freelance Marketplace',
  description: 'Manage your freelance projects, earnings, and marketplace activities on ATXEP',
}

export default async function DashboardLayout({ 
  children, 
}: DashboardLayoutProps) {
  const user = await getCurrentUser()
  const session = await getAuthSession();

  if (!user) {
    redirect('/login')
  }

  // If user just logged in and hasn't selected a role, redirect to onboard
  if (!user.role || user.role === 'CLIENT' && !user.client) {
    redirect('/onboard')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="md:ml-64 flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex-1" />
            <ModeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}