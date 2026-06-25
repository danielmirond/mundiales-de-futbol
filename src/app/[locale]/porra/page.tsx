import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/porra',
    title: 'Porra Mundial 2026 · Pronósticos gratis y ranking público',
    description:
      'Apunta tu pronóstico del Mundial 2026: campeón, máximo goleador, resultado de cada partido. Crea tu liga privada con amigos. Sin premio monetario, gratis.',
    keywords: [
      'porra Mundial 2026',
      'pronósticos Mundial',
      'porra gratis',
      'liga amigos Mundial',
      'campeón Mundial 2026 pronóstico',
    ],
  });
}

export default async function PorraLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Mundial 2026 · 11 jun – 19 jul
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Porra Mundial 2026
        </h1>
        <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
          Apunta tu pronóstico, mide la puntería contra tus amigos. Cero coste, cero premios en metálico.
          Pura gloria.
        </p>
      </header>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        <Card title="Pronóstico inicial" body="Campeón, subcampeón, tercero y Bota de Oro. Hasta el 11-jun a las 18:00 (Madrid)." />
        <Card title="Partido a partido" body="Predice el marcador de los 104 partidos. Aciertas resultado 1X2 → 1 punto. Aciertas marcador exacto → 3 puntos." />
        <Card title="Liga privada" body="Crea una liga con un código de 6 letras y comparte con tus amigos. Ranking aparte del global." />
      </section>

      <section className="mt-16 flex flex-col items-center gap-3">
        {user ? (
          <>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Sesión iniciada como <span className="text-[var(--color-fg)]">{user.email}</span>
            </p>
            <Button asChild size="lg">
              <Link href={`/${locale}/porra/predicciones`}>Ir a mis predicciones</Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href={`/${locale}/porra/login`}>Regístrate gratis</Link>
            </Button>
            <p className="text-xs text-[var(--color-fg-muted)]">
              Solo email. Recibirás un enlace mágico para entrar sin contraseña.
            </p>
          </>
        )}
      </section>

      <section className="mt-20 text-sm text-[var(--color-fg-muted)]">
        <h2 className="text-base font-semibold text-[var(--color-fg)]">Cómo funciona el ranking</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li><strong className="text-[var(--color-fg)]">Resultado 1X2</strong>: 1 punto si aciertas quién gana o si predices empate y termina en empate.</li>
          <li><strong className="text-[var(--color-fg)]">Marcador exacto</strong>: 3 puntos (incluye el punto del 1X2).</li>
          <li><strong className="text-[var(--color-fg)]">Eliminatorias</strong>: si aciertas quién pasa de ronda, +2 puntos extra.</li>
          <li><strong className="text-[var(--color-fg)]">Campeón</strong>: 25 puntos. <strong className="text-[var(--color-fg)]">Subcampeón</strong>: 12. <strong className="text-[var(--color-fg)]">Tercero</strong>: 6.</li>
          <li><strong className="text-[var(--color-fg)]">Bota de Oro</strong>: 15 puntos al máximo goleador del torneo.</li>
        </ul>
      </section>
    </main>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{body}</p>
    </div>
  );
}
