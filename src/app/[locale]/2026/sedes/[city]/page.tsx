import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plane,
  Hotel,
  Users,
  Train,
  Lightbulb,
  Building2,
} from 'lucide-react';
import {
  SEDES_2026,
  getSedeBySlug,
  getVenueForSede,
} from '@/lib/wc-2026-sedes';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return SEDES_2026.flatMap((s) =>
    routing.locales.map((locale) => ({ locale, city: s.citySlug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  const sede = getSedeBySlug(city);
  if (!sede) return {};
  const venue = getVenueForSede(sede);

  const stadium = venue?.name ?? sede.venueSlug;
  const role = venue?.role ?? 'sede del Mundial 2026';

  // Patrón SEO: "Atlanta · Mundial 2026 - Mercedes-Benz Stadium, partidos y guía"
  const title = `${sede.cityName} Mundial 2026 · ${stadium}, partidos y guía de viaje`;
  const description = `${sede.cityName} (${sede.countryName}) acoge ${role.toLowerCase()} en ${stadium}. Calendario, qué hacer, dónde alojarse y cómo llegar al estadio.`;

  return pageMetadata({
    locale,
    path: `/2026/sedes/${sede.citySlug}`,
    title,
    description,
    keywords: [
      `${sede.cityName} Mundial 2026`,
      `viaje ${sede.cityName} Mundial`,
      `${stadium} partidos`,
      `hoteles ${sede.cityName} Mundial`,
      `cómo llegar ${stadium}`,
      `qué hacer en ${sede.cityName}`,
    ],
    type: 'article',
  });
}

export default async function SedeCityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  setRequestLocale(locale);

  const sede = getSedeBySlug(city);
  if (!sede) notFound();
  const venue = getVenueForSede(sede);

  const stadiumName = venue?.name ?? sede.venueSlug;
  const stadiumUrl = withLocale(locale as Locale, `/estadios/${sede.venueSlug}`);
  const sedeUrl = localeUrl(locale, `/2026/sedes/${sede.citySlug}`);

  // Place / TouristAttraction LD
  const placeLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: `${sede.cityName} (Mundial 2026)`,
    url: sedeUrl,
    description: sede.heroEditorial,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: sede.coords[0],
      longitude: sede.coords[1],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: sede.countryCode,
      addressLocality: sede.cityName,
    },
    touristType: 'FIFA World Cup 2026 host city',
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    containedInPlace: {
      '@type': 'Country',
      name: sede.countryName,
    },
    includesAttraction: sede.thingsToDo.map((t) => ({
      '@type': 'TouristAttraction',
      name: t.title,
      description: t.text,
    })),
  };

  // Article LD para la guía editorial
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${sede.cityName} Mundial 2026: estadio, partidos y guía`,
    description: sede.shortIntro,
    url: sedeUrl,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
  };

  return (
    <div className="relative pt-32">
      <JsonLd
        data={[
          placeLd,
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Sedes', path: '/2026/sedes' },
            { name: sede.cityName, path: `/2026/sedes/${sede.citySlug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/sedes')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> 16 sedes
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <span aria-hidden>{sede.flag}</span>
          <span>{sede.countryName}</span>
          <span className="text-[var(--color-fg-subtle)]">·</span>
          <span className="text-[var(--color-fg-subtle)]">{sede.timezone}</span>
          <span className="text-[var(--color-fg-subtle)]">·</span>
          <span className="text-[var(--color-fg-subtle)]">{sede.airport.iata}</span>
        </div>

        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {sede.cityName}
        </h1>
        <p className="mt-4 max-w-3xl font-display text-2xl uppercase leading-tight text-[var(--color-fg-muted)] md:text-3xl">
          {stadiumName}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {venue?.role ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)]/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {venue.role}
            </span>
          ) : null}
          {venue?.capacity ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              <Users className="h-3 w-3" />
              {venue.capacity.toLocaleString('es-ES')} aforo
            </span>
          ) : null}
          {venue?.openedYear ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              <Building2 className="h-3 w-3" />
              Abierto {venue.openedYear}
            </span>
          ) : null}
        </div>
      </header>

      {/* Hero editorial */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <p className="text-xl leading-relaxed text-[var(--color-fg)] md:text-2xl">
          {sede.heroEditorial}
        </p>
      </section>

      {/* Por qué venir aquí */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Por qué venir aquí
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
              {sede.cityName} para el aficionado
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              {sede.whyHere}
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              El estadio
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight">
              {stadiumName}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {sede.aboutStadium}
            </p>
            <Link
              href={stadiumUrl}
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)]"
            >
              Ficha completa del estadio
              <ArrowRight className="h-3 w-3 transition-transform hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Things to do */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Qué hacer
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          La ciudad más allá del partido
        </h2>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2">
          {sede.thingsToDo.map((t) => (
            <li
              key={t.title}
              className="flex flex-col gap-3 bg-[var(--color-bg)] p-7"
            >
              <h3 className="font-display text-xl uppercase leading-tight text-[var(--color-fg)]">
                {t.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {t.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Hotel areas */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Hotel className="inline h-3 w-3 mr-2" />
          Dónde alojarse
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          Zonas hoteleras de {sede.cityName}
        </h2>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {sede.hotelAreas.map((h) => (
            <li
              key={h.name}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6"
            >
              <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)]">
                {h.name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                {h.profile}
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {h.bookingHint}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Precios estimados de junio-julio 2026. Reservar con 3-6 meses de
          antelación recomendado.
        </p>
      </section>

      {/* Cómo llegar */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Plane className="inline h-3 w-3 mr-2" />
              Llegar a la ciudad
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight">
              {sede.airport.iata} · {sede.airport.name}
            </h3>
            <p className="mt-4 font-mono text-xs text-[var(--color-fg-subtle)]">
              {sede.timezone} · {sede.utcOffset}
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Train className="inline h-3 w-3 mr-2" />
              Llegar al estadio
            </div>
            <h3 className="mt-3 font-display text-2xl uppercase leading-tight">
              <MapPin className="inline h-5 w-5 mb-1 mr-1" />
              {stadiumName}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {sede.gettingThere}
            </p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Lightbulb className="inline h-3 w-3 mr-2" />
          Consejos prácticos
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          Lo que conviene saber
        </h2>

        <ul className="mt-10 space-y-4">
          {sede.tips.map((tip, i) => (
            <li
              key={i}
              className="flex gap-4 border-l-2 border-[var(--color-pitch)] pl-5"
            >
              <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA hub */}
      <section className="mx-auto mt-20 mb-24 w-full max-w-[1400px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más de Mundial 2026
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl uppercase leading-tight md:text-4xl">
            Calendario, dónde ver y entradas del Mundial
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Calendario completo
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/donde-ver')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Dónde ver el Mundial
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/entradas')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Entradas
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
