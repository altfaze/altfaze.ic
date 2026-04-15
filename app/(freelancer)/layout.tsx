import { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ModeToggle } from "@/components/toggle"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Freelancer Dashboard | ALTFaze',
  description: 'Manage your profile, view job offers, and track earnings on ALTFaze',
}

export default function FreelancerLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  // Middleware has already verified authentication and role
  // No need to double-check here - just render the layout

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen">
        <DashboardSidebar />
      </div>

      <div className="md:ml-64 flex-1 flex flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex-1" />
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}