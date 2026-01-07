import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  // Use DefaultUser para garantir compatibilidade com o Adapter
  interface User extends DefaultUser {
    role?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string | null
  }
}