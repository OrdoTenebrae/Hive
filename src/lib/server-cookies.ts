import { cookies } from 'next/headers'

export async function getServerCookie(name: string): Promise<string | undefined> {
  try {
    const cookieStore = await cookies()
    const value = cookieStore.get(name)?.value
    return value
  } catch (error) {
    console.warn('Failed to get cookie on server:', error)
    return undefined
  }
} 