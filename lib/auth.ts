import { db } from '../lib/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { nanoid } from 'nanoid'
import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
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
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error: any) {
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
          
          await db.user.upsert({
            where: { email: normalizedEmail },
            update: {
              lastLogin: new Date(),
              isVerified: true, // OAuth users are verified
            },
            create: {
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
        }
        return true
      } catch (error: any) {
        console.error('[AUTH] SignIn callback error:', error)
        // Allow signin even if upsert fails - adapter will handle
        return true
      }
    },

    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email || ''
        session.user.name = token.name
        session.user.image = token.picture
        session.user.username = token.username as string | undefined
        session.user.role = (token.role as string) || 'CLIENT'
      }

      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      // Load user data from DB
      try {
        if (token.email) {
          const dbUser = await db.user.findUnique({
            where: { email: token.email },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.username = dbUser.username || ''
            token.role = dbUser.role || 'CLIENT'
            // Check if account is suspended
            if ((dbUser as any).isSuspended) {
              return { ...token, isSuspended: true }
            }
          }
        }
      } catch (error) {
        console.error('[JWT] Error loading user data:', error)
        // Continue with existing token data if lookup fails
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

