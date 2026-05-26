import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/porra/predicciones',
    title: 'Mis predicciones · Porra Mundial 2026',
    description: 'Apunta tu pronóstico inicial y los marcadores de cada partido.',
    noIndex: true,
  });
}

export default async function PredictionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/porra/login?next=${encodeURIComponent(`/${locale}/porra/predicciones`)}`);

  const { data: profile } = await supabase
    .from('porra_users')
    .select('display_name, slug, total_points')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Tus predicciones</h1>
        <form action="/auth/signout" method="post">
          <button className="text-xs text-[var(--color-fg-muted)] underline" type="submit">
            Cerrar sesión
          </button>
        </form>
      </header>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
        Hola, <strong className="text-[var(--color-fg)]">{profile?.display_name ?? user.email}</strong>.
        Tienes <strong className="text-[var(--color-fg)]">{profile?.total_points ?? 0}</strong> puntos.
      </p>
      <section className="mt-12 rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-fg-muted)]">
        Pronto: formulario de pronóstico inicial (campeón, subcampeón, tercero, Bota de Oro).
      </section>
    </main>
  );
}
