/**
 * Real-Time WebSocket Server
 * Handles live updates for projects, bids, and messages
 * 
 * In production, replace with Pusher/Socket.io
 */

import { Server } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'

let io: Server | null = null

export function initSocketServer(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any)?.server) return

  const server = (res.socket as any).server as any

  if (io) return io

  // Initialize Socket.IO
  io = new Server(server, {
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      credentials: true,
    },
  })

  // Room: 'projects' - broadcast new projects
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`)

    // Join events
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`)
      console.log(`[Socket] User ${userId} joined private room`)
    })

    socket.on('join-projects', () => {
      socket.join('projects-live')
      console.log(`[Socket] Client joined projects-live room`)
    })

    socket.on('join-freelancers', () => {
      socket.join('freelancers-live')
      console.log(`[Socket] Client joined freelancers-live room`)
    })

    // Project events
    socket.on('project-created', (data) => {
      io?.to('projects-live').emit('new-project', data)
    })

    socket.on('project-updated', (data) => {
      io?.to(`user-${data.clientId}`).emit('project-updated', data)
    })

    // Bid/Request events
    socket.on('bid-submitted', (data) => {
      io?.to(`user-${data.clientId}`).emit('new-bid', data)
    })

    socket.on('bid-accepted', (data) => {
      io?.to(`user-${data.freelancerId}`).emit('bid-accepted', data)
    })

    // Wallet events
    socket.on('wallet-updated', (data) => {
      io?.to(`user-${data.userId}`).emit('wallet-changed', data)
    })

    // Template events
    socket.on('template-uploaded', (data) => {
      io?.to('freelancers-live').emit('new-template', data)
    })

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`)
    })
  })

  server.io = io
  return io
}

export function getSocketServer() {
  return io
}

export function emitToUser(userId: string, event: string, data: any) {
  if (io) {
    io.to(`user-${userId}`).emit(event, data)
  }
}

export function broadcastToRoom(room: string, event: string, data: any) {
  if (io) {
    io.to(room).emit(event, data)
  }
}
