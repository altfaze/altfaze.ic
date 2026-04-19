import { db } from '../lib/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { nanoid } from 'nanoid'
import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// ✅ CRITICAL: Use a consistent secret for JWT encryption/decryption
// This must be the same across all server instances
const getAuthSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    // For development/build, use a fallback
    // In true production, NEXTAUTH_SECRET will be set by the platform
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
      // On Vercel production, NEXTAUTH_SECRET should be set
      console.warn('⚠️  NEXTAUTH_SECRET not set in production - this will cause authentication to fail')
      return 'temporary-build-secret-change-immediately'
    }
    // For local development and builds, use a consistent default
    console.warn('⚠️  NEXTAUTH_SECRET not set - using development default')
    return 'dev-secret-key-change-in-production'
  }
  return secret
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hour session expiration
    updateAge: 60 * 60,   // Refresh token every hour
  },
  // ✅ Use only one secret config - not both secret and jwt.secret
  secret: getAuthSecret(),
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password')
        }

        try {
          // Normalize email
          const email = credentials.email.toLowerCase().trim()
          
          const user = await db.user.findUnique({
            where: { email },
          })

          if (!user) {
            throw new Error('User account not found. Please create an account first.')
          }

          // Check if account is suspended
          if ((user as any).isSuspended) {
            throw new Error('This account has been suspended. Please contact support.')
          }
          // If user has no password, they signed up with OAuth only
          if (!user.password) {
            throw new Error('This account was created with Google/GitHub only. Please login using Google or GitHub instead.')
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            throw new Error('Incorrect password')
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          }).catch(err => console.error('[AUTH] Error updating lastLogin:', err))

          console.log('[AUTH] Credentials login successful for:', email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error: any) {
          console.error('[AUTH] Credentials authorization failed:', error.message)
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, ensure user exists or create them
        if (account?.provider === 'google' || account?.provider === 'github') {
          if (!user.email) return false

          const normalizedEmail = user.email.toLowerCase().trim()
          
          // ✅ FIXED: Check for suspension during OAuth signin
          const existingUser = await db.user.findUnique({
            where: { email: normalizedEmail },
            select: { isSuspended: true, id: true }
          })

          if (existingUser?.isSuspended) {
            console.warn('[AUTH] Suspended user attempted OAuth login:', normalizedEmail)
            return false
          }
          
          // ✅ FIXED: Use create-only to prevent duplicate client profiles  
          // Only create if doesn't exist, don't upsert
          const dbUser = await db.user.findUnique({
            where: { email: normalizedEmail },
          })

          if (!dbUser) {
            // Create new user
            await db.user.create({
              data: {
                email: normalizedEmail,
                name: user.name || profile?.name || 'User',
                image: user.image || profile?.image,
                role: 'CLIENT',
                username: nanoid(10),
                isVerified: true, // OAuth users are verified
                // Create default client profile
                client: {
                  create: {},
                },
              },
              include: {
                client: true,
              },
            })
          } else {
            // User exists - just update login time
            await db.user.update({
              where: { email: normalizedEmail },
              data: {
                lastLogin: new Date(),
                isVerified: true,
              },
            })
          }
        }
        return true
      } catch (error: any) {
        console.error('[AUTH] SignIn callback error:', error)
        return false  // ✅ FIXED: Return false on error instead of allowing signin
      }
    },

    async session({ token, session }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.email = token.email || ''
          session.user.name = token.name
          session.user.image = token.picture
          session.user.username = token.username as string | undefined
          session.user.role = (token.role as string) || 'CLIENT'
        }
      } catch (error) {
        console.error('[SESSION] Error in session callback:', error)
        // Return minimal session on error - don't let JWT errors break the app
        return session
      }

      return session
    },

    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.role = (user as any).role || 'CLIENT'
          console.log('[JWT] New JWT issued for user:', user.email, 'role:', token.role)
        }

        // ✅ FIXED: Verify user still exists and check suspension on every token refresh
        const emailToUse = token.email || user?.email
        if (emailToUse) {
          const dbUser = await db.user.findUnique({
            where: { email: emailToUse.toLowerCase().trim() },
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
              isSuspended: true,
            }
          })
          
          if (!dbUser) {
            // User deleted - invalidate token
            console.warn('[JWT] User not found - invalidating token:', emailToUse)
            return { ...token, invalid: true }
          }

          if (dbUser.isSuspended) {
            // User suspended - invalidate token
            console.warn('[JWT] Suspended user token refresh attempt:', emailToUse)
            return { ...token, isSuspended: true }
          }

          // ✅ CRITICAL: Always update token with latest data from database
          token.id = dbUser.id
          token.email = dbUser.email
          token.username = dbUser.username || ''
          token.role = dbUser.role || 'CLIENT'
          token.isSuspended = false
          
          if (dbUser.role !== token.role) {
            console.log('[JWT] Role updated in token:', { email: dbUser.email, role: dbUser.role })
          }
        }
      } catch (error) {
        console.error('[JWT] Error in JWT callback:', error)
        // Don't invalidate on error - let the token be used and fail later if needed
        // This prevents cascading failures on database errors
        if (!token.id) {
          token.id = user?.id || ''
          token.email = user?.email || token.email || ''
          token.role = (user as any)?.role || token.role || 'CLIENT'
        }
      }

      return token
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/onboard`
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)

// export { getServerSession }

