import { JWTPayload } from "jose"

declare module "@/lib/auth" {
  interface CustomJWTPayload extends JWTPayload {
    sub: string
    email: string
    name: string
  }

  export function verifyJwt(token?: string): Promise<CustomJWTPayload | null>
} 