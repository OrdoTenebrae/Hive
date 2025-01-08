export const runtime = 'nodejs'

import { WebSocketServer } from 'ws'
import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WebSocketMessage } from "@/lib/services/websocket-service"
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const wss = new WebSocketServer({ noServer: true })

// Store active connections
const clients = new Map<string, Set<WebSocket>>()

interface ExtendedWebSocket extends WebSocket {
  projectId?: string
  userId?: string
  isAlive?: boolean
  on(event: 'message', cb: (data: string) => void): void
  on(event: 'close', cb: () => void): void
  on(event: 'pong', cb: () => void): void
}

// Handle WebSocket messages
async function handleMessage(message: WebSocketMessage) {
  // Implement message handling logic here
  // For example, persist task updates, chat messages, etc.
  console.log('Handling message:', message)
}

// Broadcast presence updates
function broadcastPresence(projectId: string, userId: string, status: 'online' | 'offline') {
  const projectClients = clients.get(projectId)
  if (projectClients) {
    const message: WebSocketMessage = {
      type: 'PRESENCE_UPDATE',
      payload: { status },
      projectId,
      userId,
      timestamp: Date.now()
    }
    
    projectClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  if (!req.headers.get('upgrade')?.includes('websocket')) {
    return new Response('Expected websocket connection', { status: 426 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')

  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = await verifyJwt(token)
  if (!payload) {
    return new Response('Invalid token', { status: 401 })
  }

  try {
    const { projectId } = params
    if (!projectId) {
      return new Response('Invalid project ID', { status: 400 })
    }

    // Check if user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: payload.id },
          { members: { some: { id: payload.id } } }
        ]
      }
    })

    if (!project) {
      return new Response('Project not found or access denied', { status: 404 })
    }

    // Handle WebSocket upgrade
    const webSocket = new WebSocket(req.url)
    const ws = webSocket as ExtendedWebSocket
    const response = new Response(null, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade'
      }
    })

    // Store connection info
    ws.projectId = projectId
    ws.userId = payload.id
    ws.isAlive = true

    // Add to project room
    if (!clients.has(projectId)) {
      clients.set(projectId, new Set())
    }
    clients.get(projectId)!.add(ws)

    // Handle messages
    ws.on('message', async (data: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(data)
        
        // Broadcast to all clients in the project
        const projectClients = clients.get(projectId)
        if (projectClients) {
          projectClients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message))
            }
          })
        }

        // Persist message if needed
        await handleMessage(message)
      } catch (error) {
        console.error('Failed to handle message:', error)
      }
    })

    // Handle disconnection
    ws.on('close', () => {
      const projectClients = clients.get(projectId)
      if (projectClients) {
        projectClients.delete(ws)
        if (projectClients.size === 0) {
          clients.delete(projectId)
        }
      }

      // Broadcast offline status
      broadcastPresence(projectId, payload.id, 'offline')
    })

    // Setup ping/pong
    ws.on('pong', () => {
      ws.isAlive = true
    })

    // Send initial presence
    broadcastPresence(projectId, payload.id, 'online')

    return response
  } catch (error) {
    console.error('WebSocket connection error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 