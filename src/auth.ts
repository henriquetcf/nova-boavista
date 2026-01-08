import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma/prisma" // Você vai criar esse arquivo pra instanciar o Prisma
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Recomendado para performance
    maxAge: 2* 60 * 60, // 30 dias (tempo total)
    updateAge: 24 * 60 * 60, // Atualiza o cookie a cada 24h
  }, // Como vamos usar Credentials, precisamos de JWT
  pages: {
    signIn: "/login", // Nossa tela que ficou show!
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    // Adiciona o ID e Role ao Token da sessão
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      if (token.sub) {
        // Verifica no banco se o ID do token ainda existe
        const userExists = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true }
        });

        // Se o usuário foi deletado do banco, invalidamos o token returnando null
        if (!userExists) return null;
      }
      return token
    },
    // Passa os dados do Token para a Sessão acessível no Front
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      return session
    },
  },
})