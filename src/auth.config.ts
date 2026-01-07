import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
  providers: [
    Credentials({
        // Deixe vazio ou apenas com a estrutura básica, 
        // a lógica pesada vai ficar no outro arquivo
    }),
  ],
} satisfies NextAuthConfig