import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarDays, Tv, Radio } from 'lucide-react';
import { FIXTURES_2026, TEAMS_2026, STAGE_LABEL } from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { getMovistarLink } from '@/lib/movistar-match-links';
import { MovistarStrip } from '@/components/affiliate/movistar-banner';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const MADRID = 'Europe/Madrid';
const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const longFmt = new Intl.DateTimeFormat('es', {
  timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long',
});

type Row = { f: (typeof FIXTURES_2026)[number]; ms: number; dateKey: string };
const SCHED: Row[] = FIXTURES_2026
  .map((f) => {
    const ms = new Date(fixtureToUTC(f)).getTime();
    return { f, ms, dateKey: dateKeyFmt.format(ms) };
  })
  .sort((a, b) => a.ms - b.ms);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/partidos-hoy',
    title: 'Partidos de hoy del Mundial 2026: horarios, resultados en vivo y dónde ver',
    description:
      '¿Qué partidos hay hoy en el Mundial 2026? Todos los partidos del día con su hora en España, resultados en vivo, grupo y dónde verlos por TV. Se actualiza solo.',
    keywords: [
      'partidos de hoy mundial 2026',
      'qué partidos hay hoy del mundial',
      'quién juega hoy en el mundial',
      'partidos del mundial hoy',
      'resultados mundial 2026 en vivo',
      'fixture mundial 2026',
      'mundial hoy',
    ],
    type: 'website',
  });
}

function Team({ code, label, align }: { code?: string; label?: string; align: 'start' | 'end' }) {
  const team = code ? TEAMS_2026[code] : undefined;
  return (
    <span className={`flex min-w-0 flex-1 items-center gap-2 ${align === 'end' ? 'justify-end text-end' : ''}`}>
      {align === 'end' && (
        <span className="truncate text-sm font-medium text-[var(--color-fg)] md:text-base">
          {team?.name ?? label ?? code ?? '—'}
        </span>
      )}
      <span className="text-2xl leading-none" aria-hidden>{team?.flag ?? '⚽'}</span>
      {align === 'start' && (
        <span className="truncate text-sm font-medium text-[var(--color-fg)] md:text-base">
          {team?.name ?? label ?? code ?? '—'}
        </span>
      )}
    </span>
  );
}

export default async function PartidosHoy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const scoreMap = buildScoreMap(await fetchScores());
  const now = Date.now();
  const todayKey = dateKeyFmt.format(now);

  // Partidos de hoy; si no hay, el próximo día con partidos.
  let rows = SCHED.filter((s) => s.dateKey === todayKey);
  let isToday = true;
  if (rows.length === 0) {
    const next = SCHED.find((s) => s.ms > now);
    if (next) {
      rows = SCHED.filter((s) => s.dateKey === next.dateKey);
      isToday = false;
    }
  }
  const dayLabel = rows.length > 0 ? longFmt.format(rows[0].ms) : '';

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Partidos del Mundial 2026 · ${dayLabel}`,
    url: localeUrl(locale, '/2026/partidos-hoy'),
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${TEAMS_2026[r.f.home ?? '']?.name ?? r.f.home ?? '?'} - ${TEAMS_2026[r.f.away ?? '']?.name ?? r.f.away ?? '?'}`,
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          itemListLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Partidos de hoy', path: '/2026/partidos-hoy' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1000px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/calendario')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Calendario completo
        </Link>

        <div className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Radio className="h-4 w-4" />
          {isToday ? 'En directo · hoy' : 'Próxima jornada'}
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Partidos de hoy<br />del Mundial 2026
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          {rows.length > 0 ? (
            <>
              {isToday ? 'Hoy' : 'El'} <strong className="text-[var(--color-fg)]">{dayLabel}</strong> se juegan{' '}
              <strong className="text-[var(--color-fg)]">{rows.length}</strong> partido{rows.length === 1 ? '' : 's'} del
              Mundial 2026. Horarios en hora de España, resultados en vivo y dónde verlos. Se actualiza solo.
            </>
          ) : (
            'No hay partidos programados próximamente.'
          )}
        </p>
      </header>

      <section className="mx-auto mt-10 w-full max-w-[1000px] px-6 md:px-10">
        <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
          {rows.map(({ f, ms }) => {
            const sc = scoreMap.get(scoreKey(f.home, f.away));
            const played = sc && sc.state !== 'pre' && sc.homeScore !== null && sc.awayScore !== null;
            const live = sc?.state === 'in';
            const stage = f.stage.length === 1 ? `Grupo ${f.stage}` : (STAGE_LABEL[f.stage] ?? f.stage);
            const mov = getMovistarLink(f.home && f.away ? `ver-${f.home.toLowerCase()}-${f.away.toLowerCase()}-tv-mundial-2026` : '');
            return (
              <li key={f.n} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:gap-5 md:px-6">
                <div className="flex items-center justify-between gap-3 md:w-40 md:shrink-0 md:flex-col md:items-start md:gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">{stage}</span>
                  {live ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-flame)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-flame)] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-flame)]" />
                      </span>
                      {sc!.clock || 'EN VIVO'}
                    </span>
                  ) : played ? (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">Final</span>
                  ) : (
                    <span className="font-mono text-xs tab-num text-[var(--color-fg-muted)]">{timeFmt.format(ms)} h</span>
                  )}
                </div>

                <div className="flex flex-1 items-center gap-3 font-display uppercase">
                  <Team code={f.home} label={f.label} align="end" />
                  <span className="shrink-0 px-1">
                    {played ? (
                      <span className="tab-num text-2xl text-[var(--color-fg)]">
                        {sc!.homeScore}<span className="mx-1 text-[var(--color-fg-subtle)]">-</span>{sc!.awayScore}
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--color-fg-subtle)]">vs</span>
                    )}
                  </span>
                  <Team code={f.away} align="start" />
                </div>

                <a
                  href={mov.href}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  <Tv className="h-3.5 w-3.5" /> Dónde ver
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale as Locale, '/2026/calendario')}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            <CalendarDays className="h-4 w-4" /> Calendario completo
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/2026/grupos')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Grupos y clasificación
          </Link>
        </div>
      </section>

      <div className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10">
        <MovistarStrip />
      </div>
    </article>
  );
}
