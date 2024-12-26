"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (token: string, userData: User) => {
    try {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set token in cookies
      document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      document.cookie = `Authorization=Bearer ${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      
      setUser(userData)
      
      // Redirect to dashboard using window.location
      // This ensures a full page reload and proper cookie handling
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login error:', error)
      logout()
    }
  }

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('user')
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    setUser(null)
    
    // Redirect to login using window.location
    // This ensures a full page reload and proper cookie clearing
    window.location.href = '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 