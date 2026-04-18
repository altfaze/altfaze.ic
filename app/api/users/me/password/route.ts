import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'

/**
 * PATCH /api/users/me/password
 * Change user password
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized')
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return errorResponse(400, 'Current password and new password are required')
    }

    if (newPassword.length < 8) {
      return errorResponse(400, 'New password must be at least 8 characters')
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    if (!user.password) {
      return errorResponse(400, 'This account does not have a password set. Please use OAuth login.')
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return errorResponse(400, 'Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    return successResponse(null, 200, 'Password changed successfully')
  } catch (error: any) {
    console.error('[USER_PASSWORD_PATCH_ERROR]', error)
    return errorResponse(500, error.message || 'Failed to change password')
  }
}
