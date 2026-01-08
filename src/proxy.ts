import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const { auth: nextAuthHandler } = NextAuth(authConfig)

export default nextAuthHandler((req) => {
  const { nextUrl, cookies } = req
  
  // Pega a chave das variáveis de ambiente
  const MASTER_KEY = process.env.MASTER_KEY;

  // 1. Verifica se o cara já passou pela barreira antes (via cookie)
  const hasGlobalAccess = cookies.has("global-access-granted2");
  
  // 2. Verifica se ele está tentando passar a chave agora pela URL
  const urlKey = nextUrl.searchParams.get("key");

  // Se NÃO tem o cookie E NÃO mandou a chave certa... BARRA GERAL
  if (!hasGlobalAccess && urlKey !== MASTER_KEY) {
    return new NextResponse(
      `
      <div style="background-color: #0a0a0a; color: #ededed; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; border: 1px solid #333; border-radius: 12px;">
        <div style="border: 1px solid #333; padding: 40px; border-radius: 12px; text-align: center; background: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <h1 style="font-size: 2rem; margin-bottom: 10px;">🔒 Acesso Restrito</h1>
          <p style="color: #888; font-size: 1.1rem;">Este ambiente é privado e requer autorização.</p>
          <div style="margin-top: 20px; font-size: 1rem; color: #444;">Sistema <br/> <b>Nova Boa Vista</b></div>
        </div>
      </div>
      `,
      { status: 401, headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }

  // 3. Se ele acabou de mandar a chave certa via URL
  if (urlKey === MASTER_KEY) {
    // Cria a resposta redirecionando para a mesma página, mas limpa a URL (tira o ?key=...)
    const response = NextResponse.redirect(new URL(nextUrl.pathname, nextUrl));
    
    // Seta o cookie para ele não precisar da chave no próximo clique
    response.cookies.set("global-access-granted", "true", { 
      maxAge: 60 * 60 * 19, // 1 dia de validade
      httpOnly: true,
      path: '/', // Vale para o site todo
      sameSite: 'lax'
    });
    
    return response;
  }

  // ----------------------------------------------------------------
  // CAMADA DO NEXTAUTH (SÓ RODA SE PASSAR PELA CHAVE ACIMA)
  // ----------------------------------------------------------------
  const isLoggedIn = !!req.auth
  const isPublicRoute = ["/login", "/register", "/api/auth"].some(route => 
    nextUrl.pathname.startsWith(route)
  );

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}