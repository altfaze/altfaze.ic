import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json(
        { role: null, verified: false, message: "No authenticated session" },
        { status: 401 }
      )
    }

    // Fetch latest user data from database
    const user = await db.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      select: { role: true, id: true, email: true, name: true }
    })

    if (!user) {
      return NextResponse.json(
        { role: null, verified: false, message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        role: user.role,
        verified: !!user.role,
        message: user.role ? `Role verified: ${user.role}` : "Role not yet set",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("[VERIFY_ROLE_ERROR]", error?.message || error)
    return NextResponse.json(
      { role: null, verified: false, error: error?.message || "Server error" },
      { status: 500 }
    )
  }
}
