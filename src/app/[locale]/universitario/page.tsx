import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { COMPETITIONS, competitionPath } from '@/lib/competitions';
import { TodayBoard } from '@/components/portal/today-board';
import { fetchRanking, type Ranking } from '@/lib/espn-rankings';
import { fetchToday, madridDateKey } from '@/lib/espn';
import { ncaaRanking, ncaaScoreboard, type NcaaGame } from '@/lib/ncaa-api';
import espanoles from '@/data/ncaa-espanoles.json';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

// ISR 10 min: marcadores del día y rankings semanales.
export const revalidate = 600;

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const NCAA = COMPETITIONS.filter((c) => c.secondary);
type Player = (typeof espanoles.basketballD1)[number];
const YEAR: Record<string, string> = { Fr: '1.º', So: '2.º', Jr: '3.º', Sr: '4.º', Gr: 'Posgrado', RS: 'Redshirt' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/universitario',
    title: 'Deporte universitario (NCAA): baloncesto, fútbol americano y españoles en EE. UU.',
    description: 'Baloncesto universitario masculino y femenino y fútbol americano de la NCAA: partidos de hoy, rankings AP y los deportistas españoles que juegan en universidades de EE. UU.',
    keywords: ['ncaa', 'deporte universitario', 'baloncesto universitario', 'fútbol americano universitario', 'españoles en la ncaa', 'march madness', 'ranking ap'],
    availableLocales: ['es'],
  });
}

