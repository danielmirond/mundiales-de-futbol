import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handles the magic-link redirect from Supabase Auth.
 * Exchanges the code for a session, ensures a porra_users row exists,
 * then redirects to `next` (default `/porra/predicciones`).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/es/porra/predicciones';

  if (!code) {
    return NextResponse.redirect(`${origin}/es/porra/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/es/porra/login?error=${encodeURIComponent(error.message)}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // Upsert profile if missing.
    const { data: existing } = await supabase
      .from('porra_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existing) {
      const baseName = (user.user_metadata?.display_name as string | undefined)
        || user.email?.split('@')[0]
        || `jugador-${user.id.slice(0, 6)}`;
      const slug = baseName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 32) || `jugador-${user.id.slice(0, 6)}`;

      // Suffix slug with short uid fragment to avoid collisions.
      const uniqueSlug = `${slug}-${user.id.slice(0, 4)}`;
      await supabase.from('porra_users').insert({
        user_id: user.id,
        display_name: baseName,
        slug: uniqueSlug,
      });
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
