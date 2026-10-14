import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { TodayBoard } from '@/components/portal/today-board';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { resolveCompetition, compBase } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 120;
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;
const dayFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' });

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  return pageMetadata({
    locale, path: `${compBase(c)}/partidos-hoy`,
    title: `Partidos de ${c.shortName ?? c.name} hoy: horarios, dónde ver y resultados en directo`,
    description: `Todos los partidos de ${c.name} de hoy con horario en hora española, canal de televisión y marcador en directo, más los de mañana.`,
    keywords: [`partidos ${c.name} hoy`, `${c.name} hoy`, `horarios ${c.name}`, `dónde ver ${c.name}`, `resultados ${c.name} hoy`],
    noIndex: !c.espn,
  });
}

export default async function CompetitionTodayPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="partidos-hoy" title={`Partidos de ${c.shortName ?? c.name} hoy`} description={`${dayFmt.format(new Date())}. Horarios en hora española, canal de televisión y marcador en directo.`} />
      <TodayBoard locale={L} competitions={[c]} range="today" kicker="Hoy" title="Partidos de hoy" emptyText={`Hoy no hay partidos de ${c.name}.`} />
      <TodayBoard locale={L} competitions={[c]} range={[1, 1]} kicker="Mañana" title="Partidos de mañana" emptyText={`Mañana no hay partidos de ${c.name}.`} />
      <TodayBoard locale={L} competitions={[c]} range={[2, 7]} kicker="Próximos días" title="Esta semana" emptyText="Sin más partidos esta semana." />
    </main>
  );
}
