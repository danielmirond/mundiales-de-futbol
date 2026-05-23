import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarClock, MapPin, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Landing del Mundial 2030: España + Portugal + Marruecos como anfitriones
 * principales más tres partidos del centenario en Uruguay, Argentina y
 * Paraguay (homenaje al primer Mundial de 1930).
 *
 * Cubre las queries trending en alza:
 *   - "copa mundial de fútbol de 2030" +2.000%
 *   - "mundial 2030 sedes"
 *   - "España Portugal Marruecos 2030"
 *   - "Mundial centenario Uruguay 2030"
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2030',
    title:
      'Mundial 2030: España, Portugal y Marruecos anfitriones + centenario en Uruguay, Argentina y Paraguay',
    description:
      'El Mundial 2030 cumple 100 años. Será el primer torneo organizado por TRES continentes: España, Portugal y Marruecos como sedes principales, con un partido del centenario en cada uno de los tres países sudamericanos del Mundial inaugural de 1930 (Uruguay, Argentina, Paraguay). Sedes, fechas y formato.',
    keywords: [
      'Mundial 2030',
      'Copa Mundial 2030',
      'World Cup 2030',
      'España Portugal Marruecos 2030',
      'Mundial centenario 2030',
      'sedes Mundial 2030',
      'Uruguay Argentina Paraguay centenario 2030',
      'FIFA World Cup 2030',
    ],
  });
}

