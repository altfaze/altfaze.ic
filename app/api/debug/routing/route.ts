import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No authenticated session",
          sessionUser: null,
          dbUser: null,
          recommendations: ["Go to /login to authenticate"]
        },
        { status: 401 }
      )
    }

    // Fetch latest user data from database
    const user = await db.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      include: {
        freelancer: true,
        client: true
      }
    })

    const dashboardPath = user?.role === "FREELANCER" 
      ? "/freelancer/my-dashboard"
      : "/client/dashboard"

    const recommendations = []
    if (!user?.role) {
      recommendations.push("Role not set - go to /onboard to select a role")
    } else if (user.role === "CLIENT" && !user.client) {
      recommendations.push("No client profile found - might need to recreate at /onboard")
    } else if (user.role === "FREELANCER" && !user.freelancer) {
      recommendations.push("No freelancer profile found - might need to recreate at /onboard")
    } else {
      recommendations.push(`All good! Go to ${dashboardPath}`)
    }

    return NextResponse.json(
      {
        authenticated: true,
        sessionUser: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role
        },
        dbUser: user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasClient: !!user.client,
          hasFreelancer: !!user.freelancer
        } : null,
        recommendedDashboard: dashboardPath,
        recommendations,
        routes: {
          login: "/login",
          register: "/register",
          onboard: "/onboard",
          clientDashboard: "/client/dashboard",
          freelancerDashboard: "/freelancer/my-dashboard"
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("[ROUTING_DEBUG_ERROR]", error?.message || error)
    return NextResponse.json(
      { 
        authenticated: false,
        error: error?.message || "Server error",
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
