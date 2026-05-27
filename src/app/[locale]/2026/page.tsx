import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, MapPin, Trophy } from 'lucide-react';
import { Countdown } from '@/components/home/countdown';
import { getTournament } from '@/lib/tournaments';
import { getAllVenues } from '@/lib/data/venues';
import { routing, type Locale } from '@/i18n/routing';
import { VENUES_2026, HOSTS, GROUPS_2026, PHASE_DATES, WC_2026, TEAMS_2026 } from '@/lib/wc-2026';
import { countryName } from '@/lib/country-names';
import { WC2026Calendar } from '@/components/edition/wc2026-calendar';
import { WC2026Bracket } from '@/components/edition/wc2026-bracket';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// ─── Copy por idioma ────────────────────────────────────────────
type PageCopy = {
  keywords: readonly string[];
  edition: string;
  heroCountry1: string;
  heroSubtitle: string;
  hostsKicker: string;
  hostsH2: string;
  hostsCities: string;
  hostsMatches: string;
  venuesKicker: string;
  venuesH2: string;
  venuesCta1: string;
  venuesCta2: string;
  groupsKicker: string;
  groupsH2: string;
  groupsLead: string;
  groupsCta1: string;
  groupsCta2: string;
  groupLabel: string;
  groupTbd: string;
  phaseKicker: string;
  phaseH2: string;
  phases: ReadonlyArray<{ label: string; dates: string; count: string; highlight?: boolean }>;
  phaseFinalBadge: string;
  faqKicker: string;
  faqH2: string;
  faq: ReadonlyArray<{ q: string; a: string }>;
  ctas: ReadonlyArray<{ href: string; label: string; primary?: boolean }>;
  eventDescription: string;
  breadcrumb: { home: string; wc: string };
};

