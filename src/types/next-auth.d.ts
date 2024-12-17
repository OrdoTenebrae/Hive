import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: Role
    email: string
    name?: string | null
    image?: string | null
  }

  interface Session {
    user: User & {
      id: string
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    email: string
    name?: string | null
    image?: string | null
  }
}
