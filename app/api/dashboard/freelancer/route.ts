import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthWithRole, handleApiError } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { rateLimit, API_RATE_LIMIT } from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/freelancer
 * Get complete freelancer dashboard data
 */
export async function GET(req: NextRequest) {
  try {
    const limited = !(await rateLimit(req, 'api', API_RATE_LIMIT.limit, API_RATE_LIMIT.window))
    if (limited) {
      return errorResponse(429, 'Too many requests. Please try again later.')
    }

    const { userId } = await requireAuthWithRole(req, 'FREELANCER')

    // Get user and freelancer info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        walletBalance: true,
        totalEarned: true,
        freelancer: {
          select: {
            rating: true,
            reviewCount: true,
            hourlyRate: true,
          },
        },
      },
    })

    // Get projects info
    const [completedProjects, ongoingProjects] = await Promise.all([
      db.project.count({
        where: { submiterId: userId, status: 'COMPLETED' },
      }),
      db.project.count({
        where: { submiterId: userId, status: 'IN_PROGRESS' },
      }),
    ])

    // Get active projects
    const activeProjects = await db.project.findMany({
      where: { submiterId: userId, status: 'IN_PROGRESS' },
      select: {
        id: true,
        title: true,
        budget: true,
        deadline: true,
        creator: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get pending applications
    const pendingApplications = await db.request.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
      },
      select: {
        id: true,
        title: true,
        amount: true,
        description: true,
        createdAt: true,
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            client: { select: { company: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get accepted applications (active work)
    const acceptedApplications = await db.request.findMany({
      where: {
        senderId: userId,
        status: 'ACCEPTED',
      },
      select: {
        id: true,
        title: true,
        amount: true,
        dueDate: true,
        projectId: true,
      },
      take: 5,
    })

    // Get transaction summary
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        type: true,
        amount: true,
        netAmount: true,
        status: true,
        description: true,
        createdAt: true,
      },
    })

    // Get templates uploaded
    const templates = await db.template.count({
      where: { uploaderId: userId },
    })

    return successResponse(
      {
        user: {
          name: user?.name,
          email: user?.email,
          image: user?.image,
          walletBalance: user?.walletBalance.toNumber() || 0,
          totalEarned: user?.totalEarned.toNumber() || 0,
          rating: user?.freelancer?.rating.toNumber() || 0,
          reviewCount: user?.freelancer?.reviewCount || 0,
          hourlyRate: user?.freelancer?.hourlyRate?.toNumber() || 0,
        },
        projects: {
          completed: completedProjects,
          ongoing: ongoingProjects,
          active: activeProjects.map(p => ({
            ...p,
            budget: p.budget?.toNumber() || 0,
          })),
        },
        applications: {
          pending: pendingApplications.length,
          accepted: acceptedApplications.length,
          pendingList: pendingApplications.map(a => ({
            ...a,
            amount: a.amount?.toNumber() || 0,
          })),
        },
        templates,
        transactions: transactions.map(t => ({
          ...t,
          amount: t.amount.toNumber(),
          netAmount: t.netAmount?.toNumber() || 0,
        })),
      },
      200,
      'Dashboard data retrieved'
    )
  } catch (error) {
    console.error('[FREELANCER_DASHBOARD_ERROR]', error)
    return handleApiError(error)
  }
}