const COPY: Record<string, PageCopy> = {
  es: {
    keywords: [
      'Mundial 2026',
      'Mundial 2026 calendario',
      'Mundial 2026 fechas',
      'Mundial 2026 horarios',
      'Mundial 2026 grupos',
      'Mundial 2026 sedes',
      'Mundial 2026 estadios',
      'cuándo empieza Mundial 2026',
      'cuándo es la final Mundial 2026',
      'Estados Unidos México Canadá',
    ],
    edition: '23ᵃ edición · 11 junio → 19 julio 2026',
    heroCountry1: 'Norteamérica',
    heroSubtitle: '48 selecciones. 104 partidos. 16 ciudades. 3 países. El primer Mundial del nuevo formato.',
    hostsKicker: 'Tres sedes',
    hostsH2: 'Un Mundial a tres bandas',
    hostsCities: 'Ciudades',
    hostsMatches: 'Partidos',
    venuesKicker: '16 sedes',
    venuesH2: 'Los estadios',
    venuesCta1: 'Guías de viaje por sede',
    venuesCta2: 'Todos los estadios',
    groupsKicker: 'Los 12 grupos · A, L',
    groupsH2: 'Cada grupo, 4 selecciones',
    groupsLead: 'Los clasifican los 2 primeros + los 8 mejores terceros, avanzando a una R32 inédita en Mundiales. México abre el torneo en el Grupo A, Canadá juega en B y Estados Unidos en D.',
    groupsCta1: 'Todos los grupos',
    groupsCta2: 'Calendario por fase',
    groupLabel: 'Grupo',
    groupTbd: 'por decidir',
    phaseKicker: 'Calendario · 38 días',
    phaseH2: 'Fases del torneo',
    phases: [
      { label: 'Fase de grupos', dates: '11, 27 jun', count: '72 partidos' },
      { label: 'R32 (nueva)', dates: '28 jun, 3 jul', count: '16 partidos' },
      { label: 'Octavos / Cuartos', dates: '4, 11 jul', count: '12 partidos' },
      { label: 'Semifinales', dates: '14, 15 jul', count: '2 partidos' },
      { label: 'Tercero / Final', dates: '18 y 19 jul', count: '2 partidos', highlight: true },
    ],
    phaseFinalBadge: 'Final · MetLife Stadium · Nueva York',
    faqKicker: 'Preguntas frecuentes · Mundial 2026',
    faqH2: 'Lo que más se busca sobre el Mundial 2026',
    faq: [
      { q: '¿Cuándo empieza el Mundial 2026?', a: 'El Mundial 2026 se inaugura el jueves 11 de junio de 2026 con el partido México-Sudáfrica en el Estadio Azteca de Ciudad de México (13:00 hora local).' },
      { q: '¿Cuándo es la final del Mundial 2026?', a: 'La final del Mundial 2026 se jugará el domingo 19 de julio de 2026 en el MetLife Stadium de Nueva Jersey (15:00 ET).' },
      { q: '¿Dónde se juega el Mundial 2026?', a: 'El Mundial 2026 se disputa en 16 estadios repartidos por tres países: 11 en Estados Unidos, 3 en México (Azteca, Akron y BBVA) y 2 en Canadá (BMO Field de Toronto y BC Place de Vancouver).' },
      { q: '¿Cuántas selecciones participan en el Mundial 2026?', a: 'Por primera vez en la historia, 48 selecciones disputan la fase final, repartidas en 12 grupos de 4 equipos. Antes eran 32.' },
      { q: '¿En qué grupo está España en el Mundial 2026?', a: 'España juega en el Grupo H junto a Uruguay, Arabia Saudí y Cabo Verde. Debuta el 15 de junio contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta.' },
      { q: '¿Cuántos partidos se juegan en el Mundial 2026?', a: 'Se disputan 104 partidos en total: 72 de fase de grupos, 16 de dieciseisavos, 8 de octavos, 4 de cuartos, 2 semifinales, el partido por el tercer puesto y la final.' },
    ],
    ctas: [
      { href: '/2026/donde-ver', label: 'Dónde ver el Mundial 2026', primary: true },
      { href: '/2026/entradas', label: 'Entradas' },
      { href: '/2026/convocatorias', label: 'Convocatorias' },
      { href: '/2026/listas', label: 'Listas 48 selecciones' },
      { href: '/2026/mascotas', label: 'Mascotas' },
      { href: '/2026/fan-zone', label: 'Fan zone' },
      { href: '/coleccionismo/panini-mundial-2026', label: 'Panini 2026' },
      { href: '/ediciones/2026-norteamerica', label: 'Ficha completa' },
    ],
    eventDescription: 'Primer Mundial con 48 selecciones, organizado por Estados Unidos, México y Canadá del 11 de junio al 19 de julio de 2026.',
    breadcrumb: { home: 'Inicio', wc: 'Mundial 2026' },
  },
  en: {
    keywords: [
      'World Cup 2026',
      '2026 World Cup schedule',
      '2026 World Cup dates',
      '2026 World Cup kick-off times',
      '2026 World Cup groups',
      '2026 World Cup venues',
      '2026 World Cup stadiums',
      'when does the World Cup 2026 start',
      'when is the World Cup 2026 final',
      'United States Mexico Canada',
    ],
    edition: '23rd edition · 11 June → 19 July 2026',
    heroCountry1: 'North America',
    heroSubtitle: '48 nations. 104 matches. 16 cities. 3 countries. The first World Cup of the new format.',
    hostsKicker: 'Three hosts',
    hostsH2: 'A World Cup across three nations',
    hostsCities: 'Cities',
    hostsMatches: 'Matches',
    venuesKicker: '16 venues',
    venuesH2: 'The stadiums',
    venuesCta1: 'Host-city travel guides',
    venuesCta2: 'All stadiums',
    groupsKicker: 'The 12 groups · A to L',
    groupsH2: '4 nations per group',
    groupsLead: 'The top two of each group plus the eight best third-placed teams advance to a brand-new Round of 32. Mexico opens the tournament in Group A, Canada plays in B and the United States in D.',
    groupsCta1: 'All groups',
    groupsCta2: 'Schedule by phase',
    groupLabel: 'Group',
    groupTbd: 'TBD',
    phaseKicker: 'Schedule · 38 days',
    phaseH2: 'Tournament phases',
    phases: [
      { label: 'Group stage', dates: 'Jun 11 – Jun 27', count: '72 matches' },
      { label: 'Round of 32 (new)', dates: 'Jun 28 – Jul 3', count: '16 matches' },
      { label: 'R16 / Quarter-finals', dates: 'Jul 4 – Jul 11', count: '12 matches' },
      { label: 'Semi-finals', dates: 'Jul 14 – Jul 15', count: '2 matches' },
      { label: '3rd-place / Final', dates: 'Jul 18 and Jul 19', count: '2 matches', highlight: true },
    ],
    phaseFinalBadge: 'Final · MetLife Stadium · New York',
    faqKicker: 'FAQ · 2026 World Cup',
    faqH2: 'Most searched questions on the 2026 World Cup',
    faq: [
      { q: 'When does the 2026 World Cup start?', a: 'The 2026 World Cup kicks off on Thursday, June 11, 2026 with Mexico vs South Africa at Estadio Azteca in Mexico City (1:00 PM local time).' },
      { q: 'When is the 2026 World Cup final?', a: 'The 2026 World Cup final is scheduled for Sunday, July 19, 2026 at MetLife Stadium in New Jersey (3:00 PM ET).' },
      { q: 'Where is the 2026 World Cup played?', a: 'The 2026 World Cup is staged across 16 stadiums in three countries: 11 in the United States, 3 in Mexico (Azteca, Akron and BBVA) and 2 in Canada (BMO Field in Toronto and BC Place in Vancouver).' },
      { q: 'How many teams play the 2026 World Cup?', a: 'For the first time in history, 48 national teams compete in the finals, split into 12 groups of 4. The previous format had 32 teams.' },
      { q: 'Which group is Spain in for the 2026 World Cup?', a: 'Spain plays in Group H alongside Uruguay, Saudi Arabia and Cape Verde. La Roja debut on June 15 against Cape Verde at Mercedes-Benz Stadium in Atlanta.' },
      { q: 'How many matches are played at the 2026 World Cup?', a: '104 matches in total: 72 in the group stage, 16 in the Round of 32, 8 Round of 16, 4 quarter-finals, 2 semi-finals, the third-place play-off and the final.' },
    ],
    ctas: [
      { href: '/2026/donde-ver', label: 'Where to watch the 2026 World Cup', primary: true },
      { href: '/2026/entradas', label: 'Tickets' },
      { href: '/2026/convocatorias', label: 'Squad announcements' },
      { href: '/2026/listas', label: '48 team rosters' },
      { href: '/2026/mascotas', label: 'Mascots' },
      { href: '/2026/fan-zone', label: 'Fan Zone' },
      { href: '/coleccionismo/panini-mundial-2026', label: 'Panini 2026' },
      { href: '/ediciones/2026-norteamerica', label: 'Full profile' },
    ],
    eventDescription: 'First 48-team World Cup, co-hosted by the United States, Mexico and Canada from 11 June to 19 July 2026.',
    breadcrumb: { home: 'Home', wc: 'World Cup 2026' },
  },
};

