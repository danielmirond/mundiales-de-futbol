import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchToday, fetchWindow, dayKeys, type Match } from '@/lib/espn';
import { competitionPath, type Competition } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';
import { channelsFor } from '@/lib/wosti';
import { MatchRow } from './match-row';

/** Canales (WOSTI) solo para fútbol; el feed no cubre otros deportes. */
const tv = (m: Match) =>
  m.competition.sport === 'futbol'
    ? channelsFor(m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name])
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

  const groups = new Map<string, { comp: Competition; items: Match[] }>();
  for (const m of matches) {
    const comp = competitions.find((c) => c.slug === m.competition.slug && c.sport === m.competition.sport);
    if (!comp) continue;
    const g = groups.get(comp.slug) ?? { comp, items: [] };
    g.items.push(m);
    groups.set(comp.slug, g);
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      {(kicker || title) && (
        <div className="mb-6">
          {kicker && <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">{kicker}</div>}
          {title && <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">{title}</h2>}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-sm text-[var(--color-fg-muted)]">{emptyText}</div>
      ) : groupByCompetition ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[...groups.values()].map(({ comp, items }) => (
            <div key={comp.slug}>
              <div className="mb-3 flex items-center gap-3">
                <Link href={withLocale(locale, competitionPath(comp))} className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]">
                  {comp.flag ? `${comp.flag} ` : ''}{comp.name}
                </Link>
                <span className="font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{items.length}</span>
                <span className="h-px flex-1 bg-[var(--color-border)]" />
              </div>
              <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                {(limitPerGroup ? items.slice(0, limitPerGroup) : items).map((m) => (
                  <MatchRow key={m.id} m={m} showDay={range !== 'today'} channels={tv(m)} />
                ))}
              </ul>
              {limitPerGroup && items.length > limitPerGroup && (
                <Link href={withLocale(locale, competitionPath(comp))} className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-pitch)] hover:underline">
                  Ver todos <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
          {matches.map((m) => <MatchRow key={`${m.competition.slug}-${m.id}`} m={m} showDay={range !== 'today'} showCompetition channels={tv(m)} />)}
        </ul>
      )}
    </section>
  );
}
