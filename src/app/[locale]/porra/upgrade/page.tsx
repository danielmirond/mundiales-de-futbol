import Link from 'next/link';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Check, Trophy, Users, BarChart3, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { pageMetadata } from '@/lib/seo';
import { UpgradeButton } from './upgrade-button';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/porra/upgrade',
    title: 'Pase Mundial 2026 · Porra Premium 2,99€',
    description:
      'Acceso completo a la porra del Mundial 2026 por 2,99€: predicciones por partido, ligas privadas ilimitadas, estadísticas avanzadas. Pago único, sin renovaciones.',
    noIndex: true,
  });
}

export default async function PorraUpgradePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Require login first
  if (!user) {
    redirect(`/${locale}/porra/login?next=${encodeURIComponent(`/${locale}/porra/upgrade`)}`);
  }

  const { data: profile } = await supabase
    .from('porra_users')
    .select('has_premium, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  // If already premium, send to predicciones
  if (profile?.has_premium) {
    redirect(`/${locale}/porra/predicciones`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Pase Mundial 2026
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Porra Premium por <span className="text-[var(--color-pitch)]">2,99€</span>
        </h1>
        <p className="mt-4 text-base text-[var(--color-fg-muted)]">
          Pago único, válido todo el Mundial. Sin renovaciones, sin tarjeta guardada.
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <Feature
          icon={<Zap className="h-5 w-5" />}
          title="Predicciones por partido"
          body="Acierta el resultado de los 104 partidos del Mundial. 1 punto por 1X2, 3 puntos por marcador exacto."
        />
        <Feature
          icon={<Users className="h-5 w-5" />}
          title="Ligas privadas ilimitadas"
          body="Crea tu liga con amigos, compañeros de trabajo o familia. Código de 6 caracteres para invitar."
        />
        <Feature
          icon={<BarChart3 className="h-5 w-5" />}
          title="Estadísticas avanzadas"
          body="Acierto por fase, ranking por equipo predicho, comparativa con la media global."
        />
        <Feature
          icon={<Trophy className="h-5 w-5" />}
          title="Bracket personalizado"
          body="Construye tu cuadro completo de eliminatorias y compite por aciertos hasta la final."
        />
      </section>

      <section className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
        <p className="text-sm text-[var(--color-fg-muted)]">
          Hola <strong className="text-[var(--color-fg)]">{profile?.display_name ?? user.email}</strong>,
          tu pronóstico inicial está guardado en versión gratuita. Desbloquea predicciones por partido:
        </p>
        <div className="mt-6 flex justify-center">
          <UpgradeButton locale={locale} />
        </div>
        <p className="mt-4 text-[11px] text-[var(--color-fg-muted)]">
          Pago seguro vía Stripe. IVA incluido. Sin renovaciones automáticas.
        </p>
      </section>

      <section className="mt-12 space-y-4 text-sm text-[var(--color-fg-muted)]">
        <Detail label="¿Hay premio en dinero?">
          No. El Pase Mundial 2026 da acceso a funcionalidades del juego (predicciones por partido, ligas
          privadas, estadísticas). Es un servicio digital de entretenimiento, no un juego con premio
          monetario. El reconocimiento del ganador del leaderboard es público en el site.
        </Detail>
        <Detail label="¿Puedo cancelar?">
          Es un pago único, no hay suscripción que cancelar. Al ser un servicio digital de inicio
          inmediato, renuncias al derecho de desistimiento al confirmar la compra (art. 103.m TR-LGDCU).
          Si tienes problemas técnicos contacta a soporte para reembolso.
        </Detail>
        <Detail label="¿Hasta cuándo vale el Pase?">
          Durante todo el Mundial 2026 (11 jun – 19 jul 2026). Tras la final, el leaderboard queda
          archivado y accesible permanentemente.
        </Detail>
        <Detail label="¿Edad mínima?">
          16 años. Si eres menor, necesitas consentimiento de tu tutor legal.
        </Detail>
      </section>

      <p className="mt-12 text-center text-xs text-[var(--color-fg-muted)]">
        Al comprar aceptas los{' '}
        <Link href={`/${locale}/legal/terminos`} className="underline">
          Términos y Condiciones
        </Link>{' '}
        y la{' '}
        <Link href={`/${locale}/privacidad`} className="underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center gap-2 text-[var(--color-pitch)]">{icon}</div>
      <h2 className="mt-3 text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{body}</p>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <summary className="cursor-pointer text-sm font-medium text-[var(--color-fg)]">
        <Check className="mr-2 inline h-4 w-4 text-[var(--color-pitch)]" />
        {label}
      </summary>
      <p className="mt-3 pl-6 text-sm leading-relaxed">{children}</p>
    </details>
  );
}
