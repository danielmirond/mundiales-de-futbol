import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Clock, MapPin, Trophy, ArrowRight, User } from 'lucide-react';
import { type Match, STAGE_LABEL_ES } from '@/lib/data/matches';
import { ICONIC_MATCHES } from '@/lib/match-iconic';
import { HISTORIAS } from '@/lib/historias';
import { routing, type Locale } from '@/i18n/routing';
import { MatchTabs } from './match-tabs';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type MatchCardVariant = 'compact' | 'full';

/**
 * MatchCard reutilizable, servido como server component.
 *
 * Renderiza un partido del Mundial en 1 de 2 variantes:
 *  - `compact` (default): tarjeta horizontal con bandera + score + venue
 *    + CTA "Ver partido". Pensado para listas de partidos en /2026,
 *    /2026/grupo/[L], /2026/calendario, ediciones, etc.
 *  - `full`: añade tabs H2H / Crónica / Curiosidad con MatchTabs (client).
 *    Pensado para la futura página /2026/partido/[n].
 *
 * El componente NO fetcha datos: recibe `Match` del padre (que ya hizo
 * la query a Supabase). Esto garantiza que un padre que ya hace una
 * query batch pueda alimentar N MatchCards sin N round-trips.
 *
 * Iconic + historia:
 *  - Si el partido es un "iconic" conocido (ver lib/match-iconic.ts),
 *    se renderiza un chip dorado con su apodo cultural (Maracanazo,
 *    Mano de Dios, etc.).
 *  - Si hay una `Historia` del calendario editorial cuyo slug haga
 *    referencia a este partido, MatchTabs ofrece un link directo.
 */
export async function MatchCard({
  match,
  tournamentYear,
  tournamentSlug,
  locale,
  variant = 'compact',
}: {
  match: Match;
  tournamentYear: number;
  tournamentSlug: string;
  locale: Locale;
  variant?: MatchCardVariant;
}) {
  const t = await getTranslations('matchCard');

  const iconic = ICONIC_MATCHES[`${tournamentYear}:${match.match_number}`];
  const stageLabel = STAGE_LABEL_ES[match.stage] ?? match.stage;
  const status = getStatus(match);
  const matchUrl = withLocale(
    locale,
    `/ediciones/${tournamentSlug}/partido/${match.match_number}`,
  );

  // Si existe una historia del calendario editorial relacionada con
  // este partido (heurística: incluye el año y código de equipo en el
  // slug), pasamos la referencia al panel de "Curiosidad" en tabs.
  const linkedStory = HISTORIAS.find((h) => {
    if (!h.slug.includes(String(tournamentYear))) return false;
    return (
      h.slug.includes(match.home_code.toLowerCase()) ||
      h.slug.includes(match.away_code.toLowerCase())
    );
  });

  const homeFlag = match.home_team?.flag_emoji ?? '🏳️';
  const awayFlag = match.away_team?.flag_emoji ?? '🏳️';
  const homeName = match.home_team?.name_official ?? match.home_code;
  const awayName = match.away_team?.name_official ?? match.away_code;
  const isFull = variant === 'full';

  return (
    <article
      className={`rounded-3xl border ${
        iconic
          ? 'border-[var(--color-sun)]/40 bg-gradient-to-br from-[var(--color-bg-2)] to-[color-mix(in_oklab,_var(--color-sun)_8%,_var(--color-bg-2))]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-2)]'
      } p-6 transition-colors md:p-7`}
    >
      {/* Cabecera: match number, stage, fecha, status, iconic chip */}
      <header className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        <span className="inline-flex items-center gap-2">
          <span className="text-[var(--color-pitch)]">#{match.match_number}</span>
          <span className="text-[var(--color-fg-muted)]">{stageLabel}</span>
        </span>
        <StatusBadge status={status} t={t} />
      </header>

      {iconic && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-sun)]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-sun)]">
          <Trophy className="h-3 w-3" />
          {iconic}
        </div>
      )}

      {/* Score row */}
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link
          href={withLocale(locale, `/selecciones/${match.home_code}`)}
          className="group flex items-center justify-end gap-3"
          title={homeName}
        >
          <span className="text-right">
            <span className="block font-display text-base uppercase leading-tight md:text-lg">
              {homeName}
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {match.home_code}
            </span>
          </span>
          <span aria-hidden className="text-4xl transition-transform group-hover:scale-110">
            {homeFlag}
          </span>
        </Link>

        <Score match={match} status={status} />

        <Link
          href={withLocale(locale, `/selecciones/${match.away_code}`)}
          className="group flex items-center gap-3"
          title={awayName}
        >
          <span aria-hidden className="text-4xl transition-transform group-hover:scale-110">
            {awayFlag}
          </span>
          <span>
            <span className="block font-display text-base uppercase leading-tight md:text-lg">
              {awayName}
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {match.away_code}
            </span>
          </span>
        </Link>
      </div>

      {/* Meta row: fecha + sede + árbitro */}
      <dl className="mt-5 grid gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] md:grid-cols-3">
        {match.match_date && (
          <div className="inline-flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{formatDate(match.match_date, locale)}</span>
          </div>
        )}
        {match.venue && (
          <div className="inline-flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>
              {match.venue.name}
              {match.venue.city ? ` · ${match.venue.city}` : ''}
            </span>
          </div>
        )}
        {match.referee && (
          <div className="inline-flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{match.referee.full_name}</span>
          </div>
        )}
      </dl>

      {/* Variant full → tabs interactivos */}
      {isFull && (
        <div className="mt-6">
          <MatchTabs
            iconic={iconic ?? null}
            linkedStory={
              linkedStory
                ? {
                    slug: linkedStory.slug,
                    title: linkedStory.title,
                    excerpt: linkedStory.excerpt,
                    locale,
                  }
                : null
            }
            homeName={homeName}
            awayName={awayName}
            stage={stageLabel}
          />
        </div>
      )}

      {/* Variant compact → CTA "Ver partido" */}
      {!isFull && (
        <div className="mt-6 flex justify-end">
          <Link
            href={matchUrl}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            {t('seeMatch')}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      )}
    </article>
  );
}