const AVAILABLE: readonly string[] = ['es', 'en'];

function copyFor(locale: string): PageCopy {
  return COPY[locale] ?? COPY.es;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.wc2026' });
  const c = copyFor(locale);
  return pageMetadata({
    locale,
    path: '/2026',
    title: t('title'),
    description: t('description'),
    keywords: [...c.keywords],
    availableLocales: AVAILABLE,
  });
}

export default async function NorthAmerica2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getTournament(2026)!;
  const c = copyFor(locale);

  // Pull venue hero images from DB
  const allVenues = await getAllVenues();
  const venueImages = new Map(
    allVenues.map((v) => [v.slug, v.hero_image_url]),
  );

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: locale === 'en' ? 'FIFA World Cup 2026' : 'Copa Mundial de la FIFA 2026',
    alternateName: ['FIFA World Cup 2026', 'Mundial 2026'],
    sport: 'Football (Association)',
    startDate: WC_2026.kickoff,
    endDate: WC_2026.final,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: HOSTS.map((h) => ({
      '@type': 'Country',
      name: h.name,
    })),
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: localeUrl(locale, '/2026'),
    inLanguage: locale,
    description: c.eventDescription,
  };

  // FAQPage schema, preguntas de alto volumen relacionadas con el Mundial 2026.
  // Las respuestas también se renderizan visualmente abajo (FAQ visible).
  const faq = c.faq;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div>
      <JsonLd
        data={[
          eventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: c.breadcrumb.home, path: '/' },
            { name: c.breadcrumb.wc, path: '/2026' },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 50% at 50% 0%, ${t.palette.from}55 0%, transparent 60%), radial-gradient(40% 60% at 90% 10%, ${t.palette.to}55 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {c.edition}
          </div>
          <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.88]">
            <span className="block text-[var(--color-fg)]">{c.heroCountry1}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${t.palette.from}, ${t.palette.to})` }}
            >
              2026
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-fg-muted)] md:text-2xl">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      <Countdown />

      {/* Host countries */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {c.hostsKicker}
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {c.hostsH2}
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {HOSTS.map((h) => (
            <div key={h.code} className="relative overflow-hidden bg-[var(--color-bg-2)] p-8 md:p-10">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{ background: `radial-gradient(80% 60% at 50% 0%, ${h.accent} 0%, transparent 80%)` }}
              />
              <div className="relative">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl">{h.flag}</span>
                  <span className="font-display text-4xl uppercase leading-none">{h.name}</span>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      {c.hostsCities}
                    </div>
                    <div className="mt-1 font-display text-5xl tab-num">{h.cityCount}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      {c.hostsMatches}
                    </div>
                    <div className="mt-1 font-display text-5xl tab-num">{h.matchCount}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 16 venues grid */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {c.venuesKicker}
            </div>
            <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
              {c.venuesH2}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {c.venuesCta1}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/estadios')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {c.venuesCta2}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {VENUES_2026.map((v) => {
            const img = venueImages.get(v.slug);
            return (
              <Link
                key={v.slug}
                href={withLocale(locale as Locale, `/estadios/${v.slug}`)}
                className="group relative aspect-[4/5] flex flex-col justify-end overflow-hidden bg-[var(--color-bg)]"
              >
                {img && (
                  <Image
                    src={img}
                    alt={v.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-pitch)]">
                    {v.country} · {v.hostCity}
                  </div>
                  <div className="mt-1 font-display text-lg uppercase leading-tight text-white">
                    {v.name}
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-white/60">
                    {v.capacity.toLocaleString()} · {v.role}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 12 groups */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {c.groupsKicker}
            </div>
            <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
              {c.groupsH2}
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
              {c.groupsLead}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {c.groupsCta1}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {c.groupsCta2}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {GROUPS_2026.map((g) => (
            <Link
              key={g.letter}
              href={withLocale(locale as Locale, `/2026/grupo/${g.letter}`)}
              className="group flex flex-col gap-3 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl uppercase text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                  {g.letter}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  {c.groupLabel}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm">
                {g.teams.map((code, i) => {
                  const team = code ? TEAMS_2026[code] : null;
                  return (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                        {i + 1}.
                      </span>
                      {code ? (
                        <>
                          {team?.flag && (
                            <span aria-hidden className="text-base leading-none">
                              {team.flag}
                            </span>
                          )}
                          <span className="text-[var(--color-fg)]">
                            {countryName(code)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--color-fg-subtle)] italic">
                          {c.groupTbd}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* Phase timeline */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {c.phaseKicker}
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {c.phaseH2}
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] overflow-hidden rounded-3xl border border-[var(--color-border)] md:grid-cols-5">
          {c.phases.map((p) => (
            <Phase key={p.label} label={p.label} dates={p.dates} count={p.count} highlight={p.highlight} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-6 py-4">
            <Trophy className="h-5 w-5 text-[var(--color-pitch)]" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)]">
              {c.phaseFinalBadge}
            </span>
          </div>
        </div>
      </section>

      <WC2026Bracket />
      <WC2026Calendar locale={locale as Locale} />

      {/* FAQ, preguntas de alto volumen sobre el Mundial 2026.
          Empareja con FAQPage JSON-LD para captar Rich Snippets. */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-20 md:px-10 md:py-28">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {c.faqKicker}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {c.faqH2}
        </h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {faq.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-8 pb-24 flex flex-wrap justify-center gap-3">
        {c.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={withLocale(locale as Locale, cta.href)}
            className={
              cta.primary
                ? 'group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90'
                : 'group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]'
            }
          >
            {cta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function Phase({
  label,
  dates,
  count,
  highlight,
}: {
  label: string;
  dates: string;
  count: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-6"
      style={{
        background: highlight ? 'color-mix(in oklch, var(--color-pitch) 8%, var(--color-bg-2))' : 'var(--color-bg-2)',
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: highlight ? 'var(--color-pitch)' : 'var(--color-fg-subtle)' }}
      >
        {dates}
      </div>
      <div className="font-display text-xl uppercase text-[var(--color-fg)]">{label}</div>
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        <MapPin className="h-3 w-3" />
        {count}
      </div>
    </div>
  );
}
