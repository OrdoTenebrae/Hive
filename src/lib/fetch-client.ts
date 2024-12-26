import { getCookie } from "./cookies"

interface FetchOptions extends RequestInit {
  body?: any
}

let unauthorizedCount = 0
const MAX_UNAUTHORIZED_ATTEMPTS = 3

export async function fetchClient(url: string, options: FetchOptions = {}) {
  // Get token from cookie
  const token = getCookie('token')
  
  console.log('🔑 Cookie Debug:', {
    allCookies: document.cookie,
    tokenFound: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  })
  
  console.log('🔑 Token status:', token ? 'Present' : 'Missing')
  console.log('📡 Fetching:', url)

  // Prepare headers
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (options.body && typeof options.body === 'object') {
    headers.set('Content-Type', 'application/json')
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
    body: options.body && typeof options.body === 'object' 
      ? JSON.stringify(options.body) 
      : options.body
  }

  try {
    console.log('⚡ Request details:', {
      url,
      method: options.method || 'GET',
      headers: Object.fromEntries(headers.entries()),
      credentials: requestOptions.credentials
    })

    const response = await fetch(url, requestOptions)
    console.log('📥 Response details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    })
    
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`
      let errorData: { error?: string } = {}
      let responseText = ''
      
      try {
        responseText = await response.text()
        try {
          errorData = JSON.parse(responseText)
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (parseError) {
          console.warn('Response is not JSON:', responseText)
        }
      } catch (e) {
        console.warn('Failed to read response:', e)
      }

      console.error('❌ Request failed:', {
        url,
        method: options.method || 'GET',
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        details: errorData,
        rawResponse: responseText,
        requestHeaders: Object.fromEntries(headers.entries()),
        responseHeaders: Object.fromEntries(response.headers.entries())
      })

      if (response.status === 401) {
        unauthorizedCount++
        console.warn(`⚠️ Unauthorized request (${unauthorizedCount}/${MAX_UNAUTHORIZED_ATTEMPTS}):`, {
          url,
          token: token ? 'present' : 'missing',
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
        })
        
        if (unauthorizedCount >= MAX_UNAUTHORIZED_ATTEMPTS) {
          console.error('🚫 Max unauthorized attempts reached')
          // Don't redirect immediately, try to refresh the token first
          try {
            console.log('🔄 Attempting token refresh...')
            const refreshResponse = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include'
            })
            
            if (refreshResponse.ok) {
              console.log('✅ Token refreshed successfully')
              unauthorizedCount = 0
              // Retry the original request
              return fetchClient(url, options)
            } else {
              console.error('❌ Token refresh failed:', {
                status: refreshResponse.status,
                statusText: refreshResponse.statusText,
                response: await refreshResponse.text()
              })
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError)
          }

          // Only redirect if refresh failed and we're not already on an auth page
          if (!window.location.pathname.startsWith('/auth/')) {
            console.log('🔄 Redirecting to login...')
            window.location.href = '/auth/login'
          }
        }
      }

      throw new Error(errorMessage)
    }

    // Reset unauthorized count on successful request
    unauthorizedCount = 0
    const data = await response.json()
    console.log('✅ Request successful:', { 
      url, 
      status: response.status,
      dataPreview: JSON.stringify(data).slice(0, 100) + '...',
      headers: Object.fromEntries(response.headers.entries())
    })
    return data
  } catch (error) {
    console.error('❌ Request failed:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
} 