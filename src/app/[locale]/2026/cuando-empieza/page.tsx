import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarClock, Clock, MapPin, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Landing micro-SEO para la query "cuándo empieza el Mundial 2026"
 * (y su equivalente "when does the World Cup 2026 start").
 */

type Copy = {
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  back: string;
  kickerDates: string;
  h1: string;
  intro: React.ReactNode;
  kickerKickoff: string;
  h2Kickoff: string;
  utcNote: string;
  kickerKey: string;
  h2Key: string;
  kickerSpain: string;
  h2Spain: string;
  spainIntro: React.ReactNode;
  spainCta1: string;
  spainCta2: string;
  h2Summary: string;
  summary: Record<string, { label: string; value: string }>;
  h2FollowUp: string;
  follow: ReadonlyArray<{ href: string; label: string }>;
  footnote: string;
  cities: ReadonlyArray<{ key: string; label: string; date: string }>;
  keyDates: ReadonlyArray<{ label: string; date: string; detail: string }>;
  faq: ReadonlyArray<{ q: string; a: string }>;
  eventDescription: string;
  breadcrumbCuandoEmpieza: string;
  countries: ReadonlyArray<string>;
};

const COPY: Record<string, Copy> = {
  es: {
    metaTitle:
      '¿Cuándo empieza el Mundial 2026? Fechas, horario por país y partido inaugural · 11 jun – 19 jul',
    metaDescription:
      'El Mundial 2026 empieza el jueves 11 de junio de 2026. Partido inaugural: México-Sudáfrica en el Estadio Azteca a las 13:00 hora de Ciudad de México (21:00 hora de Madrid). La final se juega el 19 de julio en MetLife Stadium. Calendario, horario por zona y debut de España, Argentina y todas las selecciones.',
    keywords: [
      'cuando empieza el Mundial 2026',
      'qué día empieza el Mundial de fútbol',
      'cuando comienza el Mundial 2026',
      'partido inaugural Mundial 2026',
      'primer partido España Mundial 2026',
      'final Mundial 2026 fecha',
      'when does the World Cup 2026 start',
    ],
    back: 'Mundial 2026',
    kickerDates: 'Fechas del torneo',
    h1: '¿Cuándo empieza el Mundial 2026?',
    intro: (
      <>
        El Mundial empieza el <strong className="text-[var(--color-fg)]">jueves 11 de junio de 2026</strong> con el partido inaugural <strong>México-Sudáfrica</strong> en el Estadio Azteca de Ciudad de México a las <strong>13:00 hora local</strong> (21:00 hora de Madrid). El torneo termina el <strong>domingo 19 de julio</strong> con la final en el MetLife Stadium de Nueva Jersey.
      </>
    ),
    kickerKickoff: 'Partido inaugural · 11 jun 2026',
    h2Kickoff: 'México-Sudáfrica · Estadio Azteca · hora por ciudad',
    utcNote: 'El kickoff es a las 13:00 hora de Ciudad de México (UTC -6).',
    kickerKey: 'Fechas clave',
    h2Key: 'Calendario completo del Mundial 2026',
    kickerSpain: 'España en el Mundial 2026',
    h2Spain: '¿Cuándo juega España su primer partido?',
    spainIntro: (
      <>
        España debuta el <strong className="text-[var(--color-fg)]">lunes 15 de junio</strong> en el <strong>Mercedes-Benz Stadium de Atlanta</strong> contra <strong>Cabo Verde</strong> a las <strong>18:00 hora de Madrid</strong> (12:00 hora del Este de EE. UU.). Después se enfrenta a Arabia Saudí (Filadelfia, 20 de junio) y cierra la fase de grupos contra Uruguay (Guadalajara, 25 de junio). España está en el Grupo H.
      </>
    ),
    spainCta1: 'Calendario completo de España',
    spainCta2: 'Ver el Grupo H completo',
    h2Summary: 'Resumen rápido',
    summary: {
      start: { label: 'Inicio', value: '11 jun 2026' },
      final: { label: 'Final', value: '19 jul 2026' },
      teams: { label: 'Selecciones', value: '48 (récord)' },
      matches: { label: 'Partidos', value: '104' },
      duration: { label: 'Duración', value: '39 días' },
      venues: { label: 'Sedes', value: '16 ciudades' },
      countries: { label: 'Países', value: 'USA · Canadá · México' },
      finalAt: { label: 'Final en', value: 'MetLife (NJ)' },
    },
    h2FollowUp: 'Sigue por aquí',
    follow: [
      { href: '/2026/calendario', label: 'Calendario completo' },
      { href: '/2026/grupos', label: 'Grupos' },
      { href: '/2026/sedes', label: 'Sedes' },
      { href: '/2026/donde-ver', label: 'Dónde ver' },
      { href: '/2026/entradas', label: 'Entradas' },
    ],
    footnote: 'Fuente: FIFA · zona horaria del kickoff confirmada por la FMF y la FIFA.',
    cities: [
      { key: 'mad', label: 'Madrid', date: '11 jun 2026 · 21:00' },
      { key: 'cdmx', label: 'Ciudad de México', date: '11 jun 2026 · 13:00' },
      { key: 'bue', label: 'Buenos Aires', date: '11 jun 2026 · 16:00' },
      { key: 'bog', label: 'Bogotá', date: '11 jun 2026 · 14:00' },
      { key: 'nyc', label: 'Nueva York', date: '11 jun 2026 · 15:00' },
      { key: 'lax', label: 'Los Ángeles', date: '11 jun 2026 · 12:00' },
      { key: 'tyo', label: 'Tokio', date: '12 jun 2026 · 04:00' },
      { key: 'syd', label: 'Sídney', date: '12 jun 2026 · 05:00' },
    ],
    keyDates: [
      { label: 'Sorteo del Mundial', date: '5 dic 2025', detail: 'Kennedy Center, Washington D.C. — 48 selecciones reparten en 12 grupos.' },
      { label: 'Partido inaugural', date: '11 jun 2026', detail: 'México vs Sudáfrica · Estadio Azteca (Ciudad de México) · 13:00 hora local.' },
      { label: 'Fin de fase de grupos', date: '27 jun 2026', detail: 'Última jornada del Grupo L (Inglaterra · Croacia · Ghana · Panamá).' },
      { label: 'Inicio de dieciseisavos', date: '29 jun 2026', detail: 'Primera ronda eliminatoria de la historia del Mundial (formato 48 equipos).' },
      { label: 'Octavos', date: '4-7 jul 2026', detail: 'Ocho partidos clasificatorios para cuartos.' },
      { label: 'Cuartos de final', date: '9-11 jul 2026', detail: 'Cuatro partidos. AT&T Stadium (Dallas), Mercedes-Benz Stadium (Atlanta), Hard Rock Stadium (Miami), Gillette Stadium (Boston).' },
      { label: 'Semifinales', date: '14-15 jul 2026', detail: 'AT&T Stadium (Dallas) y MetLife Stadium (Nueva Jersey).' },
      { label: 'Tercer puesto', date: '18 jul 2026', detail: 'Hard Rock Stadium (Miami).' },
      { label: 'FINAL', date: '19 jul 2026', detail: 'MetLife Stadium (East Rutherford, Nueva Jersey) · 15:00 hora del Este USA · 21:00 hora de Madrid.' },
    ],
    faq: [
      { q: '¿Cuándo empieza el Mundial 2026?', a: 'El Mundial 2026 empieza el jueves 11 de junio de 2026 con el partido inaugural México-Sudáfrica en el Estadio Azteca de Ciudad de México a las 13:00 hora local (21:00 hora de Madrid).' },
      { q: '¿Cuándo es la final del Mundial 2026?', a: 'La final del Mundial 2026 se juega el domingo 19 de julio de 2026 en el MetLife Stadium de East Rutherford, Nueva Jersey. La hora de inicio es las 15:00 hora del Este de Estados Unidos (21:00 hora de Madrid).' },
      { q: '¿Cuándo juega España su primer partido en el Mundial 2026?', a: 'España debuta en el Mundial 2026 el lunes 15 de junio de 2026 en el Mercedes-Benz Stadium de Atlanta contra Cabo Verde, dentro del Grupo H. España juega también contra Arabia Saudí (Filadelfia, 20 de junio) y Uruguay (Guadalajara, 25 de junio) en la fase de grupos.' },
      { q: '¿Cuántos partidos tiene el Mundial 2026?', a: 'El Mundial 2026 tiene 104 partidos, frente a los 64 de Catar 2022. Es el primer Mundial con 48 selecciones, divididas en 12 grupos de 4. Pasan a dieciseisavos los dos primeros de cada grupo más los 8 mejores terceros.' },
      { q: '¿En qué países se juega el Mundial 2026?', a: 'El Mundial 2026 se juega en 16 sedes repartidas entre Estados Unidos (11 sedes), Canadá (2 sedes: Toronto y Vancouver) y México (3 sedes: Ciudad de México, Guadalajara y Monterrey). Es el primer Mundial organizado por tres países anfitriones.' },
    ],
    eventDescription: 'El Mundial 2026 se juega del 11 de junio al 19 de julio de 2026 en Estados Unidos, Canadá y México con 48 selecciones por primera vez en la historia.',
    breadcrumbCuandoEmpieza: 'Cuándo empieza',
    countries: ['Estados Unidos', 'Canadá', 'México'],
  },
  en: {
    metaTitle:
      'When does the 2026 World Cup start? Dates, kick-off times by country and opening match · Jun 11 – Jul 19',
    metaDescription:
      'The 2026 World Cup starts on Thursday, June 11, 2026. Opening match: Mexico vs South Africa at Estadio Azteca at 1:00 PM Mexico City time (9:00 PM Madrid). The final is on July 19 at MetLife Stadium. Schedule, kick-off times by city and the debuts of Spain, Argentina, England and every nation.',
    keywords: [
      'when does the World Cup 2026 start',
      '2026 World Cup start date',
      '2026 World Cup opening match',
      '2026 World Cup final date',
      'World Cup 2026 schedule',
      'World Cup 2026 kickoff time',
      'England first match 2026 World Cup',
    ],
    back: 'World Cup 2026',
    kickerDates: 'Tournament dates',
    h1: 'When does the 2026 World Cup start?',
    intro: (
      <>
        The World Cup kicks off on <strong className="text-[var(--color-fg)]">Thursday, June 11, 2026</strong> with the opening match <strong>Mexico vs South Africa</strong> at Estadio Azteca in Mexico City at <strong>1:00 PM local time</strong> (9:00 PM Madrid). The tournament ends on <strong>Sunday, July 19</strong> with the final at MetLife Stadium in New Jersey.
      </>
    ),
    kickerKickoff: 'Opening match · Jun 11, 2026',
    h2Kickoff: 'Mexico vs South Africa · Estadio Azteca · kick-off times by city',
    utcNote: 'Kick-off is at 1:00 PM Mexico City time (UTC -6).',
    kickerKey: 'Key dates',
    h2Key: 'Full 2026 World Cup schedule',
    kickerSpain: 'Spain at the 2026 World Cup',
    h2Spain: 'When does Spain play its opener?',
    spainIntro: (
      <>
        Spain debut on <strong className="text-[var(--color-fg)]">Monday, June 15</strong> at <strong>Mercedes-Benz Stadium in Atlanta</strong> against <strong>Cape Verde</strong> at <strong>12:00 PM ET</strong> (6:00 PM Madrid). Next come Saudi Arabia (Philadelphia, June 20) and Uruguay (Guadalajara, June 25) to close the group stage. Spain is in Group H.
      </>
    ),
    spainCta1: 'Spain full schedule',
    spainCta2: 'See full Group H',
    h2Summary: 'Quick summary',
    summary: {
      start: { label: 'Start', value: 'Jun 11, 2026' },
      final: { label: 'Final', value: 'Jul 19, 2026' },
      teams: { label: 'Teams', value: '48 (record)' },
      matches: { label: 'Matches', value: '104' },
      duration: { label: 'Duration', value: '39 days' },
      venues: { label: 'Venues', value: '16 host cities' },
      countries: { label: 'Countries', value: 'USA · Canada · Mexico' },
      finalAt: { label: 'Final at', value: 'MetLife (NJ)' },
    },
    h2FollowUp: 'Carry on with',
    follow: [
      { href: '/2026/calendario', label: 'Full schedule' },
      { href: '/2026/grupos', label: 'Groups' },
      { href: '/2026/sedes', label: 'Host cities' },
      { href: '/2026/donde-ver', label: 'Where to watch' },
      { href: '/2026/entradas', label: 'Tickets' },
    ],
    footnote: 'Source: FIFA · kick-off time zone confirmed by FMF and FIFA.',
    cities: [
      { key: 'mad', label: 'Madrid', date: 'Jun 11, 2026 · 9:00 PM' },
      { key: 'cdmx', label: 'Mexico City', date: 'Jun 11, 2026 · 1:00 PM' },
      { key: 'bue', label: 'Buenos Aires', date: 'Jun 11, 2026 · 4:00 PM' },
      { key: 'bog', label: 'Bogotá', date: 'Jun 11, 2026 · 2:00 PM' },
      { key: 'nyc', label: 'New York', date: 'Jun 11, 2026 · 3:00 PM' },
      { key: 'lax', label: 'Los Angeles', date: 'Jun 11, 2026 · 12:00 PM' },
      { key: 'tyo', label: 'Tokyo', date: 'Jun 12, 2026 · 4:00 AM' },
      { key: 'syd', label: 'Sydney', date: 'Jun 12, 2026 · 5:00 AM' },
    ],
    keyDates: [
      { label: 'Final draw', date: 'Dec 5, 2025', detail: 'Kennedy Center, Washington D.C. — 48 teams drawn into 12 groups.' },
      { label: 'Opening match', date: 'Jun 11, 2026', detail: 'Mexico vs South Africa · Estadio Azteca (Mexico City) · 1:00 PM local.' },
      { label: 'End of group stage', date: 'Jun 27, 2026', detail: 'Last matchday of Group L (England · Croatia · Ghana · Panama).' },
      { label: 'Round of 32 begins', date: 'Jun 29, 2026', detail: 'First-ever knockout round of 32 in World Cup history (48-team format).' },
      { label: 'Round of 16', date: 'Jul 4-7, 2026', detail: 'Eight matches to determine the quarter-finalists.' },
      { label: 'Quarter-finals', date: 'Jul 9-11, 2026', detail: 'Four matches. AT&T Stadium (Dallas), Mercedes-Benz Stadium (Atlanta), Hard Rock Stadium (Miami), Gillette Stadium (Boston).' },
      { label: 'Semi-finals', date: 'Jul 14-15, 2026', detail: 'AT&T Stadium (Dallas) and MetLife Stadium (New Jersey).' },
      { label: 'Third-place play-off', date: 'Jul 18, 2026', detail: 'Hard Rock Stadium (Miami).' },
      { label: 'FINAL', date: 'Jul 19, 2026', detail: 'MetLife Stadium (East Rutherford, New Jersey) · 3:00 PM ET · 9:00 PM Madrid.' },
    ],
    faq: [
      { q: 'When does the 2026 World Cup start?', a: 'The 2026 World Cup starts on Thursday, June 11, 2026 with the opening match Mexico vs South Africa at Estadio Azteca in Mexico City at 1:00 PM local time (9:00 PM Madrid).' },
      { q: 'When is the 2026 World Cup final?', a: 'The 2026 World Cup final is on Sunday, July 19, 2026 at MetLife Stadium in East Rutherford, New Jersey. Kick-off is 3:00 PM Eastern Time (9:00 PM Madrid).' },
      { q: 'When does Spain play its first match at the 2026 World Cup?', a: 'Spain debut on Monday, June 15, 2026 at Mercedes-Benz Stadium in Atlanta against Cape Verde in Group H. Spain also face Saudi Arabia (Philadelphia, June 20) and Uruguay (Guadalajara, June 25) in the group stage.' },
      { q: 'How many matches does the 2026 World Cup have?', a: 'The 2026 World Cup has 104 matches, up from 64 in Qatar 2022. It is the first World Cup with 48 teams, drawn into 12 groups of 4. The top two of every group plus the eight best third-placed sides advance to the Round of 32.' },
      { q: 'Which countries host the 2026 World Cup?', a: 'The 2026 World Cup is played across 16 host cities split between the United States (11), Canada (2: Toronto and Vancouver) and Mexico (3: Mexico City, Guadalajara and Monterrey). It is the first World Cup with three host nations.' },
    ],
    eventDescription: 'The 2026 World Cup is played from June 11 to July 19, 2026 across the United States, Canada and Mexico, with 48 national teams for the first time in history.',
    breadcrumbCuandoEmpieza: 'When does it start',
    countries: ['United States', 'Canada', 'Mexico'],
  },
};

