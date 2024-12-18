import { SignJWT, jwtVerify } from 'jose'
import { headers } from 'next/headers'

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET)
console.log("🔑 JWT_SECRET configured:", process.env.JWT_SECRET?.substring(0, 4) + "...")

export async function signJwt(payload: { id: string; email: string; role: string }) {
  try {
    console.log("🔐 Attempting to sign JWT for:", payload.email)
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secret)
    console.log("✅ JWT signed successfully")
    return token
  } catch (error) {
    console.error("❌ Error in signJwt:", error)
    throw error
  }
}

interface JWTPayload {
  id: string
  email: string
  role: string
  name?: string
}

export async function verifyJwt(): Promise<JWTPayload | null> {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('Authorization')
    console.log("🔍 Verifying JWT with auth header:", !!authHeader)
    
    const token = authHeader?.split('Bearer ')[1]
    if (!token) {
      console.log("❌ No token found in auth header")
      return null
    }
    
    console.log("🔄 Attempting to verify token")
    const verified = await jwtVerify(token, secret)
    console.log("✅ Token verified successfully for:", verified.payload.email)
    return verified.payload as unknown as JWTPayload
  } catch (error) {
    console.error("❌ Token verification failed:", error)
    return null
  }
}