const HOST_COUNTRIES = [
  { code: 'ESP', name: 'España', flag: '🇪🇸', stadiums: 11, cities: 9, role: 'anfitrión principal' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', stadiums: 3, cities: 2, role: 'anfitrión principal' },
  { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', stadiums: 6, cities: 6, role: 'anfitrión principal' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', stadiums: 1, cities: 1, role: 'partido del centenario · sede 1930' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', stadiums: 1, cities: 1, role: 'partido del centenario · finalista 1930' },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', stadiums: 1, cities: 1, role: 'partido del centenario · CONMEBOL' },
];

const SPAIN_VENUES = [
  'Santiago Bernabéu (Madrid)',
  'Camp Nou (Barcelona)',
  'San Mamés (Bilbao)',
  'La Cartuja (Sevilla)',
  'La Cerámica (Vila-real)',
  'Riazor (A Coruña)',
  'Anoeta (San Sebastián)',
  'Nueva Romareda (Zaragoza)',
  'La Rosaleda (Málaga)',
  'Gran Canaria (Las Palmas)',
  'Metropolitano (Madrid)',
];

const KEY_FACTS = [
  { label: 'Fechas', value: 'Jun-Jul 2030 (pendiente confirmación FIFA)' },
  { label: 'Selecciones', value: '48 (mismo formato que 2026)' },
  { label: 'Sedes principales', value: 'España · Portugal · Marruecos' },
  { label: 'Partidos centenario', value: 'Uruguay · Argentina · Paraguay' },
  { label: 'Continentes', value: '3 (primer Mundial trans-continental)' },
  { label: 'Estadios totales', value: '23 (20 sedes principales + 3 centenario)' },
  { label: 'Aniversario', value: '100 años desde el Mundial 1930' },
  { label: 'Anfitrión anterior España', value: '1982 (48 años)' },
];

export default async function Mundial2030Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sportsEventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2030',
    startDate: '2030-06-01',
    endDate: '2030-07-31',
    location: [
      { '@type': 'Country', name: 'España' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'Marruecos' },
      { '@type': 'Country', name: 'Uruguay' },
      { '@type': 'Country', name: 'Argentina' },
      { '@type': 'Country', name: 'Paraguay' },
    ],
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: localeUrl(locale, '/2030'),
    description:
      'El Mundial 2030 celebra el centenario del primer Mundial (Uruguay 1930) con sedes principales en España, Portugal y Marruecos y partidos del centenario en Uruguay, Argentina y Paraguay.',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Dónde se juega el Mundial 2030?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El Mundial 2030 lo organizan España, Portugal y Marruecos como anfitriones principales (20 estadios en 17 ciudades). Además, FIFA dispuso un partido del centenario en cada uno de los tres países sudamericanos del Mundial inaugural de 1930: Uruguay (Estadio Centenario en Montevideo), Argentina (Estadio Monumental en Buenos Aires) y Paraguay (Estadio Osvaldo Domínguez Dibb en Asunción).',
        },
      },
      {
        '@type': 'Question',
        name: '¿Por qué hay partidos del centenario en Sudamérica?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En honor al 100° aniversario del primer Mundial (Uruguay 1930), la FIFA decidió que el Mundial 2030 incluyera al menos un partido en cada uno de los tres países sudamericanos vinculados al torneo inaugural. Uruguay fue anfitrión y campeón; Argentina fue finalista; Paraguay es el tercer pilar de la CONMEBOL fundacional.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuántas selecciones jugarán el Mundial 2030?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El Mundial 2030 mantendrá el formato de 48 selecciones estrenado en el Mundial 2026. La distribución de plazas por confederación se confirmará tras el ciclo de eliminatorias 2027-2029.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Es la primera vez que España organiza un Mundial?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. España fue anfitriona del Mundial 1982, ganado por Italia (3-1 ante Alemania en el Santiago Bernabéu). El Mundial 2030 será el segundo en suelo español, con 48 años de diferencia.',
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
            { name: 'Mundial 2030', path: '/2030' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Inicio
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>Siguiente Mundial · Centenario 2030</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Mundial 2030: España, Portugal, Marruecos y el centenario
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Tras el Mundial 2026, el siguiente cita es el <strong>centenario del fútbol mundial</strong>. La FIFA aprobó la candidatura conjunta de <strong>España, Portugal y Marruecos</strong> como anfitriones principales y adjudicó un <strong>partido del centenario en Uruguay, Argentina y Paraguay</strong> en homenaje al Mundial inaugural de 1930. Es el primer torneo organizado entre tres continentes.
        </p>
      </header>

      {/* Anfitriones */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="h-3 w-3" />
          <span>Anfitriones del Mundial 2030</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">Seis países, tres continentes</h2>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {HOST_COUNTRIES.map((h) => (
            <li key={h.code} className="bg-[var(--color-bg-2)] p-5">
              <div className="flex items-start justify-between">
                <span aria-hidden className="text-4xl">
                  {h.flag}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {h.stadiums} estadios · {h.cities} ciudades
                </span>
              </div>
              <div className="mt-3 font-display text-xl uppercase leading-none text-[var(--color-fg)]">
                {h.name}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                {h.role}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Centenario explained */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-3 w-3" />
          <span>El centenario · Por qué Uruguay, Argentina y Paraguay</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">100 años desde el primer Mundial</h2>
        <div className="mt-5 grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 text-base leading-relaxed text-[var(--color-fg)]">
          <p>
            El <strong>Mundial 1930 se jugó en Uruguay</strong>. Fue el primer torneo de la historia, organizado en Montevideo entre el 13 de julio y el 30 de julio de 1930. Lo ganó la propia Uruguay (4-2 a Argentina en la final del Estadio Centenario).
          </p>
          <p>
            En homenaje a esos cien años, la FIFA dispuso que el Mundial 2030 incluyera <strong>un partido en cada uno de los tres países sudamericanos vinculados al torneo inaugural</strong>:
          </p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li>
              · <strong>Uruguay</strong> · partido en el <strong>Estadio Centenario de Montevideo</strong> (mismo escenario de la final de 1930).
            </li>
            <li>
              · <strong>Argentina</strong> · partido en el <strong>Estadio Monumental Núñez de Buenos Aires</strong> (sede final 1978).
            </li>
            <li>
              · <strong>Paraguay</strong> · partido en el <strong>Estadio Osvaldo Domínguez Dibb de Asunción</strong> (sede histórica de CONMEBOL).
            </li>
          </ul>
          <p>
            Tras esos tres partidos, el torneo se traslada definitivamente a Europa-África. Las eliminatorias, semifinales y final se jugarán en <strong>España, Portugal y Marruecos</strong>.
          </p>
        </div>
      </section>

      {/* Datos rápidos */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Datos rápidos</h2>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {KEY_FACTS.map((k) => (
            <div key={k.label} className="bg-[var(--color-bg)] p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {k.label}
              </dt>
              <dd className="mt-2 font-display text-base uppercase tab-num text-[var(--color-fg)]">
                {k.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Sedes España */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CalendarClock className="h-3 w-3" />
          <span>Sedes españolas confirmadas</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">11 estadios en 9 ciudades</h2>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {SPAIN_VENUES.map((v) => (
            <li key={v} className="bg-[var(--color-bg-2)] p-4 font-mono text-sm text-[var(--color-fg)]">
              {v}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Lista preliminar. Las sedes definitivas se confirmarán en 2027-2028.
        </p>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Mientras tanto · Mundial 2026</h2>
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
            Faltan 4 años para el centenario. El Mundial 2026 (Estados Unidos, Canadá, México) arranca el 11 de junio.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Mundial 2026 <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/ediciones/1930-uruguay')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Mundial 1930 Uruguay
            </Link>
            <Link
              href={withLocale(locale as Locale, '/ediciones/1982-espana')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Mundial 1982 España
            </Link>
            <Link
              href={withLocale(locale as Locale, '/ediciones')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              23 Mundiales 1930-2026
            </Link>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Fuente: FIFA · Decisión del Consejo de la FIFA del 11 de diciembre de 2024. URL canónica: {SEO.siteUrl}/2030.
        </p>
      </section>
    </article>
  );
}
