import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role, name } = await req.json()

    if (!role || (role !== "CLIENT" && role !== "FREELANCER")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user with role in database
    const user = await db.user.update({
      where: { email: session.user.email },
      data: {
        role,
        ...(name && { name }),
      },
      include: {
        freelancer: true,
        client: true,
      },
    })

    // Create freelancer or client profile
    if (role === "FREELANCER" && !user.freelancer) {
      await db.freelancer.create({
        data: {
          userId: user.id,
          skills: [],
        },
      })
    } else if (role === "CLIENT" && !user.client) {
      await db.client.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (error) {
    console.error("Onboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
