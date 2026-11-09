import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Solo existe la edición en español (2026-11-09): toda URL /en|pt|fr|ar/…
  // redirige con 301 a su equivalente sin prefijo. Google sustituye las copias
  // por la URL española en vez de esperar a leer el noindex de cada una.
  const loc = request.nextUrl.pathname.match(/^\/(?:en|pt|fr|ar)(\/.*)?$/);
  if (loc) {
    const url = request.nextUrl.clone();
    url.pathname = loc[1] || '/';
    return NextResponse.redirect(url, 301);
  }
  const response = intlMiddleware(request) ?? NextResponse.next();
  return updateSession(request, response);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|brand|.*\\..*).*)'],
};
