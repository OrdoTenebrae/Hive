import { getCookie } from "@/lib/cookies"

export interface WebSocketMessage {
  type: string
  projectId: string
  userId: string
  payload: any
  timestamp: number
}

class WebSocketService {
  private ws: WebSocket | null = null
  private projectId: string | null = null
  private messageHandlers: ((message: WebSocketMessage) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null

  async initialize(projectId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.projectId = projectId
    await this.connect()
  }

  private async connect() {
    try {
      const token = getCookie('token') || getCookie('Authorization')?.replace('Bearer ', '')
      if (!token || !this.projectId) {
        throw new Error('No token or project ID available')
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/websocket/${this.projectId}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage
          this.messageHandlers.forEach(handler => handler(message))
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.ws?.close()
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000))
  }

  subscribe(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }

  send(message: Omit<WebSocketMessage, 'timestamp'>) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected')
      return
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now()
    }

    this.ws.send(JSON.stringify(fullMessage))
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.projectId = null
    this.messageHandlers = []
    this.reconnectAttempts = 0
  }
}

export const webSocketService = new WebSocketService() 