// ───────────────────────────────────────────────────────────────────
// Subcomponentes presentacionales
// ───────────────────────────────────────────────────────────────────

type MatchStatus = 'finished' | 'live' | 'scheduled';

function getStatus(match: Match): MatchStatus {
  if (match.home_score !== null && match.away_score !== null) return 'finished';
  // TODO: cuando haya datos live de StatsBomb / FIFA, detectar 'live' por
  // ventana 0-120 min desde kickoff. Por ahora, sin marcador = scheduled.
  return 'scheduled';
}

function StatusBadge({
  status,
  t,
}: {
  status: MatchStatus;
  t: Awaited<ReturnType<typeof getTranslations<'matchCard'>>>;
}) {
  if (status === 'live')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-red-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        {t('statusLive')}
      </span>
    );
  if (status === 'finished')
    return (
      <span className="rounded-full bg-[var(--color-pitch)]/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
        {t('statusFinished')}
      </span>
    );
  return (
    <span className="rounded-full bg-[var(--color-bg-3)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
      {t('statusScheduled')}
    </span>
  );
}

function Score({ match, status }: { match: Match; status: MatchStatus }) {
  if (status === 'scheduled') {
    return (
      <div className="text-center font-display text-3xl font-extrabold uppercase text-[var(--color-fg-subtle)]">
        VS
      </div>
    );
  }
  const hasPk =
    match.home_score_pk !== null && match.away_score_pk !== null;
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-extrabold tab-num text-[var(--color-pitch)] md:text-4xl">
        {match.home_score} <span className="text-[var(--color-fg-subtle)]">−</span>{' '}
        {match.away_score}
      </div>
      {hasPk && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          (Penaltis {match.home_score_pk}-{match.away_score_pk})
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
