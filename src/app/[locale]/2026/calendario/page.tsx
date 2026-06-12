import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Trophy } from 'lucide-react';
import {
  FIXTURES_2026,
  VENUES_2026,
  PHASE_DATES,
  getTeam2026,
  type Fixture26,
} from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.calendario' });
  return pageMetadata({
    locale,
    path: '/2026/calendario',
    title: t('title'),
    description: t('description'),
    availableLocales: ['es', 'en'],
    keywords:
      locale === 'en'
        ? [
            '2026 World Cup schedule',
            'World Cup 2026 fixtures',
            'World Cup 2026 dates and times',
            'World Cup 2026 group stage schedule',
            'World Cup 2026 knockout schedule',
            'World Cup 2026 final date',
            '104 matches World Cup 2026',
          ]
        : [
            'calendario Mundial 2026',
            'fechas Mundial 2026',
            'fase de grupos Mundial 2026',
            'octavos Mundial 2026',
            'cuartos Mundial 2026',
            'semifinales Mundial 2026',
            'final Mundial 2026',
            'horarios Mundial 2026',
          ],
  });
}

// Mapeo de fase a etiqueta y orden cronológico.
type PhaseGroup = {
  key: string;
  label: string;
  description: string;
  rangeStart: string;
  rangeEnd: string;
  fixtures: Fixture26[];
};

function buildPhases(t: (key: string) => string): PhaseGroup[] {
  const groupStage = FIXTURES_2026.filter(
    (f) => /^[A-L]$/.test(f.stage),
  );
  const r32 = FIXTURES_2026.filter((f) => f.stage === 'R32');
  const r16 = FIXTURES_2026.filter((f) => f.stage === 'R16');
  const qf = FIXTURES_2026.filter((f) => f.stage === 'QF');
  const sf = FIXTURES_2026.filter((f) => f.stage === 'SF');
  const tp = FIXTURES_2026.filter((f) => f.stage === '3P');
  const fin = FIXTURES_2026.filter((f) => f.stage === 'FINAL');

  return [
    { key: 'group',  label: t('phaseGroup'),  description: t('phaseGroupDesc'),  rangeStart: PHASE_DATES.groupStart,  rangeEnd: PHASE_DATES.groupEnd,    fixtures: groupStage },
    { key: 'r32',    label: t('phaseR32'),    description: t('phaseR32Desc'),    rangeStart: PHASE_DATES.r32Start,    rangeEnd: PHASE_DATES.r32End,      fixtures: r32 },
    { key: 'r16',    label: t('phaseR16'),    description: t('phaseR16Desc'),    rangeStart: PHASE_DATES.r16Start,    rangeEnd: PHASE_DATES.r16End,      fixtures: r16 },
    { key: 'qf',     label: t('phaseQF'),     description: t('phaseQFDesc'),     rangeStart: PHASE_DATES.qfStart,     rangeEnd: PHASE_DATES.qfEnd,       fixtures: qf },
    { key: 'sf',     label: t('phaseSF'),     description: t('phaseSFDesc'),     rangeStart: PHASE_DATES.sfStart,     rangeEnd: PHASE_DATES.sfEnd,       fixtures: sf },
    { key: '3p',     label: t('phase3P'),     description: t('phase3PDesc'),     rangeStart: PHASE_DATES.thirdPlace,  rangeEnd: PHASE_DATES.thirdPlace,  fixtures: tp },
    { key: 'final',  label: t('phaseFinal'),  description: t('phaseFinalDesc'),  rangeStart: PHASE_DATES.final,       rangeEnd: PHASE_DATES.final,       fixtures: fin },
  ];
}

// Fecha + hora de cada partido en hora de España (Europe/Madrid).
function madridParts(f: Fixture26, locale: string) {
  const ms = new Date(fixtureToUTC(f)).getTime();
  return {
    date: new Intl.DateTimeFormat(locale, {
      timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short',
    }).format(ms),
    time: new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(ms),
  };
}

function fmtRange(a: string, b: string, locale: string) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
  if (a === b) return fmt.format(da);
  return `${fmt.format(da)}, ${fmt.format(db)}`;
}

