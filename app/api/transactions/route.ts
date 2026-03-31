import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, type, description } = await req.json()

    if (!amount || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        type,
        amount: parseFloat(amount),
        description,
        status: "COMPLETED",
      },
    })

    // Update wallet balance based on transaction type
    if (type === "EARNING") {
      await db.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { increment: parseFloat(amount) },
          totalEarned: { increment: parseFloat(amount) },
        },
      })
    } else if (type === "PAYMENT") {
      await db.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { decrement: parseFloat(amount) },
          totalSpent: { increment: parseFloat(amount) },
        },
      })
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ transactions }, { status: 200 })
  } catch (error) {
    console.error("Transaction fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
