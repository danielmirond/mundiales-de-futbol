import Link from 'next/link';
import { Play, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo';
import {
  getGoalsByYear,
  videoObjectLd,
  youtubeSearchUrl,
  youtubeThumbnailUrl,
  type FamousGoal,
} from '@/lib/wc-famous-goals';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { countryName } from '@/lib/country-names';

/**
 * Sección "Goles famosos" dentro de la página de una edición del Mundial.
 *
 * Arquitectura editorial: los goles famosos viven aquí (URL canónica
 * `/ediciones/{slug}#gol-{goalSlug}`). El hub `/goles-famosos` es un
 * índice transversal que enlaza a estas anclas — no duplica contenido
 * ni emite VideoObject JSON-LD (eso es responsabilidad de esta sección,
 * que es la página canónica del gol).
 */
export function EditionFamousGoals({
  year,
  tournamentSlug,
  locale,
}: {
  year: number;
  tournamentSlug: string;
  locale: string;
}) {
  const goals = getGoalsByYear(year);
  if (goals.length === 0) return null;

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com'
  ).trim();
  const localePrefix = locale !== routing.defaultLocale ? `/${locale}` : '';
  const editionBase = `${siteUrl}${localePrefix}/ediciones/${tournamentSlug}`;

  const videoLds = goals.map((g) =>
    videoObjectLd(g, siteUrl, `${editionBase}#gol-${g.slug}`),
  );

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <JsonLd data={videoLds} />

      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        <Trophy className="mr-2 inline h-3 w-3" /> Antología del torneo
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase">
        Goles famosos del Mundial {year}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)]">
        {goals.length === 1
          ? 'El gol que la memoria reserva para esta edición:'
          : `Los ${goals.length} goles que la memoria reserva para esta edición:`}
      </p>

      <div className="mt-8 space-y-5">
        {goals.map((g) => (
          <GoalCard key={g.slug} goal={g} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function GoalCard({ goal, locale }: { goal: FamousGoal; locale: string }) {
  const team = TEAMS_2026[goal.teamCode as keyof typeof TEAMS_2026];
  const opp = TEAMS_2026[goal.opponentCode as keyof typeof TEAMS_2026];
  const thumbnail = goal.youtubeId ? youtubeThumbnailUrl(goal.youtubeId) : null;
  const watchUrl = goal.youtubeId
    ? `https://www.youtube.com/watch?v=${goal.youtubeId}`
    : youtubeSearchUrl(goal.youtubeQuery);

  return (
    <article
      id={`gol-${goal.slug}`}
      className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 scroll-mt-32"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {goal.stage.toUpperCase()} · min {goal.minute}
          </div>
          <h3 className="mt-1 font-display text-2xl uppercase leading-tight">
            {goal.title}
          </h3>
        </div>
        <div className="font-mono text-sm text-[var(--color-pitch)]">
          {team?.flag} {countryName(goal.teamCode)}{' '}
          <span className="text-[var(--color-fg-subtle)]">
            {goal.finalScore.team}-{goal.finalScore.opponent}
          </span>{' '}
          {countryName(goal.opponentCode)} {opp?.flag}
        </div>
      </div>

      <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        Jugador: {goal.player}
      </p>

      <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
        {goal.description}
      </p>

      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 group relative block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]"
      >
        {thumbnail ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={`Vídeo del gol: ${goal.title}`}
              loading="lazy"
              className="aspect-video w-full object-cover transition-opacity group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2.5 backdrop-blur transition-transform group-hover:scale-105">
                <Play className="h-5 w-5 fill-current text-[var(--color-pitch)]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-white">
                  Ver en YouTube
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-[var(--color-bg)] transition-colors group-hover:bg-[var(--color-bg-2)]">
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-2)] px-4 py-2.5">
              <Play className="h-5 w-5 fill-current text-[var(--color-pitch)]" />
              <span className="font-mono text-xs uppercase tracking-[0.3em]">
                Buscar gol en YouTube
              </span>
            </div>
          </div>
        )}
      </a>

      <div className="mt-5 rounded-xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Por qué es icónico
        </div>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">{goal.whyIconic}</p>
      </div>

      {goal.relatedHistoriaSlug && (
        <div className="mt-4">
          <Link
            href={withLocale(
              locale as Locale,
              `/historias/${goal.relatedHistoriaSlug}`,
            )}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
          >
            Leer la historia completa →
          </Link>
        </div>
      )}
    </article>
  );
}
