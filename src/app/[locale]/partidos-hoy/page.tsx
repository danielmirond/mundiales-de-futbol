import { setRequestLocale } from 'next-intl/server';
import { liveCompetitions } from '@/lib/competitions';
import { TodayBoard } from '@/components/portal/today-board';
import { CompetitionsGrid } from '@/components/portal/competitions-grid';
import type { Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const dayFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/partidos-hoy',
    title: 'Partidos de hoy: fútbol, baloncesto y más, horarios y resultados en directo',
    description: 'Todos los partidos de hoy de LaLiga, Champions, Premier, NBA, Euroliga y el resto de competiciones: horarios en hora española y marcadores en directo. Se actualiza solo.',
    keywords: ['partidos de hoy', 'partidos hoy', 'qué partidos hay hoy', 'fútbol hoy', 'resultados de hoy', 'partidos nba hoy', 'partidos laliga hoy'],
  });
}

export default async function PartidosHoyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;
  return (
    <main className="pt-28">
      <JsonLd data={breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Partidos de hoy', path: '/partidos-hoy' }])} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="kicker">{dayFmt.format(new Date())}</div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">Partidos de hoy</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">Todos los partidos del día en las competiciones que seguimos, con horario en hora española y marcador en directo.</p>
      </header>
      <TodayBoard locale={L} competitions={liveCompetitions()} range="today" emptyText="Hoy no hay partidos en las competiciones que seguimos." />
      <CompetitionsGrid locale={L} kicker="Elige competición" title="Todas las competiciones" />
    </main>
  );
}
