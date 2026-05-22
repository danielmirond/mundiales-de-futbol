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
 * Landing micro-SEO para la query "cuándo empieza el Mundial 2026".
 *
 * Esta página responde directamente a las búsquedas en alza:
 *  - "cuando empieza el mundial"
 *  - "qué día empieza el mundial de fútbol"
 *  - "cuando comienza el mundial de futbol 2026"
 *  - "when does the world cup start"
 *  - "cuándo es el primer partido de españa en el mundial"
 *
 * El countdown ya vive en /, pero esta URL canónica concentra el answer
 * para SEO y Discover, con FAQ schema y datos por país/zona horaria.
 */

const KICKOFF_UTC = '2026-06-11T18:00:00Z'; // 12pm CT, partido inaugural Azteca

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/cuando-empieza',
    title:
      '¿Cuándo empieza el Mundial 2026? Fechas, horario por país y partido inaugural · 11 jun – 19 jul',
    description:
      'El Mundial 2026 empieza el jueves 11 de junio de 2026. Partido inaugural: México-Sudáfrica en el Estadio Azteca a las 12:00 hora de Ciudad de México (20:00 hora de Madrid). La final se juega el 19 de julio en MetLife Stadium. Calendario, horario por zona y debut de España, Argentina y todas las selecciones.',
    keywords: [
      'cuando empieza el Mundial 2026',
      'qué día empieza el Mundial de fútbol',
      'cuando comienza el Mundial 2026',
      'partido inaugural Mundial 2026',
      'primer partido España Mundial 2026',
      'final Mundial 2026 fecha',
      'when does the World Cup 2026 start',
    ],
  });
}

