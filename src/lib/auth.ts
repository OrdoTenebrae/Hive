import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signJwt(payload: { id: string; email: string; role: string }) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secret)
    
    const cookieStore = await cookies()
    console.log("🔐 Attempting to set cookie in signJwt")
    
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })
    
    console.log("✅ Cookie set in signJwt")
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
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  if (!token) return null
  
  try {
    const verified = await jwtVerify(token.value, secret)
    const payload = verified.payload as unknown as JWTPayload
    return payload
  } catch {
    return null
  }
}
