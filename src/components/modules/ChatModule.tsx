import { useState, useEffect, useRef } from 'react'
import { useRealTime } from '@/contexts/RealTimeContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
import { fetchClient } from '@/lib/fetch-client'
import { showToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: number
}

interface ChatModuleProps {
  projectId: string
}

export function ChatModule({ projectId }: ChatModuleProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { subscribe, publish, isConnected } = useRealTime()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project members
        const membersData = await fetchClient(`/api/projects/${projectId}/members`)
        setMembers(membersData)

        // Load chat history
        const chatData = await fetchClient(`/api/projects/${projectId}/chat`)
        setMessages(chatData)
      } catch (error) {
        console.error('Failed to load initial data:', error)
        showToast({
          title: "Error",
          description: "Failed to load chat data. Please try refreshing the page.",
          variant: "destructive"
        })
      }
    }

    loadData()
  }, [projectId])

  useEffect(() => {
    // Subscribe to new messages
    const unsubscribe = subscribe((message: any) => {
      if (message.type === 'CHAT_MESSAGE') {
        setMessages(prev => [...prev, message.payload])
      }
    })

    return () => unsubscribe()
  }, [subscribe])

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    try {
      setIsLoading(true)
      const response = await fetchClient(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        body: { content: newMessage.trim() }
      })

      publish({
        type: 'CHAT_MESSAGE',
        payload: response
      })

      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
      showToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-background border rounded-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Team Chat</h3>
        {!isConnected && (
          <span className="text-sm text-destructive">Disconnected</span>
        )}
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {message.senderName?.slice(0, 2).toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{message.senderName || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected || isLoading}
          />
          <Button 
            onClick={sendMessage} 
            size="icon"
            disabled={!isConnected || isLoading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 