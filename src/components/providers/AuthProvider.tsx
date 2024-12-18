"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'
    const isDashboardPage = pathname.startsWith('/dashboard')

    if (!token && isDashboardPage) {
      router.push('/auth/login')
      return
    }

    if (token && isAuthPage) {
      router.push('/dashboard')
      return
    }

    if (token) {
      // Set token in cookie for API requests
      document.cookie = `Authorization=Bearer ${token}; path=/`
      
      // Add token to fetch requests
      const originalFetch = window.fetch
      window.fetch = function(input, init = {}) {
        init.headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(init.headers || {})
        }
        return originalFetch(input, init)
      }
    }
  }, [pathname, router])

  return <>{children}</>
} 