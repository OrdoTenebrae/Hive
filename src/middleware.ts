import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  console.log("\n=== Middleware Start ===")
  console.log("🌐 Path:", request.nextUrl.pathname)

  // Skip auth check for public routes
  if (
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    console.log("✅ Public route, skipping auth check")
    console.log("=== Middleware End (Public) ===\n")
    return NextResponse.next()
  }

  // Get token from cookies or Authorization header
  const token = request.cookies.get('token')?.value || 
                request.cookies.get('Authorization')?.value?.replace('Bearer ', '') ||
                request.headers.get('Authorization')?.replace('Bearer ', '')

  console.log("🔍 Token check:", {
    cookieToken: request.cookies.get('token')?.value?.substring(0, 20),
    authCookie: request.cookies.get('Authorization')?.value?.substring(0, 20),
    authHeader: request.headers.get('Authorization')?.substring(0, 20)
  })

  if (!token) {
    console.log("❌ No token found, redirecting to login")
    console.log("=== Middleware End (No Token) ===\n")
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const verified = await verifyJwt(token)
    if (!verified) {
      throw new Error('Token verification failed')
    }
    console.log("✅ Token verified")
    console.log("=== Middleware End (Success) ===\n")
    return NextResponse.next()
  } catch (error) {
    console.log("❌ Token verification failed:", error)
    console.log("=== Middleware End (Invalid Token) ===\n")
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/projects/:path*',
    '/team/:path*',
    '/settings/:path*'
  ]
} 