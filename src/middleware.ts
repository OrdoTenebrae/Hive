import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1]
  console.log("🔍 Middleware checking token:", !!token)

  if (!token) {
    console.log("❌ No token found in middleware")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    const verified = await jwtVerify(token, secret)
    console.log("✅ Token verified successfully")
    return NextResponse.next()
  } catch (error) {
    console.log("❌ Token verification failed")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/api/projects/:path*",
    "/api/tasks/:path*"
  ]
} 