function RankingTable({ r, title }: { r: Ranking; title: string }) {
  // Ranking de pretemporada: sin semana anterior, no se marcan «nuevos».
  const hasPrev = r.rows.some((x) => x.previous > 0);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <div className="kicker">{title}</div>
        <div className="mt-1 text-sm text-[var(--color-fg-muted)]">{r.headline}</div>
      </div>
      <ol className="divide-y divide-[var(--color-border)] text-sm">
        {r.rows.slice(0, 25).map((x) => {
          const move = x.previous ? x.previous - x.rank : 0;
          return (
            <li key={x.rank + x.team} className="grid grid-cols-[2rem_1.5rem_1fr_auto_3rem] items-center gap-2 px-4 py-2">
              <span className="font-display tab-num text-lg text-[var(--color-fg)]">{x.rank}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {x.logo ? <img src={x.logo} alt="" width={20} height={20} loading="lazy" /> : <span />}
              <span className="truncate font-semibold text-[var(--color-fg)]">{x.team}{x.firstPlace > 0 && <span className="ml-1 font-mono text-[10px] text-[var(--color-fg-subtle)]">({x.firstPlace})</span>}</span>
              <span className="font-mono text-xs text-[var(--color-fg-muted)]">{x.record}</span>
              <span className={`text-right font-mono text-[11px] ${move > 0 ? 'text-[var(--color-win)]' : move < 0 ? 'text-[var(--color-loss)]' : 'text-[var(--color-fg-subtle)]'}`}>{!hasPrev ? '' : !x.previous ? 'nuevo' : move > 0 ? `▲${move}` : move < 0 ? `▼${-move}` : '='}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** Partidos de hoy desde ncaa.com cuando ESPN no da nada (sin ficha: otros ids). */
function FallbackGames({ groups }: { groups: { label: string; games: NcaaGame[] }[] }) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="kicker">Hoy</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Partidos universitarios de hoy</h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {groups.map(({ label, games }) => (
          <div key={label}>
            <div className="sub-label mb-2">{label}</div>
            <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] text-sm">
              {games.slice(0, 15).map((g) => (
                <li key={g.id} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-4 py-2.5">
                  <span className={`font-mono text-[11px] ${g.state === 'live' ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>{g.state === 'pre' ? timeFmt.format(g.start) : g.state === 'live' ? `${g.period} ${g.clock}`.trim() : 'Final'}</span>
                  <span className="truncate text-[var(--color-fg)]">{g.away} <span className="text-[var(--color-fg-subtle)]">en</span> {g.home}</span>
                  <span className="font-display tab-num text-lg text-[var(--color-fg)]">{g.state === 'pre' ? '' : `${g.awayScore}-${g.homeScore}`}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-[var(--color-fg-subtle)]">Datos de ncaa.com · hora peninsular</p>
    </section>
  );
}

function PlayersTable({ list, caption }: { list: Player[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
          <tr className="border-b border-[var(--color-border)]"><th className="px-3 py-2 text-left">Jugador</th><th className="px-2 py-2 text-left">Universidad</th><th className="hidden px-2 py-2 text-left md:table-cell">Conferencia</th><th className="px-2 py-2 text-left">Pos.</th><th className="hidden px-2 py-2 text-left sm:table-cell">Curso</th><th className="hidden px-3 py-2 text-left sm:table-cell">De</th></tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.name + p.school} className="border-b border-[var(--color-border)] last:border-0">
              <td className="px-3 py-2 font-semibold text-[var(--color-fg)]">{p.name}</td>
              <td className="px-2 py-2">{p.school}</td>
              <td className="hidden px-2 py-2 text-[var(--color-fg-muted)] md:table-cell">{p.conference.replace(' Conference', '')}</td>
              <td className="px-2 py-2 font-mono text-xs">{p.pos}</td>
              <td className="hidden px-2 py-2 text-[var(--color-fg-muted)] sm:table-cell">{YEAR[p.year] ?? p.year}</td>
              <td className="hidden px-3 py-2 text-[var(--color-fg-muted)] sm:table-cell">{p.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function UniversitarioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;
  // ESPN primero; si falla o viene vacío, respaldo de ncaa.com (ncaa-api.henrygd.me).
  const [football, basket, espnToday] = await Promise.all([
    fetchRanking('football', 'college-football').then((r) => r ?? ncaaRanking('football/fbs')),
    fetchRanking('basketball', 'mens-college-basketball').then((r) => r ?? ncaaRanking('basketball-men/d1')),
    fetchToday(NCAA),
  ]);
  const today = madridDateKey();
  const fallbackGames: { label: string; games: NcaaGame[] }[] = espnToday.length > 0 ? [] : (await Promise.all(
    ([['Fútbol americano', 'football/fbs'], ['Baloncesto masculino', 'basketball-men/d1'], ['Baloncesto femenino', 'basketball-women/d1']] as const).map(async ([label, sport]) => ({
      label,
      games: (await ncaaScoreboard(sport)).filter((g) => madridDateKey(g.start) === today),
    })),
  )).filter((x) => x.games.length > 0);
  const men = espanoles.basketballD1.filter((p) => p.gender === 'M');
  const women = espanoles.basketballD1.filter((p) => p.gender === 'F');
  const maxSport = espanoles.bySport[0]?.n ?? 1;

  return (
    <main className="pt-28">
      <JsonLd data={breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Deporte universitario', path: '/universitario' }])} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="kicker">NCAA · Estados Unidos</div>
        <h1 className="t-h1 mt-4 text-[var(--color-fg)]">Deporte universitario</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
          Baloncesto masculino y femenino y fútbol americano de la NCAA: partidos de hoy, rankings y los españoles que compiten en universidades de Estados Unidos.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Competiciones universitarias">
          {NCAA.map((c) => (
            <Link key={c.slug} href={withLocale(L, competitionPath(c))} data-sport={c.sport} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">{c.name} →</Link>
          ))}
        </nav>
      </header>

      {fallbackGames.length > 0 ? (
        <FallbackGames groups={fallbackGames} />
      ) : (
        <TodayBoard locale={L} competitions={NCAA} range="today" kicker="Hoy" title="Partidos universitarios de hoy" emptyText="Hoy no hay partidos universitarios en estas competiciones." limitPerGroup={12} />
      )}

      {(football || basket) && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
          <h2 className="t-h2 text-[var(--color-fg)]">Rankings</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {football && <RankingTable r={football} title="Fútbol americano · AP Top 25" />}
            {basket && <RankingTable r={basket} title="Baloncesto masculino · AP Top 25" />}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
        <div className="kicker">Temporada {espanoles.season}</div>
        <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Los españoles de la NCAA</h2>
        <p className="mt-3 max-w-2xl text-[var(--color-fg-muted)]">
          {espanoles.people.toLocaleString('es-ES')} deportistas nacidos o criados en España aparecían en las plantillas universitarias de la temporada {espanoles.season}, en todas las divisiones. Fútbol y tenis son los deportes con más.
        </p>
        <ul className="mt-6 grid max-w-3xl gap-2">
          {espanoles.bySport.slice(0, 10).map((x) => (
            <li key={x.sport} className="grid grid-cols-[11rem_1fr_3rem] items-center gap-3 text-sm">
              <span className="truncate text-[var(--color-fg)]">{x.sport}</span>
              <span className="h-2.5 rounded-full bg-[var(--accent)]" style={{ width: `${(x.n / maxSport) * 100}%` }} />
              <span className="font-mono tab-num text-right text-[var(--color-fg-muted)]">{x.n}</span>
            </li>
          ))}
        </ul>

        <h3 className="t-h3 mt-12 text-[var(--color-fg)]">Baloncesto masculino, División I ({men.length})</h3>
        <div className="mt-4"><PlayersTable list={men} caption="Jugadores españoles en baloncesto masculino NCAA División I" /></div>

        <details className="mt-10">
          <summary className="cursor-pointer t-h3 text-[var(--color-fg)]">Baloncesto femenino, División I ({women.length})</summary>
          <div className="mt-4"><PlayersTable list={women} caption="Jugadoras españolas en baloncesto femenino NCAA División I" /></div>
        </details>

        <p className="mt-8 max-w-3xl font-mono text-[11px] leading-relaxed text-[var(--color-fg-subtle)]">
          Fuente: <a href="https://huggingface.co/datasets/dharits3/ncaa-college-athlete-rosters-2025-26" rel="nofollow noopener" target="_blank" className="underline">NCAA All-Sports Rosters 2025-26</a> (CC0), recopilado de las plantillas oficiales de cada universidad. Son las plantillas de la temporada {espanoles.season}: las de 2026-27 pueden haber cambiado. Un deportista que compite en atletismo en pista cubierta y al aire libre cuenta en los dos.
        </p>
      </section>
    </main>
  );
}
