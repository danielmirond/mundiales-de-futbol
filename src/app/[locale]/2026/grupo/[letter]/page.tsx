import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getTeamByCode, teamDisplayName, type TeamStats } from '@/lib/data/teams';
import { computeGroupStandings } from '@/lib/data/standings';
import {
  GROUPS_2026,
  FIXTURES_2026,
  VENUES_2026,
} from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';
import { countryName } from '@/lib/country-names';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return GROUPS_2026.flatMap((g) =>
    routing.locales.map((locale) => ({ locale, letter: g.letter })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; letter: string }>;
}) {
  const { locale, letter } = await params;
  const up = letter.toUpperCase();
  const g = GROUPS_2026.find((x) => x.letter === up);
  if (!g) return {};
  const teams = g.teams.filter(Boolean) as string[];
  return pageMetadata({
    locale,
    path: `/2026/grupo/${up.toLowerCase()}`,
    title: `Grupo ${up} · Mundial 2026`,
    description: `Equipos, calendario, sedes y tabla del Grupo ${up} del Mundial 2026: ${teams.join(', ')}.`,
    keywords: [
      `Grupo ${up} Mundial 2026`,
      ...teams.map((t) => `${t} Mundial 2026`),
      'grupos Copa del Mundo 2026',
    ],
  });
}

function formatLongDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('es', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ locale: string; letter: string }>;
}) {
  const { locale, letter } = await params;
  setRequestLocale(locale);

  const up = letter.toUpperCase();
  const group = GROUPS_2026.find((g) => g.letter === up);
  if (!group) notFound();

  // Fetch stats for the 4 teams in parallel. Filter nulls.
  const codes = group.teams.filter(Boolean) as string[];
  const teamStatsRaw = await Promise.all(codes.map((c) => getTeamByCode(c)));
  const teams = teamStatsRaw.filter(Boolean) as TeamStats[];

  // Fixtures for this group
  const fixtures = FIXTURES_2026.filter((f) => f.stage === up);
  const venueBySlug = new Map(VENUES_2026.map((v) => [v.slug, v]));

  // Live standings, computed from matches table. Pre-tournament all zero.
  const rawStandings = await computeGroupStandings(2026, up, codes);
  const teamByCode = new Map(teams.map((t) => [t.code, t]));
  // Algunas selecciones (debutantes como Cabo Verde) pueden no estar
  // todavía en la tabla `teams`. Generamos un fallback ligero para que
  // la página no reviente con 500.
  const standings = rawStandings.map((s) => {
    const team = teamByCode.get(s.code);
    return {
      ...s,
      team: team ?? {
        code: s.code,
        name_official: s.code,
        flag_emoji: null,
        confederation: null,
        titles: 0,
        wc_count: 0,
        matches_played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
        dissolved_year: null,
        successor_code: null,
      } as TeamStats,
    };
  });

  // Prev / next group navigation
  const idx = GROUPS_2026.findIndex((g) => g.letter === up);
  const prev = idx > 0 ? GROUPS_2026[idx - 1].letter : null;
  const next = idx < GROUPS_2026.length - 1 ? GROUPS_2026[idx + 1].letter : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `Grupo ${up} · FIFA World Cup 2026`,
    sport: 'Football',
    startDate: fixtures[0]?.date,
    endDate: fixtures[fixtures.length - 1]?.date,
    competitor: teams.map((t) => ({
      '@type': 'SportsTeam',
      name: teamDisplayName(t),
    })),
  };

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden pb-14 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(60% 50% at 50% 0%, rgba(0,255,133,0.25) 0%, transparent 70%)',
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/2026')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
          </Link>

          <div className="mt-6 flex items-baseline gap-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Grupo
            </div>
            <h1 className="font-display text-fluid-display uppercase leading-[0.88] text-[var(--color-fg)]">
              {up}
            </h1>
          </div>

          {/* Teams strip */}
          <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((t) => (
              <Link
                key={t.code}
                href={withLocale(locale as Locale, `/selecciones/${t.code}`)}
                className="group relative flex flex-col gap-2 bg-[var(--color-bg-2)] p-5 transition-colors hover:bg-[var(--color-bg)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{t.flag_emoji ?? '🏳️'}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    {t.confederation ?? ''}
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl uppercase leading-none text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                  {teamDisplayName(t)}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  {t.confederation ?? '-'} · {t.wc_count} mundial{t.wc_count === 1 ? '' : 'es'}
                  {t.titles > 0 ? ` · ${t.titles}★` : ''}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Standings table */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Clasificación
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Tabla del grupo
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
          Se actualiza automáticamente con cada partido. Los 2 primeros clasifican directo a
          dieciseisavos; los 8 mejores terceros entre los 12 grupos también avanzan.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-widest">
          <span className="inline-flex items-center gap-2 text-[var(--color-fg-muted)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-pitch)]" /> Clasificado
          </span>
          <span className="inline-flex items-center gap-2 text-[var(--color-fg-muted)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-sun)]" /> Mejor 3º
          </span>
          <span className="inline-flex items-center gap-2 text-[var(--color-fg-muted)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-border-strong)]" /> Eliminado
          </span>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                <th className="p-4 w-8 text-right">#</th>
                <th className="p-4">Selección</th>
                <th className="p-4 text-right">PJ</th>
                <th className="p-4 text-right">G</th>
                <th className="p-4 text-right">E</th>
                <th className="p-4 text-right">P</th>
                <th className="p-4 text-right hidden sm:table-cell">GF</th>
                <th className="p-4 text-right hidden sm:table-cell">GC</th>
                <th className="p-4 text-right">DG</th>
                <th className="p-4 text-right font-bold text-[var(--color-fg)]">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => {
                const qualified = i < 2; // Top 2 clasifican directo
                const possiblyQualified = i === 2; // 3er, 8 mejores entre los 12 grupos
                return (
                  <tr
                    key={s.team.code}
                    className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-2)]"
                  >
                    <td className="p-4 text-right">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] tab-num ${
                          qualified
                            ? 'bg-[var(--color-pitch)]/20 text-[var(--color-pitch)]'
                            : possiblyQualified
                              ? 'bg-[var(--color-sun)]/20 text-[var(--color-sun)]'
                              : 'text-[var(--color-fg-subtle)]'
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      {/* Si la selección está en BD, link clicable; si no, texto plano */}
                      {teamByCode.has(s.team.code) ? (
                        <Link
                          href={withLocale(locale as Locale, `/selecciones/${s.team.code}`)}
                          className="flex items-center gap-2 font-medium text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)]"
                        >
                          <span className="text-xl">{s.team.flag_emoji ?? '🏳️'}</span>
                          {teamDisplayName(s.team)}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 font-medium text-[var(--color-fg-muted)]">
                          <span className="text-xl">{s.team.flag_emoji ?? '🏳️'}</span>
                          {teamDisplayName(s.team)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)]">{s.MP}</td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)]">{s.W}</td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)]">{s.D}</td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)]">{s.L}</td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)] hidden sm:table-cell">{s.GF}</td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)] hidden sm:table-cell">{s.GA}</td>
                    <td className="p-4 text-right tab-num text-[var(--color-fg-muted)]">{s.GD >= 0 ? `+${s.GD}` : s.GD}</td>
                    <td className="p-4 text-right tab-num font-bold text-[var(--color-fg)]">{s.Pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Group fixtures */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Calendario · 6 partidos
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Los 6 cruces
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {fixtures.map((f, i) => {
            const venue = venueBySlug.get(f.venue);
            return (
              <div key={f.n} className="flex flex-col gap-3 bg-[var(--color-bg)] p-5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  <span>Jornada {Math.floor(i / 2) + 1}</span>
                  <span>{formatLongDate(f.date)} · {f.time}</span>
                </div>
                <div className="font-display text-xl uppercase text-[var(--color-fg)]">
                  {f.home && f.away ? (
                    <span>{f.home}, {f.away}</span>
                  ) : f.home ? (
                    <span>{f.home} <span className="text-[var(--color-fg-subtle)]">- TBD</span></span>
                  ) : (
                    <span className="text-[var(--color-fg-subtle)] italic">
                      2 de {codes.map((c) => countryName(c)).join(' · ')}
                    </span>
                  )}
                </div>
                {venue && (
                  <Link
                    href={withLocale(locale as Locale, `/estadios/${venue.slug}`)}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
                  >
                    <MapPin className="h-3 w-3" />
                    {venue.name} · {venue.hostCity}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Prev / next navigation */}
      <nav className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-8">
          {prev ? (
            <Link
              href={withLocale(locale as Locale, `/2026/grupo/${prev}`)}
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> Grupo {prev}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href={withLocale(locale as Locale, '/2026')}
            className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
          >
            Todos los grupos
          </Link>
          {next ? (
            <Link
              href={withLocale(locale as Locale, `/2026/grupo/${next}`)}
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
            >
              Grupo {next} <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </div>
  );
}
