"use client"

import { useState, useEffect } from "react"
import { ModuleLoader } from "@/components/modules/ModuleLoader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { fetchClient } from "@/lib/fetch-client"
import { RealTimeProvider } from "@/contexts/RealTimeContext"
import { toast } from "react-hot-toast"
import { getCookie } from "@/lib/cookies"
import { jwtDecode as decode } from "jwt-decode"

// Define JWT payload type
interface JwtPayload {
  id: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// Define available modules
const moduleRegistry = {
  kanban: {
    id: 'kanban',
    title: 'Kanban Board',
    icon: '📋'
  },
  chat: {
    id: 'chat',
    title: 'Team Chat',
    icon: '💬'
  }
  // Add other modules here
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const [installedModules, setInstalledModules] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const pathname = usePathname()
  const params = useParams()
  const isMarketplace = pathname.endsWith('/marketplace')
  
  useEffect(() => {
    async function checkAuth() {
      const token = getCookie('token')
      
      if (!token) {
        setError('Please log in to access this page')
        setIsAuthChecking(false)
        return
      }

      try {
        const decoded = decode<JwtPayload>(token)
        if (decoded && 'id' in decoded) {
          setUserId(decoded.id)
        } else {
          setError('Invalid token format')
        }
      } catch (error) {
        console.error('Failed to decode token:', error)
        setError('Invalid token')
      } finally {
        setIsAuthChecking(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    async function fetchModules() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetchClient(`/api/projects/${params.id}/modules`)
        console.log('📦 Loaded modules:', response.modules)
        setInstalledModules(response.modules)
      } catch (error) {
        console.error('Failed to fetch modules:', error)
        setError('Failed to load modules')
        toast.error('Failed to load modules')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (!isMarketplace && userId) {
      fetchModules()
    }
  }, [params.id, isMarketplace, userId])

  if (isMarketplace) {
    return children
  }

  if (isAuthChecking) {
    return (
      <div className="p-6 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!userId || error) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-500">Authentication error. Please try logging in again.</p>
        {error && (
          <pre className="text-left bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
            {error}
          </pre>
        )}
        <Button onClick={() => window.location.href = '/auth/login'} className="mt-4">
          Back to Login
        </Button>
      </div>
    )
  }

  return (
    <RealTimeProvider projectId={params.id as string} userId={userId}>
      <div className="flex flex-col h-full">
        <div className="p-6 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex justify-between items-center">
            {children}
            <Link href={`/projects/${params.id}/marketplace`}>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Store className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading modules...</div>
          ) : installedModules.length > 0 ? (
            <Tabs defaultValue={installedModules[0]} className="w-full">
              <TabsList className="mb-4">
                {installedModules.map(moduleId => {
                  const module = moduleRegistry[moduleId as keyof typeof moduleRegistry]
                  if (!module) return null
                  return (
                    <TabsTrigger key={moduleId} value={moduleId}>
                      <span className="mr-2">{module.icon}</span>
                      {module.title}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {installedModules.map(moduleId => (
                <TabsContent key={moduleId} value={moduleId} className="mt-4">
                  <ModuleLoader moduleId={moduleId} projectId={params.id as string} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              No modules installed. Visit the marketplace to add modules.
            </div>
          )}
        </div>
      </div>
    </RealTimeProvider>
  )
}