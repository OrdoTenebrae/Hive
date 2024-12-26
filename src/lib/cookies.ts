// Client-side cookie handling
export function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }
  
  try {
    // Try to get from cookie
    const cookies = document.cookie.split(';').map(c => c.trim())
    const cookie = cookies.find(c => c.startsWith(`${name}=`))
    if (cookie) {
      const value = decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1))
      console.log(`✅ Found cookie '${name}'`)
      return value
    }

    // Try Authorization header format
    if (name === 'token') {
      const authCookie = cookies.find(c => c.startsWith('Authorization=Bearer '))
      if (authCookie) {
        const value = decodeURIComponent(authCookie.slice(authCookie.indexOf('Bearer ') + 7))
        console.log(`✅ Found token in Authorization cookie`)
        return value
      }
    }

    console.log(`❌ Cookie not found: ${name}`)
    return undefined
  } catch (error) {
    console.error('Failed to get cookie:', error)
    return undefined
  }
}

export function setCookie(name: string, value: string, days = 7) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    const cookieValue = encodeURIComponent(value)
    document.cookie = `${name}=${cookieValue};${expires};path=/;samesite=lax`
    console.log(`✅ Set cookie '${name}'`)
  } catch (error) {
    console.error('Failed to set cookie:', error)
  }
}

export function removeCookie(name: string) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    if (name === 'token') {
      document.cookie = `Authorization=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    }
    console.log(`✅ Removed cookie '${name}'`)
  } catch (error) {
    console.error('Failed to remove cookie:', error)
  }
} 