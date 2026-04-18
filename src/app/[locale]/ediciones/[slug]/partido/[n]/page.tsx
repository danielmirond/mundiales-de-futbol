import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, MapPin, Flag } from 'lucide-react';
import { getTournament } from '@/lib/tournaments';
import {
  getMatchByNumber,
  getLineupsForMatch,
  getEventsForMatch,
} from '@/lib/data/match-detail';
import { STAGE_LABEL_ES } from '@/lib/data/matches';
import { StartingXI } from '@/components/edition/starting-xi';
import { MatchTimeline } from '@/components/edition/match-timeline';
import { PitchFormation } from '@/components/edition/pitch-formation';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; n: string }>;
}) {
  const { locale, slug, n } = await params;
  setRequestLocale(locale);

  const tournament = getTournament(slug);
  if (!tournament) notFound();

  const matchNumber = parseInt(n, 10);
  const match = await getMatchByNumber(tournament.year, matchNumber);
  if (!match) notFound();

  const [lineups, events] = await Promise.all([
    getLineupsForMatch(match.id),
    getEventsForMatch(match.id),
  ]);

  const homeLineups = lineups.filter((l) => l.team_code === match.home_code);
  const awayLineups = lineups.filter((l) => l.team_code === match.away_code);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${tournament.palette.from}44, ${tournament.palette.to}55, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, `/ediciones/${slug}`)}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {tournament.year} {tournament.host}
          </Link>

          <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {STAGE_LABEL_ES[match.stage] ?? match.stage}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex flex-1 items-center justify-end gap-4 min-w-0">
              <span className="truncate font-display text-4xl uppercase leading-none text-[var(--color-fg)] md:text-6xl">
                {match.home_team?.name_official ?? match.home_code}
              </span>
              <span className="text-5xl md:text-6xl">{match.home_team?.flag_emoji ?? '🏳️'}</span>
            </div>
            <div className="flex items-center gap-3 font-display text-6xl tab-num text-[var(--color-fg)] md:text-8xl">
              <span className={match.winner_code === match.home_code ? '' : 'opacity-60'}>
                {match.home_score ?? '—'}
              </span>
              <span className="text-[var(--color-fg-subtle)]">·</span>
              <span className={match.winner_code === match.away_code ? '' : 'opacity-60'}>
                {match.away_score ?? '—'}
              </span>
            </div>
            <div className="flex flex-1 items-center justify-start gap-4 min-w-0">
              <span className="text-5xl md:text-6xl">{match.away_team?.flag_emoji ?? '🏳️'}</span>
              <span className="truncate font-display text-4xl uppercase leading-none text-[var(--color-fg)] md:text-6xl">
                {match.away_team?.name_official ?? match.away_code}
              </span>
            </div>
          </div>

          {match.home_score_pk !== null && match.away_score_pk !== null && (
            <div className="mt-4 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-pitch)]">
              Penales {match.home_score_pk}—{match.away_score_pk}
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[var(--color-fg-muted)]">
            <span>{fmtDate(match.match_date)}</span>
            {match.venue?.name && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {match.venue.name}
              </span>
            )}
            {match.referee?.full_name && (
              <span className="flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                Árb · {match.referee.full_name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {events.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Timeline
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            {events.length} eventos
          </h2>
          <div className="mt-10">
            <MatchTimeline events={events} homeCode={match.home_code} awayCode={match.away_code} />
          </div>
        </section>
      )}

      {/* Lineups on the pitch */}
      {(homeLineups.length > 0 || awayLineups.length > 0) && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Alineaciones
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            XI sobre el campo
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            Formación detectada automáticamente a partir de la posición de cada jugador.
          </p>

          <div className="mt-10">
            <PitchFormation
              homeStarters={homeLineups.filter((l) => l.starter)}
              awayStarters={awayLineups.filter((l) => l.starter)}
              homeName={match.home_team?.name_official ?? match.home_code}
              awayName={match.away_team?.name_official ?? match.away_code}
              homeFlag={match.home_team?.flag_emoji ?? null}
              awayFlag={match.away_team?.flag_emoji ?? null}
              paletteFrom={tournament.palette.from}
              paletteTo={tournament.palette.to}
            />
          </div>

          {/* Bench + substitutions kept as collapsed lists */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {homeLineups.length > 0 && (
              <StartingXI
                players={homeLineups}
                teamName={match.home_team?.name_official ?? match.home_code}
                flag={match.home_team?.flag_emoji ?? null}
              />
            )}
            {awayLineups.length > 0 && (
              <StartingXI
                players={awayLineups}
                teamName={match.away_team?.name_official ?? match.away_code}
                flag={match.away_team?.flag_emoji ?? null}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
