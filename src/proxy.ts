import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // 1. Definir rotas públicas (Login, Registro, Home aberta)
  const isPublicRoute = ["/login", "/register", "/"].includes(nextUrl.pathname)

  // 2. Se não estiver logado e tentar acessar qualquer rota que NÃO seja pública...
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return // Deixa passar
})

export const config = {
  // Esse regex ignora arquivos estáticos (imagem, favicon) e a API interna do Next
  // Mas captura TODAS as outras rotas do seu app automaticamente
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}