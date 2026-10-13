import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchSeason, currentMatchday, matchdayRange } from '@/lib/season';
import { getWostiIndex } from '@/lib/wosti';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { MatchdayList } from '@/components/portal/matchday-list';
import { resolveCompetition, compBase, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  return pageMetadata({
    locale, path: `${compBase(c)}/calendario`,
    title: `Calendario ${c.shortName ?? c.name}: todas las jornadas, fechas y horarios`,
    description: `Calendario completo de ${c.name} jornada a jornada: fechas, horarios en hora española, canal de televisión y resultados de los partidos ya jugados.`,
    keywords: [`calendario ${c.name}`, `${c.name} calendario`, `jornadas ${c.name}`, `fechas ${c.name}`, `horarios ${c.name}`],
    noIndex: !c.espn,
  });
}

export default async function CompetitionCalendarPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const [season, wosti] = await Promise.all([fetchSeason(c), c.sport === 'futbol' ? getWostiIndex() : Promise.resolve(new Map())]);
  const mds = season.matchdays;
  const cur = currentMatchday(mds);
  const upcoming = mds.filter((m) => !cur || m.n >= cur.n);
  const past = mds.filter((m) => cur && m.n < cur.n).reverse();

  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="calendario" title={`Calendario de ${c.shortName ?? c.name}`} description={`${season.name ? `${season.name}. ` : ''}${mds.length} ${c.sport === 'futbol' ? (c.kind === 'liga' ? 'jornadas' : 'rondas') : 'semanas'} y ${season.matches.length} partidos, con horario en hora española y canal de televisión.`} />

      {mds.length === 0 ? (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10"><div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-[var(--color-fg-muted)]">Todavía no hay calendario publicado para {c.name}.</div></section>
      ) : (
        <>
          <nav className="mx-auto mt-8 w-full max-w-[1400px] px-6 md:px-10" aria-label="Ir a jornada">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-2">
              {mds.map((m) => (
                <a key={m.slug} href={`#${m.slug}`} className={`inline-flex h-8 shrink-0 items-center rounded-full border px-3 font-mono text-[11px] tab-num ${m.slug === cur?.slug ? 'border-transparent bg-[var(--accent)] font-semibold text-[var(--color-bg)]' : m.pending === 0 ? 'border-[var(--color-border)] text-[var(--color-fg-subtle)]' : 'border-[var(--color-border-strong)] text-[var(--color-fg-muted)]'}`} title={matchdayRange(m)}>
                  {m.n}
                </a>
              ))}
            </div>
          </nav>

          <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
            <div className="kicker">Próximas</div>
            <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{cur ? `${cur.label} y siguientes` : 'Calendario'}</h2>
            <div className="mt-6 grid gap-5">
              {upcoming.map((m) => <MatchdayList key={m.slug} comp={c} md={m} locale={L} wosti={wosti} href={m.played > 0 ? `${compBase(c)}/resultados/${m.slug}` : undefined} />)}
            </div>
          </section>

          {past.length > 0 && (
            <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
              <div className="kicker">Jugadas</div>
              <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Jornadas anteriores</h2>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">Resultados completos en <Link href={withLocale(L, `${compBase(c)}/resultados`)} className="text-[var(--accent-ink)] underline underline-offset-4">resultados por jornada</Link>.</p>
              <div className="mt-6 grid gap-5">
                {past.map((m) => <MatchdayList key={m.slug} comp={c} md={m} locale={L} wosti={wosti} href={`${compBase(c)}/resultados/${m.slug}`} />)}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