const AVAILABLE: readonly string[] = ['es', 'en'];

function copyFor(locale: string): Copy {
  return COPY[locale] ?? COPY.es;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = copyFor(locale);
  return pageMetadata({
    locale,
    path: '/2026/cuando-empieza',
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: [...c.keywords],
    availableLocales: AVAILABLE,
  });
}

export default async function CuandoEmpiezaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = copyFor(locale);

  const sportsEventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: c.countries.map((name) => ({ '@type': 'Country', name })),
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    url: localeUrl(locale, '/2026/cuando-empieza'),
    inLanguage: locale,
    description: c.eventDescription,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          sportsEventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: locale === 'en' ? 'Home' : 'Inicio', path: '/' },
            { name: locale === 'en' ? 'World Cup 2026' : 'Mundial 2026', path: '/2026' },
            { name: c.breadcrumbCuandoEmpieza, path: '/2026/cuando-empieza' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {c.back}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CalendarClock className="h-4 w-4" />
          <span>{c.kickerDates}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">{c.h1}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">{c.intro}</p>
      </header>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Clock className="h-3 w-3" />
          <span>{c.kickerKickoff}</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">{c.h2Kickoff}</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {c.cities.map((city) => (
            <div key={city.key} className="bg-[var(--color-bg)] p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {city.label}
              </div>
              <div className="mt-2 font-display text-lg uppercase tab-num text-[var(--color-fg)]">
                {city.date}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">{c.utcNote}</p>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-3 w-3" />
          <span>{c.kickerKey}</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">{c.h2Key}</h2>
        <ul className="mt-6 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          {c.keyDates.map((k) => (
            <li key={k.label} className="grid gap-2 p-5 md:grid-cols-[180px_120px_1fr]">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {k.label}
              </div>
              <div className="font-display text-base uppercase tab-num text-[var(--color-fg)]">{k.date}</div>
              <div className="text-sm text-[var(--color-fg-muted)]">{k.detail}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="h-3 w-3" />
          <span>{c.kickerSpain}</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">{c.h2Spain}</h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">{c.spainIntro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale as Locale, '/selecciones/ESP/grupo-h')}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
          >
            {c.spainCta1} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/2026/grupo/H')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
          >
            {c.spainCta2} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">{c.h2Summary}</h2>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(c.summary).map(([k, v]) => (
            <div key={k} className="bg-[var(--color-bg)] p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">{v.label}</dt>
              <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">{v.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">{c.h2FollowUp}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {c.follow.map((f) => (
              <Link
                key={f.href}
                href={withLocale(locale as Locale, f.href)}
                className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          {c.footnote} URL: {SEO.siteUrl}/2026/cuando-empieza.
        </p>
      </section>
    </article>
  );
}
