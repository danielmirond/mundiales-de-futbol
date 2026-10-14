import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { StandingsTable } from '@/components/portal/standings-table';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { resolveCompetition, compBase } from '@/lib/competition-page';
import { ZONES } from '@/lib/standings-zones';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 600;
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  return pageMetadata({
    locale, path: `${compBase(c)}/clasificacion`,
    title: `Clasificación ${c.shortName ?? c.name}: tabla actualizada, puntos y zonas`,
    description: `Clasificación de ${c.name} actualizada tras cada partido: puntos, partidos jugados, goles y diferencia, con las zonas europeas y de descenso señaladas.`,
    keywords: [`clasificación ${c.name}`, `${c.name} clasificación`, `tabla ${c.name}`, `puntos ${c.name}`],
    noIndex: !c.espn || !c.hasStandings,
  });
}

export default async function CompetitionStandingsPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const zones = ZONES[c.slug] ?? [];
  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="clasificacion" title={`Clasificación de ${c.shortName ?? c.name}`} description={zones.length ? `Tabla actualizada tras cada partido. Zonas: ${zones.map((z) => `${z.label} (${z.range[0] === z.range[1] ? z.range[0] : `${z.range[0]}-${z.range[1]}`})`).join(', ')}.` : 'Tabla actualizada tras cada partido.'} />
      {c.hasStandings ? <StandingsTable comp={c} locale={L} title={`Tabla de ${c.shortName ?? c.name}`} /> : (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10"><div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-[var(--color-fg-muted)]">{c.name} se juega por eliminatorias: no tiene clasificación.</div></section>
      )}
    </main>
  );
}
