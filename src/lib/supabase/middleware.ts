import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refresh the Supabase auth session cookie on every request that touches
 * an authenticated surface. Must be called before the next-intl middleware
 * so cookies set here propagate to the final response.
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Sin Supabase configurado (p. ej. previews de Vercel o local sin .env) el
  // sitio público debe funcionar igual: no hay sesión que refrescar.
  if (!url || !key) return response;

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Triggers token refresh if expired.
    await supabase.auth.getUser();
  } catch {
    // Un fallo al refrescar la sesión nunca debe convertir la petición en un 500.
  }
  return response;
}
