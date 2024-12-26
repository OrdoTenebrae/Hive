import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import { JWTPayload as JoseJWTPayload } from 'jose'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

interface CustomJWTPayload extends JoseJWTPayload {
  id: string
  email: string
  name?: string
  role?: string
}

export async function verifyJwt(token: string): Promise<CustomJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as CustomJWTPayload
  } catch (error) {
    return null
  }
}

export async function verifyAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Unauthorized')
  }

  const payload = await verifyJwt(token)
  if (!payload || !payload.id) {
    throw new Error('Invalid token')
  }

  return { userId: payload.id }
}

export async function signJwt(payload: Omit<CustomJWTPayload, keyof JoseJWTPayload>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}
