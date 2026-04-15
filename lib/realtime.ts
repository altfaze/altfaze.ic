/**
 * Real-Time Event Service
 * Handles WebSocket/Pusher events for real-time updates
 */

export type EventType =
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'REQUEST_SENT'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_REJECTED'
  | 'TEMPLATE_UPLOADED'
  | 'WALLET_UPDATED'
  | 'WORK_SUBMITTED'
  | 'MESSAGE_SENT'

export interface RealtimeEvent {
  type: EventType
  userId?: string
  data: Record<string, any>
  timestamp: string
}

/**
 * Event emitter for broadcasting real-time updates
 * In production, replace with Pusher/Socket.io
 */
export class EventEmitter {
  private static listeners: Map<string, Function[]> = new Map()

  static on(event: EventType, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  static off(event: EventType, callback: (data: any) => void) {
    const listeners = this.listeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  static emit(event: EventType, data: any) {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[EVENT_LISTENER_ERROR] ${event}:`, error)
        }
      })
    }
  }

  static clear() {
    this.listeners.clear()
  }
}

/**
 * Broadcast event to specific user or channel
 */
export async function broadcastEvent(
  event: RealtimeEvent,
  recipients: string[] = []
): Promise<boolean> {
  try {
    // For now, just emit locally
    // In production, integrate with:
    // - Pusher
    // - Socket.io
    // - Redis PubSub
    EventEmitter.emit(event.type, event.data)
    return true
  } catch (error) {
    console.error('[BROADCAST_ERROR]', error)
    return false
  }
}

/**
 * Subscribe to real-time events for a user
 */
export async function subscribeToUserEvents(userId: string): Promise<boolean> {
  try {
    // Subscribe to user's private channel
    // Integration with Pusher/Socket.io would happen here
    console.log(`[SUBSCRIBE] User ${userId} subscribed to events`)
    return true
  } catch (error) {
    console.error('[SUBSCRIBE_ERROR]', error)
    return false
  }
}

/**
 * Helper: Emit project created event
 */
export async function emitProjectCreated(projectId: string, creatorId: string, project: any) {
  await broadcastEvent(
    {
      type: 'PROJECT_CREATED',
      userId: creatorId,
      data: project,
      timestamp: new Date().toISOString(),
    },
    [] // Broadcast to all
  )
}

/**
 * Helper: Emit request sent event
 */
export async function emitRequestSent(requestId: string, senderId: string, receiverId: string, request: any) {
  await broadcastEvent(
    {
      type: 'REQUEST_SENT',
      userId: receiverId,
      data: request,
      timestamp: new Date().toISOString(),
    },
    [receiverId]
  )
}

/**
 * Helper: Emit request accepted event
 */
export async function emitRequestAccepted(requestId: string, acceptedBy: string, request: any) {
  await broadcastEvent(
    {
      type: 'REQUEST_ACCEPTED',
      userId: acceptedBy,
      data: request,
      timestamp: new Date().toISOString(),
    },
    []
  )
}