const COUNTDOWN_TARGETS = [
  { city: 'Madrid', tz: 'Europe/Madrid', date: '11 jun 2026 · 20:00' },
  { city: 'Ciudad de México', tz: 'America/Mexico_City', date: '11 jun 2026 · 12:00' },
  { city: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires', date: '11 jun 2026 · 15:00' },
  { city: 'Bogotá', tz: 'America/Bogota', date: '11 jun 2026 · 13:00' },
  { city: 'Nueva York', tz: 'America/New_York', date: '11 jun 2026 · 14:00' },
  { city: 'Los Ángeles', tz: 'America/Los_Angeles', date: '11 jun 2026 · 11:00' },
  { city: 'Tokio', tz: 'Asia/Tokyo', date: '12 jun 2026 · 03:00' },
  { city: 'Sídney', tz: 'Australia/Sydney', date: '12 jun 2026 · 04:00' },
];

const KEY_DATES = [
  { label: 'Sorteo del Mundial', date: '5 dic 2025', detail: 'Kennedy Center, Washington D.C. — 48 selecciones reparten en 12 grupos.' },
  { label: 'Partido inaugural', date: '11 jun 2026', detail: 'México vs Sudáfrica · Estadio Azteca (Ciudad de México) · 12:00 hora local.' },
  { label: 'Fin de fase de grupos', date: '27 jun 2026', detail: 'Última jornada del Grupo L (Inglaterra · Croacia · Ghana · Panamá).' },
  { label: 'Inicio de dieciseisavos', date: '29 jun 2026', detail: 'Primera ronda eliminatoria de la historia del Mundial (formato 48 equipos).' },
  { label: 'Octavos', date: '4-7 jul 2026', detail: 'Ocho partidos clasificatorios para cuartos.' },
  { label: 'Cuartos de final', date: '9-11 jul 2026', detail: 'Cuatro partidos. AT&T Stadium (Dallas), Mercedes-Benz Stadium (Atlanta), Hard Rock Stadium (Miami), Gillette Stadium (Boston).' },
  { label: 'Semifinales', date: '14-15 jul 2026', detail: 'AT&T Stadium (Dallas) y MetLife Stadium (Nueva Jersey).' },
  { label: 'Tercer puesto', date: '18 jul 2026', detail: 'Hard Rock Stadium (Miami).' },
  { label: 'FINAL', date: '19 jul 2026', detail: 'MetLife Stadium (East Rutherford, Nueva Jersey) · 15:00 hora del Este USA · 21:00 hora de Madrid.' },
];

export default async function CuandoEmpiezaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sportsEventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: [
      { '@type': 'Country', name: 'Estados Unidos' },
      { '@type': 'Country', name: 'Canadá' },
      { '@type': 'Country', name: 'México' },
    ],
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: localeUrl(locale, '/2026/cuando-empieza'),
    description:
      'El Mundial 2026 se juega del 11 de junio al 19 de julio de 2026 en Estados Unidos, Canadá y México con 48 selecciones por primera vez en la historia.',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuándo empieza el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El Mundial 2026 empieza el jueves 11 de junio de 2026 con el partido inaugural México-Sudáfrica en el Estadio Azteca de Ciudad de México a las 12:00 hora local (20:00 hora de Madrid).',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuándo es la final del Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La final del Mundial 2026 se juega el domingo 19 de julio de 2026 en el MetLife Stadium de East Rutherford, Nueva Jersey. La hora de inicio es las 15:00 hora del Este de Estados Unidos (21:00 hora de Madrid).',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuándo juega España su primer partido en el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'España debuta en el Mundial 2026 el lunes 15 de junio de 2026 en el Soldier Field de Chicago contra Cabo Verde, dentro del Grupo H. España juega también contra Arabia Saudí (Atlanta, 20 de junio) y Uruguay (Filadelfia, 25 de junio) en la fase de grupos.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos partidos tiene el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El Mundial 2026 tiene 104 partidos, frente a los 64 de Catar 2022. Es el primer Mundial con 48 selecciones, divididas en 12 grupos de 4. Pasan a dieciseisavos los dos primeros de cada grupo más los 8 mejores terceros.',
        },
      },
      {
        '@type': 'Question',
        name: '¿En qué países se juega el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El Mundial 2026 se juega en 16 sedes repartidas entre Estados Unidos (11 sedes), Canadá (2 sedes: Toronto y Vancouver) y México (3 sedes: Ciudad de México, Guadalajara y Monterrey). Es el primer Mundial organizado por tres países anfitriones.',
        },
      },
    ],
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          sportsEventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Cuándo empieza', path: '/2026/cuando-empieza' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CalendarClock className="h-4 w-4" />
          <span>Fechas del torneo</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          ¿Cuándo empieza el Mundial 2026?
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El Mundial empieza el <strong className="text-[var(--color-fg)]">jueves 11 de junio de 2026</strong> con el partido inaugural <strong>México-Sudáfrica</strong> en el Estadio Azteca de Ciudad de México a las <strong>12:00 hora local</strong> (20:00 hora de Madrid). El torneo termina el <strong>domingo 19 de julio</strong> con la final en el MetLife Stadium de Nueva Jersey.
        </p>
      </header>

      {/* Hora del kickoff por ciudad */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Clock className="h-3 w-3" />
          <span>Partido inaugural · 11 jun 2026</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">
          México-Sudáfrica · Estadio Azteca · hora por ciudad
        </h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {COUNTDOWN_TARGETS.map((c) => (
            <div key={c.city} className="bg-[var(--color-bg)] p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {c.city}
              </div>
              <div className="mt-2 font-display text-lg uppercase tab-num text-[var(--color-fg)]">
                {c.date}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          El kickoff es a las 12:00 hora de Ciudad de México (UTC -6).
        </p>
      </section>

      {/* Calendario clave del torneo */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-3 w-3" />
          <span>Fechas clave</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">
          Calendario completo del Mundial 2026
        </h2>
        <ul className="mt-6 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          {KEY_DATES.map((k) => (
            <li key={k.label} className="grid gap-2 p-5 md:grid-cols-[180px_120px_1fr]">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {k.label}
              </div>
              <div className="font-display text-base uppercase tab-num text-[var(--color-fg)]">
                {k.date}
              </div>
              <div className="text-sm text-[var(--color-fg-muted)]">{k.detail}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Cuándo juega España */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="h-3 w-3" />
          <span>España en el Mundial 2026</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">
          ¿Cuándo juega España su primer partido?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          España debuta el <strong className="text-[var(--color-fg)]">lunes 15 de junio</strong> en el <strong>Soldier Field de Chicago</strong> contra <strong>Cabo Verde</strong> a las <strong>21:00 hora de Madrid</strong>. Después se enfrenta a Arabia Saudí (Atlanta, 20 de junio) y cierra la fase de grupos contra Uruguay (Filadelfia, 25 de junio). España está en el Grupo H.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale as Locale, '/selecciones/ESP/grupo-h')}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
          >
            Calendario completo de España <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/2026/grupo/H')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
          >
            Ver el Grupo H completo <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Datos rápidos */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Resumen rápido</h2>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Inicio</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">11 jun 2026</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Final</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">19 jul 2026</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Selecciones</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">48 (récord)</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Partidos</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">104</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Duración</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">39 días</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Sedes</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">16 ciudades</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Países</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">USA · Canadá · México</dd>
          </div>
          <div className="bg-[var(--color-bg)] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Final en</dt>
            <dd className="mt-2 font-display text-xl uppercase tab-num text-[var(--color-fg)]">MetLife (NJ)</dd>
          </div>
        </dl>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue por aquí</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Calendario completo
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Grupos
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Sedes
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/donde-ver')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Dónde ver
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/entradas')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Entradas
            </Link>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Fuente: FIFA · zona horaria del kickoff confirmada por la FMF y la FIFA. URL canónica del torneo: {SEO.siteUrl}/2026/cuando-empieza.
        </p>
      </section>
    </article>
  );
}
