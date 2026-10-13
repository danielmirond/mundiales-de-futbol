import Link from 'next/link';
import type { Competition } from '@/lib/competitions';
import { matchdayRange, type Matchday } from '@/lib/season';
import { channelsFor, type WostiIndex } from '@/lib/wosti';
import { routing, type Locale } from '@/i18n/routing';
import { MatchRow, MatchList } from './match-row';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Una jornada completa como lista de partidos con cabecera (`.mlist`). */
export function MatchdayList({ comp, md, locale, wosti, href, titleTag = 'h2' }: { comp: Competition; md: Matchday; locale: Locale; wosti: WostiIndex; href?: string; titleTag?: 'h2' | 'h3' }) {
  const base = `/${comp.sport}/${comp.slug}`;
  const Title = titleTag;
  const status = md.live > 0 ? 'En juego' : md.played === md.matches.length ? 'Finalizada' : md.played > 0 ? `${md.played}/${md.matches.length} jugados` : 'Pendiente';
  return (
    <div id={md.slug} className="scroll-mt-36">
      <MatchList
        sport={comp.sport}
        kicker={<Title className="kicker">{md.label}</Title>}
        title={<span className="text-sm font-medium text-[var(--color-fg-muted)]">{matchdayRange(md)} · {status}</span>}
        more={href ? { href: withLocale(locale, href), label: 'Ver jornada' } : undefined}
      >
        {md.matches.map((m) => (
          <MatchRow
            key={m.id}
            m={m}
            showDay
            channels={comp.sport === 'futbol' ? channelsFor(wosti, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]) : []}
            href={withLocale(locale, `${base}/partido/${m.id}`)}
            teamHref={(id) => withLocale(locale, `${base}/equipo/${id}`)}
          />
        ))}
      </MatchList>
    </div>
  );
}

/** Paginador de jornadas (anterior · selector · siguiente). */
export function MatchdayPager({ comp, mds, current, locale, section }: { comp: Competition; mds: Matchday[]; current: Matchday; locale: Locale; section: 'resultados' | 'calendario' }) {
  const base = `/${comp.sport}/${comp.slug}/${section}`;
  const i = mds.findIndex((m) => m.slug === current.slug);
  const prev = mds[i - 1], next = mds[i + 1];
  const pill = 'inline-flex h-9 items-center rounded-full border border-[var(--color-border-strong)] px-4 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {prev ? <Link href={withLocale(locale, `${base}/${prev.slug}`)} className={pill}>← {prev.label}</Link> : <span />}
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{current.n} / {mds.length}</span>
      {next ? <Link href={withLocale(locale, `${base}/${next.slug}`)} className={pill}>{next.label} →</Link> : null}
    </div>
  );
}
