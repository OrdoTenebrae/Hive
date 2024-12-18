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
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error("❌ Login API error:", error)
    console.log("=== Login API End (Error) ===\n")
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 400 }
    )
  }
}