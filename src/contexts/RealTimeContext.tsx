"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { getCookie } from "@/lib/cookies"

interface RealTimeContextType {
  subscribe: (handler: (message: any) => void) => () => void;
  publish: (message: any) => void;
  isConnected: boolean;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null)

export function RealTimeProvider({ 
  children, 
  projectId,
  userId 
}: { 
  children: React.ReactNode
  projectId: string
  userId: string
}) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = getCookie('token') || getCookie('Authorization')?.replace('Bearer ', '')
    if (!token) {
      console.error('No token available for WebSocket connection')
      return
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001'
    socketRef.current = io(wsUrl, {
      auth: { token, userId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      socketRef.current?.emit('join:project', projectId)
    })

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    socketRef.current.on('error', (error: any) => {
      console.error('WebSocket error:', error)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [projectId, userId])

  const subscribe = (handler: (message: any) => void) => {
    if (!socketRef.current) {
      console.warn('Attempting to subscribe before socket connection')
      return () => {}
    }
    
    socketRef.current.on('message', handler)
    return () => {
      socketRef.current?.off('message', handler)
    }
  }

  const publish = (message: any) => {
    if (!socketRef.current?.connected) {
      console.warn('Attempting to publish before socket connection')
      return
    }
    
    socketRef.current.emit('message', { ...message, projectId, userId })
  }

  return (
    <RealTimeContext.Provider value={{ subscribe, publish, isConnected }}>
      {children}
    </RealTimeContext.Provider>
  )
}

export function useRealTime() {
  const context = useContext(RealTimeContext)
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider')
  }
  return context
} 