import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Trophy } from 'lucide-react';
import { getTeamByCode, getTeamMatches, getTeamTopScorers, teamDisplayName } from '@/lib/data/teams';
import { getTournament, TOURNAMENTS } from '@/lib/tournaments';
import { STAGE_LABEL_ES } from '@/lib/data/matches';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const team = await getTeamByCode(code);
  if (!team) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const name = teamDisplayName(team);
  const title = `${name} en los Mundiales · ${team.titles} título${team.titles === 1 ? '' : 's'}`;
  const description = `${name} ha disputado ${team.wc_count} Mundiales con ${team.matches_played} partidos y un récord de ${team.wins}-${team.draws}-${team.losses}.`;
  const url =
    locale === routing.defaultLocale
      ? `${siteUrl}/selecciones/${team.code}`
      : `${siteUrl}/${locale}/selecciones/${team.code}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}/selecciones/${team.code}`
            : `${siteUrl}/${l}/selecciones/${team.code}`,
        ]),
      ),
    },
    openGraph: { type: 'website', title, description, url },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function SelectionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const team = await getTeamByCode(code);
  if (!team) notFound();

  const [matches, topScorers] = await Promise.all([
    getTeamMatches(team.code),
    getTeamTopScorers(team.code, 10),
  ]);

  // Group matches by tournament year for timeline presentation.
  type YearGroup = {
    year: number;
    matches: typeof matches;
    record: { w: number; d: number; l: number; gf: number; ga: number };
  };
  const years = new Map<number, YearGroup>();
  for (const m of matches) {
    let g = years.get(m.tournament_year);
    if (!g) {
      g = { year: m.tournament_year, matches: [], record: { w: 0, d: 0, l: 0, gf: 0, ga: 0 } };
      years.set(m.tournament_year, g);
    }
    g.matches.push(m);
    if (m.result === 'W') g.record.w++;
    else if (m.result === 'D') g.record.d++;
    else if (m.result === 'L') g.record.l++;
    g.record.gf += m.team_score ?? 0;
    g.record.ga += m.opponent_score ?? 0;
  }
  const byYear: YearGroup[] = [...years.values()].sort((a, b) => b.year - a.year);

  const accentFrom = '#00FF85';
  const accentTo = '#FFD400';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: teamDisplayName(team),
    alternateName: team.name_official,
    sport: 'Football',
    url: `${siteUrl}/selecciones/${team.code}`,
    memberOf: team.confederation
      ? { '@type': 'SportsOrganization', name: team.confederation }
      : undefined,
    award: team.titles > 0 ? `${team.titles}× FIFA World Cup champion` : undefined,
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-25"
            style={{ background: `linear-gradient(135deg, ${accentFrom}33, ${accentTo}22, transparent 70%)` }}
          />
          <div className="absolute inset-0 grid-overlay opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/selecciones')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Selecciones
          </Link>

          <div className="mt-6 flex items-center gap-5">
            <span className="text-6xl md:text-7xl">{team.flag_emoji ?? '🏳️'}</span>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {team.confederation ?? '—'} · {team.code}
              </div>
              <h1 className="mt-2 font-display text-fluid-display uppercase leading-[0.9]">
                {teamDisplayName(team)}
              </h1>
              {team.dissolved_year && (
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  Activa hasta {team.dissolved_year}
                  {team.successor_code && ` · sucesora: ${team.successor_code}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Honors + record */}
      <section className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-6">
          <Stat label="Títulos" value={String(team.titles)} accent={team.titles > 0 ? 'var(--color-pitch)' : undefined} icon={team.titles > 0 ? Trophy : undefined} />
          <Stat label="Subcampeón" value={String(team.runners_up)} />
          <Stat label="Mundiales" value={String(team.wc_count)} />
          <Stat label="Partidos" value={String(team.matches_played)} />
          <Stat label="Récord" value={`${team.wins}-${team.draws}-${team.losses}`} small />
          <Stat label="Goles" value={`${team.goals_for}/${team.goals_against}`} small />
        </div>
      </section>

      {/* Top scorers */}
      {topScorers.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Bota de oro · {teamDisplayName(team)}
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            Máximos goleadores
          </h2>
          <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-5">
            {topScorers.map((p) => (
              <Link
                key={p.player_id}
                href={withLocale(locale as Locale, `/jugadores/${p.slug}`)}
                className="group flex flex-col gap-2 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
              >
                <span className="font-display text-3xl tab-num text-[var(--color-pitch)]">
                  {p.goals}
                </span>
                <span className="text-sm font-medium text-[var(--color-fg)]">
                  {p.known_as || p.full_name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Timeline of World Cup campaigns */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Trayectoria · {team.wc_count} Mundial{team.wc_count === 1 ? '' : 'es'}
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Cada aparición
        </h2>

        <div className="mt-10 space-y-10">
          {byYear.map((yr) => {
            const t = getTournament(yr.year);
            const isChamp = t && team.code && (team.code === championCodeFor(yr.year));
            return (
              <div key={yr.year}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                  <Link
                    href={withLocale(locale as Locale, `/ediciones/${t?.slug ?? yr.year}`)}
                    className="flex items-baseline gap-4 group"
                  >
                    <span className="font-display text-5xl tab-num text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                      {yr.year}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                      {t?.host ?? ''}
                    </span>
                    {isChamp && (
                      <span className="rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-pitch)]">
                        Campeón
                      </span>
                    )}
                  </Link>
                  <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                    <span>{yr.matches.length}P</span>
                    <span>{yr.record.w}-{yr.record.d}-{yr.record.l}</span>
                    <span>{yr.record.gf}/{yr.record.ga}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
                  {yr.matches.map((m) => (
                    <Link
                      key={m.id}
                      href={withLocale(locale as Locale, `/ediciones/${t?.slug ?? yr.year}/partido/${m.match_number}`)}
                      className="group flex flex-col gap-3 bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-bg-2)]"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        <span>{STAGE_LABEL_ES[m.stage ?? 'group'] ?? m.stage}</span>
                        <span>{fmtDate(m.match_date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ResultChip result={m.result} />
                        <span className="font-mono text-base tab-num">
                          {m.team_score ?? '—'} — {m.opponent_score ?? '—'}
                        </span>
                        <span className="ml-auto font-medium text-[var(--color-fg)]">
                          vs {m.opponent_code}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  icon: Icon,
  small,
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 bg-[var(--color-bg-2)] p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {label}
        </div>
        {Icon && <Icon className="h-4 w-4" style={{ color: accent ?? 'var(--color-fg-muted)' }} />}
      </div>
      <div
        className={`font-display tab-num ${small ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}
        style={{ color: accent ?? 'var(--color-fg)' }}
      >
        {value}
      </div>
    </div>
  );
}

function ResultChip({ result }: { result: 'W' | 'D' | 'L' | '—' }) {
  const color =
    result === 'W' ? 'var(--color-pitch)' : result === 'L' ? 'var(--color-flame)' : 'var(--color-fg-subtle)';
  const label = result === 'W' ? 'G' : result === 'D' ? 'E' : result === 'L' ? 'P' : '—';
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-semibold"
      style={{ background: `${color}22`, color }}
    >
      {label}
    </span>
  );
}

function championCodeFor(year: number): string | undefined {
  const t = TOURNAMENTS.find((t) => t.year === year);
  return t?.championCode;
}
