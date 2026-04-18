import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { successResponse, errorResponse } from '@/lib/api-utils'

// Force dynamic rendering - never cache user registration
export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/register
 * Register a new user with email/password
 * 
 * SECURITY: This is a CRITICAL auth route
 * - Must never be cached (user creation must happen fresh each time)
 * - Must validate email uniqueness at request time
 * - Must hash passwords before storage
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, name, mobile } = await req.json()

    // Validation
    if (!email || !password || !name) {
      return errorResponse(400, 'Missing required fields: email, password, name')
    }

    if (password.length < 6) {
      return errorResponse(400, 'Password must be at least 6 characters')
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse(400, 'Email already registered')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      201,
      'User registered successfully'
    )
  } catch (error: any) {
    console.error('[REGISTER_ERROR]', error)
    return errorResponse(500, 'An error occurred during registration', error)
  }
}
