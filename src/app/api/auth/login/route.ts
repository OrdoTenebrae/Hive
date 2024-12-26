import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"
import { signJwt } from "@/lib/auth"

export async function POST(req: Request) {
  console.log("\n=== Login API Start ===")
  
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not configured")
    console.log("=== Login API End (Error) ===\n")
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    )
  }
  
  try {
    const { email, password } = await req.json()
    console.log("📧 Login attempt for email:", email)

    const user = await prisma.user.findUnique({
      where: { email }
    })
    console.log("🔍 User found:", !!user)

    if (!user) {
      console.log("❌ User not found")
      console.log("=== Login API End (Error) ===\n")
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      )
    }

    const isPasswordValid = await compare(password, user.password)
    console.log("🔐 Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      console.log("=== Login API End (Error) ===\n")
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      )
    }

    const token = await signJwt({
      id: user.id,
      email: user.email,
      role: user.role
    })
    console.log("✅ JWT signed successfully")
    console.log("🔑 Token preview:", token.substring(0, 20) + "...")

    console.log("=== Login API End ===\n")
    
    // Create response with user data and token
    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    // Set cookies
    response.cookies.set('token', token, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    // Also set Authorization header cookie for API requests
    response.cookies.set('Authorization', `Bearer ${token}`, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    // Set Authorization header
    response.headers.set('Authorization', `Bearer ${token}`)

    console.log("✅ Set cookies and headers:", {
      token: token.substring(0, 20) + "...",
      cookies: response.cookies.getAll(),
      headers: response.headers.get('Authorization')
    })

    return response
  } catch (error) {
    console.error("❌ Login API error:", error)
    console.log("=== Login API End (Error) ===\n")
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 400 }
    )
  }
}