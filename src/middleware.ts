// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Obtemos a role do token (Certifique-se que o callback do NextAuth está passando isso)
  const role = token?.role; 

  // ==============================================================
  // ZONA DO GESTOR (/gestor)
  // ==============================================================
  if (pathname.startsWith('/gestor')) {
    const isLoginPage = pathname === '/gestor/login';

    // CASO A: USUÁRIO ESTÁ LOGADO
    if (token) {
      
      // 1. Se tentar acessar o login estando logado, manda pro Dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/gestor', req.url));
      }

      // 2. REGRA DE PERMISSÃO ESPECÍFICA (Notificações)
      // Apenas DEVELOPER pode acessar a pasta de notificações
      if (pathname.startsWith('/gestor/notification')) {
        if (role !== 'DEVELOPER') {
          // Se for ADMIN ou EMPLOYEE tentando entrar, manda de volta pro dashboard
          return NextResponse.redirect(new URL('/gestor', req.url));
        }
      }

      // Permite o acesso às demais rotas protegidas
      return NextResponse.next();
    }

    // CASO B: USUÁRIO NÃO ESTÁ LOGADO
    else {
      // Se for a página de login, deixa passar
      if (isLoginPage) {
        return NextResponse.next();
      }
      
      // Qualquer outra página interna, manda pro login
      return NextResponse.redirect(new URL('/gestor/login', req.url));
    }
  }

  // Permite acesso a qualquer outra rota que não comece com /gestor (ex: home pública, api, etc)
  return NextResponse.next();
}

export const config = {
  // O matcher agora só precisa observar as rotas de gestor
  matcher: [
    '/gestor/:path*',
  ],
};