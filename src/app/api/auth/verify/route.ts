import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("\n=== Verify Token API ===")
  const payload = await verifyJwt()
  
  if (!payload) {
    console.log("❌ Token verification failed")
    console.log("=== Verify Token API End ===\n")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("✅ Token verified for user:", payload.email)
  console.log("=== Verify Token API End ===\n")
  return NextResponse.json({ success: true, user: payload })
} 