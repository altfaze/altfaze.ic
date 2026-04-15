/**
 * Real-Time Event Hooks for React Components
 * Client-side WebSocket integration
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface RealtimeEvent {
  type: string
  data: any
  timestamp: string
}

export function useRealtimeUpdates(eventType: 'projects' | 'freelancers' | 'user') {
  const { data: session } = useSession()
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user) return

    // In production, connect to actual WebSocket server
    // const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

    // For now, simulate with polling
    const pollInterval = setInterval(async () => {
      try {
        // Fetch fresh data
        let endpoint = ''
        if (eventType === 'projects') {
          endpoint = '/api/projects?limit=10&status=OPEN'
        } else if (eventType === 'user') {
          endpoint =
            session.user.role === 'CLIENT'
              ? '/api/dashboard/client'
              : '/api/dashboard/freelancer'
        }

        if (endpoint) {
          const res = await fetch(endpoint)
          if (res.ok) {
            const data = await res.json()
            setEvents([
              {
                type: eventType,
                data,
                timestamp: new Date().toISOString(),
              },
            ])
          }
        }
      } catch (error) {
        console.error('[Realtime Poll Error]', error)
      }
    }, 5000) // Poll every 5 seconds

    setIsConnected(true)

    return () => {
      clearInterval(pollInterval)
      setIsConnected(false)
    }
  }, [session?.user, eventType])

  return { events, isConnected }
}

export function useProjectUpdates() {
  return useRealtimeUpdates('projects')
}

export function useFreelancerUpdates() {
  return useRealtimeUpdates('freelancers')
}

export function useUserUpdates() {
  return useRealtimeUpdates('user')
}

/**
 * Notification Hook
 * Shows toast notifications for real-time events
 */
export function useRealtimeNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; type: 'info' | 'success' | 'warning' | 'error'}>>([])

  useEffect(() => {
    if (!session?.user) return

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          if (data.data?.unread?.length > 0) {
            setNotifications(
              data.data.unread.map((notif: any) => ({
                id: notif.id,
                message: notif.message,
                type: notif.type || 'info',
              }))
            )
          }
        }
      } catch (error) {
        console.error('[Notifications Error]', error)
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(pollInterval)
  }, [session?.user])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return { notifications, dismissNotification }
}
