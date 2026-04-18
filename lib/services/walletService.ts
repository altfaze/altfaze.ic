/**
 * Wallet Service - Handle wallet operations, transfers, and balances
 */

import { db } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'

export interface AddFundsInput {
  userId: string
  amount: number
  paymentMethod: string // 'STRIPE', 'RAZORPAY', 'MANUAL'
  stripeSessionId?: string
}

export interface WithdrawInput {
  userId: string
  amount: number
  bankAccount?: string
  method: string // 'STRIPE', 'RAZORPAY', 'MANUAL'
}

/**
 * Get wallet balance for user
 */
export async function getWalletBalance(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: true,
        totalEarned: true,
        totalSpent: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      success: true,
      balance: Number(user.walletBalance),
      totalEarned: Number(user.totalEarned),
      totalSpent: Number(user.totalSpent),
    }
  } catch (error: any) {
    console.error('[WALLET_SERVICE] Get balance error:', error.message)
    throw error
  }
}

/**
 * Add funds to wallet
 */
export async function addFunds(input: AddFundsInput) {
  const { userId, amount, paymentMethod, stripeSessionId } = input

  try {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Create transaction and update wallet in one transaction
    const result = await db.$transaction(async (tx: any) => {
      // Update user wallet
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            increment: amount,
          },
        },
        select: { walletBalance: true },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'ADD_FUNDS',
          amount: new Decimal(amount),
          description: `Added funds via ${paymentMethod}`,
          status: 'COMPLETED',
          stripeSessionId,
          metadata: { paymentMethod },
        },
      })

      return { user: updatedUser, transaction }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'FUNDS_ADDED',
        description: `Added ₹${amount} via ${paymentMethod}`,
        metadata: { amount, paymentMethod },
      },
    }).catch((err: any) => console.error('[WALLET_SERVICE] Activity log error:', err))

    return {
      success: true,
      newBalance: Number(result.user.walletBalance),
      transaction: result.transaction,
    }
  } catch (error: any) {
    console.error('[WALLET_SERVICE] Add funds error:', error.message)
    throw error
  }
}

/**
 * Request withdrawal
 */
export async function requestWithdrawal(input: WithdrawInput) {
  const { userId, amount, method, bankAccount } = input

  try {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get current balance
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    })

    const currentBalance = user ? Number(user.walletBalance) : 0
    if (!user || currentBalance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Minimum withdrawal
    if (amount < 100) {
      throw new Error('Minimum withdrawal amount is ₹100')
    }

    // Create withdrawal record
    const withdrawal = await db.$transaction(async (tx: any) => {
      // Deduct from wallet (hold the amount)
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: amount,
          },
        },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'WITHDRAWAL_REQUEST',
          amount: new Decimal(amount),
          description: `Withdrawal request via ${method}`,
          status: 'PENDING',
          metadata: { method, bankAccount },
        },
      })

      return transaction
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'WITHDRAWAL_REQUESTED',
        description: `Requested ₹${amount} withdrawal via ${method}`,
        metadata: { amount, method },
      },
    }).catch((err: any) => console.error('[WALLET_SERVICE] Activity log error:', err))

    return {
      success: true,
      withdrawal,
      message: 'Withdrawal request submitted. We will process it within 24 hours.',
    }
  } catch (error: any) {
    console.error('[WALLET_SERVICE] Withdraw error:', error.message)
    throw error
  }
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(userId: string, limit = 50) {
  try {
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return {
      success: true,
      transactions: transactions.map(t => ({
        ...t,
        amount: Number(t.amount),
        netAmount: t.netAmount ? Number(t.netAmount) : null,
        commission: t.commission ? Number(t.commission) : null,
      })),
    }
  } catch (error: any) {
    console.error('[WALLET_SERVICE] Get history error:', error.message)
    throw error
  }
}

/**
 * Transfer funds between users (admin/system action)
 */
export async function transferFunds(fromUserId: string, toUserId: string, amount: number, reason: string) {
  try {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get sender balance
    const sender = await db.user.findUnique({
      where: { id: fromUserId },
      select: { walletBalance: true },
    })

    const senderBalance = sender ? Number(sender.walletBalance) : 0
    if (!sender || senderBalance < amount) {
      throw new Error('Insufficient balance in sender wallet')
    }

    const result = await db.$transaction(async (tx: any) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: fromUserId },
        data: {
          walletBalance: { decrement: amount },
          totalSpent: { increment: amount },
        },
      })

      // Add to receiver
      await tx.user.update({
        where: { id: toUserId },
        data: {
          walletBalance: { increment: amount },
          totalEarned: { increment: amount },
        },
      })

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId: fromUserId,
          type: 'TRANSFER',
          amount: new Decimal(amount),
          description: `Transferred to user: ${reason}`,
          status: 'COMPLETED',
          receiverId: toUserId,
          metadata: { reason },
        },
      })

      await tx.transaction.create({
        data: {
          userId: toUserId,
          type: 'TRANSFER_RECEIVED',
          amount: new Decimal(amount),
          description: `Received transfer: ${reason}`,
          status: 'COMPLETED',
          senderId: fromUserId,
          metadata: { reason },
        },
      })

      return true
    })

    return { success: true, message: 'Transfer completed' }
  } catch (error: any) {
    console.error('[WALLET_SERVICE] Transfer error:', error.message)
    throw error
  }
}
