import { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Client Dashboard | ALTFaze',
  description: 'Manage your projects, hire freelancers, and track progress on ALTFaze',
}

export default function ClientLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen border-r">
        <DashboardSidebar />
      </div>

      <div className="md:ml-64 flex-1 flex flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex-1" />
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
