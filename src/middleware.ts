import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Las noticias solo existen en español: las copias /en|pt|fr|ar/noticias/…
  // (texto en español con la interfaz traducida) redirigen a la original.
  const news = request.nextUrl.pathname.match(/^\/(?:en|pt|fr|ar)(\/noticias(?:\/.*)?)$/);
  if (news) {
    const url = request.nextUrl.clone();
    url.pathname = news[1];
    return NextResponse.redirect(url, 301);
  }
  const response = intlMiddleware(request) ?? NextResponse.next();
  // Solo se indexa la edición en español (2026-11-01): /en, /pt, /fr y /ar siguen
  // accesibles, pero fuera del índice y sin enlaces ni hreflang que apunten a ellas.
  if (/^\/(en|pt|fr|ar)(\/|$)/.test(request.nextUrl.pathname)) response.headers.set('X-Robots-Tag', 'noindex, follow');
  return updateSession(request, response);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|brand|.*\\..*).*)'],
};
