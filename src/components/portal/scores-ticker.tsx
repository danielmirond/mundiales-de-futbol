import Link from 'next/link';
import { fetchWindow, dayKeys, madridDateKey, type Match } from '@/lib/espn';
import { liveCompetitions } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const hourFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });

type Group = 'live' | 'today' | 'done' | 'tomorrow';
const GROUP_LABEL: Record<Group, string> = { live: 'En directo', today: 'Hoy', done: 'Resultados', tomorrow: 'Mañana' };

/** Minuto o periodo de un partido en juego, corto. */
function liveClock(m: Match) {
  if (m.statusName === 'STATUS_HALFTIME') return 'Descanso';
  if (m.competition.sport === 'baloncesto' && m.period) return `${m.period}.º ${m.clock ?? ''}`.trim();
  return m.clock ?? m.status;
}

/** Reparte los partidos en directo, hoy por jugar, resultados recientes (18 h) y mañana. */
function groupMatches(matches: Match[], rank: Map<string, number>): Record<Group, Match[]> {
  const today = madridDateKey();
  const tomorrow = dayKeys(1, 1)[0];
  const since = Date.now() - 18 * 3600_000;
  const byComp = (a: Match, b: Match) => (rank.get(a.competition.slug) ?? 99) - (rank.get(b.competition.slug) ?? 99) || a.date.localeCompare(b.date);

  const groups: Record<Group, Match[]> = { live: [], today: [], done: [], tomorrow: [] };
  for (const m of matches) {
    const day = madridDateKey(new Date(m.date));
    if (m.state === 'in') groups.live.push(m);
    else if (m.state === 'pre' && day === today) groups.today.push(m);
    else if (m.state === 'post' && Date.parse(m.date) >= since) groups.done.push(m);
    else if (m.state === 'pre' && day === tomorrow) groups.tomorrow.push(m);
  }
  groups.live.sort(byComp);
  groups.today.sort((a, b) => a.date.localeCompare(b.date) || byComp(a, b));
  groups.done.sort((a, b) => b.date.localeCompare(a.date));
  groups.tomorrow.sort((a, b) => a.date.localeCompare(b.date) || byComp(a, b));

  return groups;
}

/**
 * Carrusel de resultados y agenda para la cabecera de portada y noticias:
 * en directo primero, después lo que queda hoy por hora, los resultados de hoy
 * y anoche, y la agenda de mañana. Desliza en horizontal; cada tarjeta abre la ficha.
 */
export async function ScoresTicker({ locale, className = '' }: { locale: Locale; className?: string }) {
  const comps = liveCompetitions();
  const matches = await fetchWindow(comps, dayKeys(-1, 1), 120);
  const groups = groupMatches(matches, new Map(comps.map((c, i) => [c.slug, i])));

  // Tope por grupo para que la agenda de mañana no entierre lo de hoy.
  const order: [Group, number][] = [['live', 20], ['today', 16], ['done', 14], ['tomorrow', 10]];
  const shown = order.map(([g, max]) => [g, groups[g].slice(0, max)] as const).filter(([, ms]) => ms.length > 0);
  if (shown.length === 0) return null;

  return (
    <section aria-label="Resultados y agenda" className={`border-b border-[var(--color-border)] bg-[var(--color-bg-2)] ${className}`}>
      <div className="no-scrollbar mx-auto flex w-full max-w-[1400px] snap-x items-stretch gap-2 overflow-x-auto px-4 py-3 md:px-10">
        {shown.map(([g, ms]) => (
          <div key={g} className="flex shrink-0 items-stretch gap-2">
            <div className="flex w-[54px] shrink-0 snap-start items-center justify-center rounded-xl text-center font-mono text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-[var(--color-fg-muted)]">
              {g === 'live' ? <span className="inline-flex flex-col items-center gap-1 text-[var(--color-live-ink)]"><i className="pulse" />{GROUP_LABEL[g]}</span> : GROUP_LABEL[g]}
            </div>
            {ms.map((m) => {
              const href = withLocale(locale, `/${m.competition.sport}/${m.competition.slug}/partido/${m.id}`);
              const live = m.state === 'in';
              const post = m.state === 'post';
              const homeWin = post && m.home.score !== null && m.away.score !== null && m.home.score > m.away.score;
              const awayWin = post && m.home.score !== null && m.away.score !== null && m.away.score > m.home.score;
              const status = live ? liveClock(m) : post ? 'Final' : hourFmt.format(new Date(m.date));
              return (
                <Link
                  key={`${m.competition.slug}-${m.id}`}
                  href={href}
                  data-sport={m.competition.sport}
                  className="flex w-[176px] shrink-0 snap-start flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 transition-colors hover:border-[var(--accent)]"
                >
                  <span className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">
                    <span className="truncate text-[var(--accent-ink)]">{m.competition.name}</span>
                    <span className={`shrink-0 tab-num ${live ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-subtle)]'}`}>{status}</span>
                  </span>
                  {[{ t: m.home, win: homeWin }, { t: m.away, win: awayWin }].map(({ t, win }, i) => (
                    <span key={i} className={`flex items-center justify-between gap-2 text-[13px] leading-tight ${win || live ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                      <span className="flex min-w-0 items-center gap-1.5">
                        {t.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.logo} alt="" width={16} height={16} loading="lazy" className="h-4 w-4 shrink-0 object-contain" />
                        ) : (
                          <span aria-hidden className="h-4 w-4 shrink-0 rounded-full bg-[var(--color-border)]" />
                        )}
                        <span className="truncate">{t.name}</span>
                      </span>
                      {m.state !== 'pre' && <span className="shrink-0 font-mono tab-num">{t.score ?? '-'}</span>}
                    </span>
                  ))}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
