import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { successResponse, handleApiError, ValidationError } from "@/lib/api"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { role, title, bio, hourlyRate, company, description } = body

    if (!role || !["CLIENT", "FREELANCER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Use CLIENT or FREELANCER" }, { status: 400 })
    }

    // Update user role in database
    const updatedUser = await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        role,
      },
    })

    // Create freelancer profile if role is FREELANCER
    if (role === "FREELANCER") {
      const existingFreelancer = await db.freelancer.findUnique({
        where: { userId: updatedUser.id },
      })

      if (!existingFreelancer) {
        await db.freelancer.create({
          data: {
            userId: updatedUser.id,
            title: title || undefined,
            bio: bio || undefined,
            hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
            skills: [],
          },
        })
      } else if (title || bio || hourlyRate) {
        await db.freelancer.update({
          where: { userId: updatedUser.id },
          data: {
            ...(title && { title }),
            ...(bio && { bio }),
            ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
          },
        })
      }
    }

    // Create client profile if role is CLIENT
    if (role === "CLIENT") {
      const existingClient = await db.client.findUnique({
        where: { userId: updatedUser.id },
      })

      if (!existingClient) {
        await db.client.create({
          data: {
            userId: updatedUser.id,
            company: company || undefined,
            description: description || undefined,
          },
        })
      } else if (company || description) {
        await db.client.update({
          where: { userId: updatedUser.id },
          data: {
            ...(company && { company }),
            ...(description && { description }),
          },
        })
      }
    }

    const updatedProfile = await db.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        freelancer: true,
        client: true,
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        user: updatedProfile,
        message: `${role} profile created successfully`
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error("[ONBOARD_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
