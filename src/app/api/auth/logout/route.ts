import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()
  
  // Clear all auth cookies
  const response = NextResponse.json({ success: true })
  response.cookies.delete('token')
  response.cookies.delete('Authorization')
  
  return response
} 
