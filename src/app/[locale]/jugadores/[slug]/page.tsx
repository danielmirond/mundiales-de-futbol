import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Calendar, Flag } from 'lucide-react';
import {
  getPlayerBySlug,
  getPlayerCareer,
  displayPlayerName,
} from '@/lib/data/players';
import { getTournament } from '@/lib/tournaments';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo';
import { STAGE_LABEL_ES } from '@/lib/data/matches';
import { countryName } from '@/lib/country-names';

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

function age(birth: string | null, death: string | null) {
  if (!birth) return null;
  const b = new Date(birth);
  const end = death ? new Date(death) : new Date();
  const years = Math.floor((end.getTime() - b.getTime()) / (365.25 * 86400000));
  return years;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const name = displayPlayerName(player);

  // Patrón híbrido tier-based:
  // · Legends (≥3 Mundiales o ≥6 goles): "Pelé mundialista, Brasil · 4 Mundiales · 12 goles"
  // · Regulares (2 Mundiales): "Gerd Müller · Alemania · 2 Mundiales · 14 goles"
  // · Single (1 Mundial): "James Rodríguez (Colombia) · Mundial 2014"
  const isLegend = player.wc_count >= 3 || player.goals >= 6;
  const isRegular = !isLegend && player.wc_count >= 2;

  let title: string;
  if (isLegend) {
    const wcLabel = `${player.wc_count} Mundial${player.wc_count === 1 ? '' : 'es'}`;
    const goalsLabel = player.goals > 0 ? ` · ${player.goals} gol${player.goals === 1 ? '' : 'es'}` : '';
    title = `${name} mundialista, ${player.nationality_code} · ${wcLabel}${goalsLabel}`;
  } else if (isRegular) {
    const goalsLabel = player.goals > 0 ? ` · ${player.goals} gol${player.goals === 1 ? '' : 'es'}` : '';
    title = `${name} · ${player.nationality_code} · ${player.wc_count} Mundiales${goalsLabel}`;
  } else {
    title = `${name} (${player.nationality_code}) · Mundial${player.wc_count > 0 ? '' : 'ista'}`;
  }
  const description = `${name}, ${player.nationality_code}${player.position ? `, ${player.position}` : ''}. ${player.wc_count} Mundial${player.wc_count === 1 ? '' : 'es'} disputado${player.wc_count === 1 ? '' : 's'}, ${player.goals} gol${player.goals === 1 ? '' : 'es'}, ${player.total_minutes} minutos. Estadísticas, plantillas y partidos.`;
  const url =
    locale === routing.defaultLocale
      ? `${siteUrl}/jugadores/${player.slug}`
      : `${siteUrl}/${locale}/jugadores/${player.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}/jugadores/${player.slug}`
            : `${siteUrl}/${l}/jugadores/${player.slug}`,
        ]),
      ),
    },
    openGraph: {
      type: 'profile',
      title,
      description,
      url,
      images: player.photo_url ? [{ url: player.photo_url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const player = await getPlayerBySlug(slug);
  if (!player) notFound();

  const career = await getPlayerCareer(player.id);

  // Group career by tournament year
  type GroupedYear = {
    year: number;
    matches: typeof career;
    minutes: number;
    goals: number;
  };
  const byYear: GroupedYear[] = [];
  const yearMap = new Map<number, GroupedYear>();
  for (const app of career) {
    let g = yearMap.get(app.tournament_year);
    if (!g) {
      g = { year: app.tournament_year, matches: [], minutes: 0, goals: 0 };
      yearMap.set(app.tournament_year, g);
      byYear.push(g);
    }
    g.matches.push(app);
    g.minutes += app.minutes_played ?? 0;
    g.goals += app.goals;
  }
  byYear.sort((a, b) => b.year - a.year);

  const a = age(player.birth_date, player.death_date);
  const featuredTournament = byYear[0] ? getTournament(byYear[0].year) : null;
  const palette = featuredTournament?.palette ?? { from: '#00FF85', to: '#00C266' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: displayPlayerName(player),
    alternateName: player.full_name !== displayPlayerName(player) ? player.full_name : undefined,
    jobTitle: player.position === 'GK' ? 'Goalkeeper' : 'Football player',
    nationality: player.nationality_code,
    birthDate: player.birth_date,
    deathDate: player.death_date,
    image: player.photo_url,
    url: `${siteUrl}/jugadores/${player.slug}`,
    description: `${player.wc_count} FIFA World Cups. ${player.goals} goals in ${career.length} matches.`,
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          {player.photo_url && (
            <div className="absolute inset-0">
              <Image
                src={player.photo_url}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-25"
                style={{ filter: 'grayscale(70%) contrast(1.05)', objectPosition: 'center 20%' }}
                unoptimized
              />
            </div>
          )}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${palette.from}44, ${palette.to}33, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/60 to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/jugadores')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Jugadores
          </Link>

          <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: palette.from }}>
            {player.nationality_code} · {player.position ?? 'Jugador'}
          </div>

          <div className="mt-3 flex items-end gap-6">
            {player.photo_url && (
              <div
                className="relative hidden h-44 w-36 shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border-strong)] md:block"
                style={{ background: 'var(--color-bg-2)' }}
              >
                <Image
                  src={player.photo_url}
                  alt={displayPlayerName(player)}
                  fill
                  sizes="144px"
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                  unoptimized
                />
              </div>
            )}
            <h1 className="font-display text-fluid-display uppercase leading-[0.9]">
              {displayPlayerName(player)}
            </h1>
          </div>

          {player.known_as && player.known_as !== player.full_name && (
            <p className="mt-4 text-lg italic text-[var(--color-fg-muted)]">
              {player.full_name}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-[var(--color-fg-muted)]">
            {player.birth_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {fmtDate(player.birth_date)}
                {a !== null && !player.death_date && ` · ${a} años`}
              </span>
            )}
            {player.death_date && (
              <span className="flex items-center gap-1.5">
                † {fmtDate(player.death_date)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" /> {player.nationality_code}
            </span>
          </div>
        </div>
      </section>

      {/* Career stats */}
      <section className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-5">
          <StatCell label="Mundiales" value={String(player.wc_count)} />
          <StatCell label="Partidos" value={String(career.length)} />
          <StatCell label="Titular" value={String(player.starts)} />
          <StatCell label="Minutos" value={player.total_minutes.toLocaleString()} />
          <StatCell label="Goles" value={String(player.goals)} accent={palette.from} />
        </div>
      </section>

      {/* Per-tournament breakdown */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Trayectoria · {player.wc_years.join(' · ')}
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {player.wc_count} Mundial{player.wc_count === 1 ? '' : 'es'}
        </h2>

        <div className="mt-10 space-y-12">
          {byYear.map((yr) => {
            const t = getTournament(yr.year);
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
                  </Link>
                  <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                    <span>{yr.matches.length}P</span>
                    <span>{yr.minutes}′</span>
                    {yr.goals > 0 && (
                      <span className="text-[var(--color-pitch)]">{yr.goals}G</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
                  {yr.matches.map((m) => (
                    <Link
                      key={m.match_id}
                      href={withLocale(locale as Locale, `/ediciones/${t?.slug ?? yr.year}/partido/${m.match_number}`)}
                      className="group flex flex-col gap-3 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        <span>{STAGE_LABEL_ES[m.stage ?? 'group'] ?? m.stage}</span>
                        <span>{fmtDate(m.match_date)}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <div
                          className={`truncate text-end text-sm ${
                            m.team_code === m.team_code ? '' : ''
                          }`}
                        >
                          {countryName(m.team_code)}
                        </div>
                        <div className="font-display text-2xl tab-num text-[var(--color-fg)]">
                          {m.home_score ?? '-'} · {m.away_score ?? '-'}
                        </div>
                        <div className="truncate text-sm text-[var(--color-fg-muted)]">
                          {countryName(m.opponent_code)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        <span className="flex items-center gap-2">
                          {m.starter ? '11' : 'S'}
                          <span>{m.minutes_played ?? 0}′</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {m.goals > 0 && (
                            <span className="text-[var(--color-pitch)]">
                              ⚽ {m.goals}
                            </span>
                          )}
                          {m.yellows > 0 && <span className="text-[var(--color-sun)]">▮</span>}
                          {m.reds > 0 && <span className="text-[var(--color-flame)]">▮</span>}
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

function StatCell({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-3 bg-[var(--color-bg-2)] p-6 md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {label}
      </div>
      <div
        className="font-display text-4xl tab-num md:text-5xl"
        style={{ color: accent ?? 'var(--color-fg)' }}
      >
        {value}
      </div>
    </div>
  );
}
