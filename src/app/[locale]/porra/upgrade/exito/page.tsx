import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/porra/upgrade/exito',
    title: '¡Pase Mundial 2026 activado!',
    description: 'Tu Pase Mundial 2026 Premium está activo. Ya puedes hacer predicciones por partido.',
    noIndex: true,
  });
}

export default async function PorraUpgradeSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale as Locale);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle2 className="h-16 w-16 text-[var(--color-pitch)]" />
      <h1 className="mt-6 text-3xl font-semibold">¡Pase activado!</h1>
      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
        Tu Pase Mundial 2026 Premium está confirmado. Ya tienes acceso a predicciones por partido,
        ligas privadas ilimitadas y estadísticas avanzadas durante todo el torneo.
      </p>
      <Link
        href={`/${locale}/porra/predicciones`}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-medium text-black hover:bg-[var(--color-pitch)]/90"
      >
        Ir a predicciones <ArrowRight className="h-4 w-4" />
      </Link>
      {sp.session_id ? (
        <p className="mt-8 text-[11px] text-[var(--color-fg-muted)]">
          Recibo enviado a tu email. Referencia: {sp.session_id.slice(0, 20)}…
        </p>
      ) : null}
    </main>
  );
}
