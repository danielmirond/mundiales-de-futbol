import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchLeaders, type Leader } from '@/lib/leaders';
import { Crest } from '@/components/portal/crest';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { resolveCompetition, compBase, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 1800;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  return pageMetadata({
    locale, path: `${compBase(c)}/goleadores`,
    title: `Goleadores ${c.shortName ?? c.name}: máximos goleadores y asistentes de la temporada`,
    description: `Tabla de máximos goleadores de ${c.name} actualizada tras cada jornada, con partidos jugados y equipo, y la clasificación de asistentes.`,
    keywords: [`goleadores ${c.name}`, `máximo goleador ${c.name}`, `pichichi ${c.name}`, `asistentes ${c.name}`, `${c.name} goleadores`],
    noIndex: !c.espn || c.sport !== 'futbol',
  });
}

function LeaderTable({ rows, unit, comp, locale }: { rows: Leader[]; unit: string; comp: { sport: string; slug: string }; locale: Locale }) {
  return (
    <div className="overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
      <table className="w-full border-collapse text-sm">
        <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="w-11 px-2 py-3 text-center font-medium">#</th><th className="px-2 py-3 text-left font-medium">Jugador</th><th className="px-2 py-3 text-left font-medium">Equipo</th><th className="px-2 py-3 text-center font-medium">PJ</th><th className="px-2 py-3 text-center font-medium">{unit}</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.athleteId} className="border-t border-[var(--color-border)]">
              <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{r.rank}</td>
              <td className="h-11 px-2 font-medium text-[var(--color-fg)]">{r.name}</td>
              <td className="h-11 px-2 text-[var(--color-fg-muted)]">
                {r.team ? <Link href={withLocale(locale, `/${comp.sport}/${comp.slug}/equipo/${r.team.slug}`)} className="flex items-center gap-2 hover:text-[var(--accent-ink)]"><Crest src={r.team.logo} abbr={r.team.abbr} size="s" /><span className="truncate">{r.team.name}</span></Link> : '—'}
              </td>
              <td className="h-11 px-2 text-center tab-num text-[var(--color-fg-muted)]">{r.matches ?? '–'}</td>
              <td className="h-11 px-2 text-center text-[15px] font-semibold tab-num text-[var(--color-fg)]">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function CompetitionScorersPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const leaders = await fetchLeaders(c, 30);
  const top = leaders.goals[0];
  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="goleadores" title={`Goleadores de ${c.shortName ?? c.name}`} description={top ? `${leaders.season ?? 'Temporada en curso'}. Máximo goleador: ${top.name}${top.team ? ` (${top.team.name})` : ''}, con ${top.value} ${top.value === 1 ? 'gol' : 'goles'} en ${top.matches ?? '–'} partidos.` : `Todavía no hay goles registrados en ${c.name} esta temporada.`} />
      {leaders.goals.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div><div className="kicker">Goles</div><h2 className="t-h2 mt-3 text-[var(--color-fg)]">Máximos goleadores</h2><div className="mt-5"><LeaderTable rows={leaders.goals} unit="Goles" comp={c} locale={L} /></div></div>
            <div><div className="kicker">Asistencias</div><h2 className="t-h2 mt-3 text-[var(--color-fg)]">Máximos asistentes</h2><div className="mt-5"><LeaderTable rows={leaders.assists} unit="Asist." comp={c} locale={L} /></div></div>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: ESPN · actualizado tras cada jornada</p>
        </section>
      )}
    </main>
  );
}
