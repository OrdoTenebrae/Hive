import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  // Skip auth check for auth-related endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('Authorization') || request.cookies.get('Authorization')?.value
  
  if (!authHeader) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const token = authHeader.split('Bearer ')[1]
    const verified = await jwtVerify(token, secret)
    const response = NextResponse.next()
    response.headers.set('Authorization', `Bearer ${token}`)
    return response
  } catch (error) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/projects/:path*',
    '/team/:path*',
    '/settings/:path*',
  ]
} 