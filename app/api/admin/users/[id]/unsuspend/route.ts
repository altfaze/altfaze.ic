import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const auth = await requireAuthWithRole(req, 'ADMIN')

    const userId = params.id

    if (!userId) {
      return errorResponse(400, 'User ID is required')
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, isSuspended: true },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Update user to unsuspended
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        isSuspended: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuspended: true,
      },
    })

    // Log activity
    try {
      await db.activityLog.create({
        data: {
          userId: auth.userId,
          action: 'USER_UNSUSPENDED',
          description: `Admin unsuspended user: ${user.email}`,
          metadata: { targetUserId: userId, adminId: auth.userId },
        },
      })
    } catch (err) {
      console.error('[ADMIN_UNSUSPEND] Activity log failed:', err)
    }

    return successResponse(updatedUser, 200, 'User unsuspended successfully')
  } catch (error) {
    console.error('[ADMIN_UNSUSPEND]', error)
    return errorResponse(500, 'Failed to unsuspend user', error)
  }
}
