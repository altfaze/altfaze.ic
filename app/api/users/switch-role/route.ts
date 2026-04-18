import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'

/**
 * POST /api/users/switch-role
 * Switch user between CLIENT and FREELANCER roles
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return errorResponse(401, 'Unauthorized - please login')
    }

    const { newRole } = await req.json()

    // Validate role
    if (!newRole || !['CLIENT', 'FREELANCER'].includes(newRole)) {
      return errorResponse(400, 'Invalid role. Must be CLIENT or FREELANCER')
    }

    const normalizedEmail = session.user.email.toLowerCase().trim()

    // Get current user
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        freelancer: true,
        client: true,
      },
    })

    if (!user) {
      return errorResponse(404, 'User not found')
    }

    // Check if already in this role
    if (user.role === newRole) {
      return successResponse(
        { role: user.role, message: 'Already in this role' },
        200,
        'No role change needed'
      )
    }

    // Switch role and ensure both profiles exist
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        role: newRole,
        // Create freelancer profile if switching to FREELANCER
        ...(newRole === 'FREELANCER' && !user.freelancer && {
          freelancer: {
            create: {},
          },
        }),
        // Create client profile if switching to CLIENT
        ...(newRole === 'CLIENT' && !user.client && {
          client: {
            create: {},
          },
        }),
      },
      include: {
        freelancer: true,
        client: true,
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'ROLE_SWITCHED',
        description: `Switched role from ${user.role} to ${newRole}`,
        metadata: {
          oldRole: user.role,
          newRole: newRole,
          timestamp: new Date().toISOString(),
        },
      },
    }).catch(err => console.error('[ROLE_SWITCH] Activity log failed:', err))

    console.log(`[ROLE_SWITCH] User ${user.email} switched from ${user.role} to ${newRole}`)

    return successResponse(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        freelancer: updatedUser.freelancer,
        client: updatedUser.client,
      },
      200,
      `Successfully switched to ${newRole} role. Please refresh the page.`
    )
  } catch (error) {
    console.error('[SWITCH_ROLE_ERROR]', error)
    return errorResponse(500, 'Failed to switch role', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
