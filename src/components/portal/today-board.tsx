import { fetchToday, fetchWindow, dayKeys, type Match } from '@/lib/espn';
import { competitionPath, type Competition } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';
import { channelsFor, getWostiIndex, type WostiIndex } from '@/lib/wosti';
import { MatchRow, MatchList } from './match-row';

/** Canales (WOSTI) solo para fútbol; el feed no cubre otros deportes. */
const tvFor = (idx: WostiIndex) => (m: Match) =>
  m.competition.sport === 'futbol'
    ? channelsFor(idx, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name])
    : [];

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

type Props = {
  locale: Locale;
  competitions: Competition[];
  /** 'today' = solo hoy (Madrid); o ventana [from,to] en días. */
  range?: 'today' | [number, number];
  title?: string;
  kicker?: string;
  /** Agrupar por competición (listados mixtos) o lista plana con día. */
  groupByCompetition?: boolean;
  emptyText?: string;
  limitPerGroup?: number;
};

/** Tablero de partidos (hoy o ventana) para un conjunto de competiciones. */
export async function TodayBoard({
  locale, competitions, range = 'today', title, kicker, groupByCompetition = true,
  emptyText = 'No hay partidos programados.', limitPerGroup,
}: Props) {
  const matches: Match[] = range === 'today'
    ? await fetchToday(competitions)
    : await fetchWindow(competitions, dayKeys(range[0], range[1]));

  if (matches.length === 0 && !title) return null;
  const tv = tvFor(matches.some((m) => m.competition.sport === 'futbol') ? await getWostiIndex() : new Map());
  const hrefOf = (m: Match) => withLocale(locale, `/${m.competition.sport}/${m.competition.slug}/partido/${m.id}`);
  const teamHrefOf = (m: Match) => (id: string) => withLocale(locale, `/${m.competition.sport}/${m.competition.slug}/equipo/${id}`);

  const groups = new Map<string, { comp: Competition; items: Match[] }>();
  for (const m of matches) {
    const comp = competitions.find((c) => c.slug === m.competition.slug && c.sport === m.competition.sport);
    if (!comp) continue;
    const g = groups.get(comp.slug) ?? { comp, items: [] };
    g.items.push(m);
    groups.set(comp.slug, g);
  }
  const single = competitions.length === 1 ? competitions[0] : undefined;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10" data-sport={single?.sport}>
      {(kicker || title) && (
        <div className="mb-6">
          {kicker && <div className="kicker">{kicker}</div>}
          {title && <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{title}</h2>}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-sm text-[var(--color-fg-muted)]">{emptyText}</div>
      ) : groupByCompetition ? (
        <div className={`grid gap-5 ${groups.size > 1 ? 'lg:grid-cols-2' : ''}`}>
          {[...groups.values()].map(({ comp, items }) => (
            <MatchList
              key={comp.slug}
              sport={comp.sport}
              kicker={comp.name}
              title={<span className="font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{items.length}</span>}
              more={{ href: withLocale(locale, competitionPath(comp)), label: limitPerGroup && items.length > limitPerGroup ? `Ver los ${items.length}` : 'Clasificación y calendario' }}
            >
              {(limitPerGroup ? items.slice(0, limitPerGroup) : items).map((m) => (
                <MatchRow key={m.id} m={m} showDay={range !== 'today'} channels={tv(m)} href={hrefOf(m)} teamHref={teamHrefOf(m)} />
              ))}
            </MatchList>
          ))}
        </div>
      ) : (
        <MatchList sport={single?.sport ?? 'futbol'}>
          {matches.map((m) => <MatchRow key={`${m.competition.slug}-${m.id}`} m={m} showDay={range !== 'today'} showCompetition channels={tv(m)} href={hrefOf(m)} teamHref={teamHrefOf(m)} />)}
        </MatchList>
      )}
    </section>
  );
}
