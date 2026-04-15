/**
 * WebSocket Initialization API Route
 * Initialize Socket.IO server
 */

import { initSocketServer } from '@/lib/socket-server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    initSocketServer(req, res)
    return res.status(200).json({
      success: true,
      message: 'WebSocket server initialized',
      socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3000',
    })
  } catch (error) {
    console.error('[SOCKET_INIT_ERROR]', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize WebSocket server',
    })
  }
}