export default async function Calendario2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.calendario' });

  const phases = buildPhases(t);
  const venueBySlug = new Map(VENUES_2026.map((v) => [v.slug, v]));

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: locale === 'en' ? 'FIFA World Cup 2026' : 'Copa Mundial de la FIFA 2026',
    inLanguage: locale,
    sport: 'Football (Association)',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    location: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'Canada' },
    ],
    url: localeUrl(locale, '/2026/calendario'),
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          eventLd,
          breadcrumbLd(locale, [
            { name: locale === 'en' ? 'Home' : 'Inicio', path: '/' },
            { name: locale === 'en' ? 'World Cup 2026' : 'Mundial 2026', path: '/2026' },
            { name: locale === 'en' ? 'Schedule' : 'Calendario', path: '/2026/calendario' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
        </Link>

        <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('kicker')}
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('h1')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t('intro')}
        </p>
      </header>

      {/* Mini-índice de fases */}
      <nav className="mx-auto mt-12 w-full max-w-[1400px] px-6 md:px-10">
        <ul className="flex flex-wrap gap-2">
          {phases.map((p) => (
            <li key={p.key}>
              <a
                href={`#${p.key}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
              >
                {p.label}
                <span className="text-[var(--color-fg-subtle)]">
                  {p.fixtures.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        {phases.map((p) => (
          <section
            key={p.key}
            id={p.key}
            className="scroll-mt-32 border-t border-[var(--color-border)] py-14 md:py-20"
          >
            <div className="grid gap-10 md:grid-cols-[280px_1fr]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  <Calendar className="inline h-3 w-3 mr-2" />
                  {fmtRange(p.rangeStart, p.rangeEnd, locale)}
                </div>
                <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
                  {p.label}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {p.description}
                </p>
                <p className="mt-4 font-mono text-xs text-[var(--color-fg-subtle)]">
                  {t('matchesCount', { count: p.fixtures.length })}
                </p>
              </div>

              {p.fixtures.length === 0 ? (
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-sm text-[var(--color-fg-subtle)]">
                  {t('fixturesPending')}
                </div>
              ) : (
                <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
                  {p.fixtures.map((f) => {
                    const home = f.home ? getTeam2026(f.home) : undefined;
                    const away = f.away ? getTeam2026(f.away) : undefined;
                    const venue = venueBySlug.get(f.venue);
                    const m = madridParts(f, locale);
                    return (
                      <li key={f.n} className="bg-[var(--color-bg)]">
                        <div className="flex flex-col gap-3 p-5">
                          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                            <span>{m.date} · {m.time} h</span>
                            <span className="tab-num">#{f.n}</span>
                          </div>
                          <div className="flex items-center gap-3 font-display text-lg uppercase md:text-xl">
                            <span className="flex flex-1 items-center justify-end gap-2 truncate text-end">
                              {home ? (
                                <>
                                  {home.name}
                                  <span aria-hidden>{home.flag}</span>
                                </>
                              ) : (
                                <span className="text-[var(--color-fg-subtle)]">
                                  {f.label ?? '?'}
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-[var(--color-fg-subtle)]">
                              vs
                            </span>
                            <span className="flex flex-1 items-center gap-2 truncate">
                              {away ? (
                                <>
                                  <span aria-hidden>{away.flag}</span>
                                  {away.name}
                                </>
                              ) : (
                                <span className="text-[var(--color-fg-subtle)]">
                                  {f.label ?? '?'}
                                </span>
                              )}
                            </span>
                          </div>
                          {venue ? (
                            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                              <MapPin className="h-3 w-3" />
                              {venue.hostCity} · {venue.name}
                            </div>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

          </section>
        ))}
      </div>

      {/* CTA hub */}
      <section className="mx-auto mb-24 mt-12 w-full max-w-[1400px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Trophy className="inline h-3 w-3 mr-2" />
            {t('ctaMore')}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {locale === 'en' ? '12 groups' : '12 grupos'}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {locale === 'en' ? '16 host venues' : '16 sedes'}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/donde-ver')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {locale === 'en' ? 'Where to watch' : 'Dónde ver'}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/entradas')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {locale === 'en' ? 'Tickets' : 'Entradas'}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
