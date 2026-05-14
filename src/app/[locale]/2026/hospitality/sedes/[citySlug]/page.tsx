import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, MapPin, Hotel, Plane, Camera, ShieldCheck } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import {
  HOSPITALITY_CITIES,
  getCity,
  fifaVenueUrl,
  getBookingLink,
  getSkyscannerLink,
  getGetYourGuideLink,
  AFFILIATE_PLACEHOLDERS,
} from '@/lib/wc-2026-hospitality';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return HOSPITALITY_CITIES.map((c) => ({ citySlug: c.citySlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; citySlug: string }>;
}) {
  const { locale, citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};
  return pageMetadata({
    locale,
    path: `/2026/hospitality/sedes/${city.citySlug}`,
    title: `Hospitality ${city.cityName} Mundial 2026 · ${city.stadiumName} desde ${city.priceFromUsd.toLocaleString('es-ES')} USD`,
    description: `Paquetes hospitality oficiales en ${city.stadiumName} (${city.cityName}) para el Mundial 2026: ${city.role}, capacidad ${city.stadiumCapacity.toLocaleString('es-ES')}. Single Match desde ${city.priceFromUsd.toLocaleString('es-ES')} USD. Hotel y vuelo cerca del estadio.`,
    keywords: [
      `hospitality ${city.cityName} mundial 2026`,
      `${city.stadiumName.toLowerCase()} hospitality`,
      `entradas premium ${city.cityName}`,
      `hotel cerca ${city.cityName} mundial`,
      `vuelo ${city.iata} mundial 2026`,
    ],
    type: 'article',
  });
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ locale: string; citySlug: string }>;
}) {
  const { locale, citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();
  setRequestLocale(locale);

  // Otras sedes para el módulo de "explora otras"
  const otherCities = HOSPITALITY_CITIES.filter(
    (c) => c.citySlug !== city.citySlug && c.countryCode === city.countryCode,
  ).slice(0, 4);

  const bookingLink = getBookingLink(city);
  const skyscannerLink = getSkyscannerLink(city);
  const gygLink = getGetYourGuideLink(city);
  const affiliatePending = AFFILIATE_PLACEHOLDERS.booking_aid === 'TBA';

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `Hospitality ${city.cityName} Mundial 2026`,
            url: localeUrl(locale, `/2026/hospitality/sedes/${city.citySlug}`),
            inLanguage: locale,
            about: {
              '@type': 'StadiumOrArena',
              name: city.stadiumName,
              maximumAttendeeCapacity: city.stadiumCapacity,
            },
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Por sede', path: '/2026/hospitality/sedes' },
            { name: city.cityName, path: `/2026/hospitality/sedes/${city.citySlug}` },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/hospitality/sedes')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Hospitality por sede
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="mr-2 inline h-3 w-3" /> {city.countryCode} · {city.iata}
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Hospitality en {city.cityName}
        </h1>
        <div className="mt-2 font-mono text-base text-[var(--color-fg-muted)]">{city.stadiumName}</div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Single Match desde</div>
            <div className="mt-1 font-display text-2xl text-[var(--color-pitch)]">
              {city.priceFromUsd.toLocaleString('es-ES')} USD
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Capacidad estadio</div>
            <div className="mt-1 font-display text-2xl">{city.stadiumCapacity.toLocaleString('es-ES')}</div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Rol Mundial 2026</div>
            <div className="mt-1 font-display text-sm">{city.role}</div>
          </div>
        </div>

        <a
          href={fifaVenueUrl(city)}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          <ShieldCheck className="h-4 w-4" />
          Ver hospitality oficial de {city.stadiumName}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </a>
      </header>

      {/* Afiliación cruzada: hotel, vuelo, tours */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Hotel · Vuelo · Tours en {city.cityName}</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          El hospitality oficial NO incluye vuelo ni hotel. Organiza tu
          viaje con estos partners.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {/* Hotel */}
          <a
            href={bookingLink}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
          >
            <Hotel className="h-5 w-5 text-[var(--color-pitch)]" />
            <div className="mt-3 font-display text-lg uppercase">Hotel en {city.cityName}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Booking.com</div>
            <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)] group-hover:underline">
              Buscar hoteles <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </div>
          </a>

          {/* Vuelo */}
          <a
            href={skyscannerLink}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
          >
            <Plane className="h-5 w-5 text-[var(--color-pitch)]" />
            <div className="mt-3 font-display text-lg uppercase">Vuelo a {city.iata}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Skyscanner (Madrid → {city.iata})</div>
            <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)] group-hover:underline">
              Buscar vuelos <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </div>
          </a>

          {/* Tours */}
          <a
            href={gygLink}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
          >
            <Camera className="h-5 w-5 text-[var(--color-pitch)]" />
            <div className="mt-3 font-display text-lg uppercase">Tours en {city.cityName}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">GetYourGuide</div>
            <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)] group-hover:underline">
              Buscar tours <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </div>
          </a>
        </div>

        {affiliatePending && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            Programas Booking / Skyscanner / GetYourGuide pendientes de alta. Enlaces directos hasta que se activen los IDs.
          </p>
        )}
      </section>

      {/* Productos disponibles */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase">Productos disponibles en {city.stadiumName}</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Todos los estadios del Mundial 2026 tienen los 7 productos hospitality:
            Single Match, Venue Series (toda la serie de este estadio), Follow My Team
            (si tu selección juega aquí), Multi-Match Bundle, Match Experience Light
            (MEL), Private Suites y PP-Suites. Los precios mínimos en {city.cityName}
            arrancan en <strong>{city.priceFromUsd.toLocaleString('es-ES')} USD/persona</strong>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/hospitality/productos')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Ver los 7 productos
            </Link>
            <Link href={withLocale(locale as Locale, `/2026/sedes/${city.citySlug}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Guía completa de {city.cityName}
            </Link>
          </div>
        </div>
      </section>

      {/* Otras sedes */}
      {otherCities.length > 0 && (
        <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
          <h2 className="font-display text-lg uppercase">Más sedes en {city.countryCode === 'USA' ? 'USA' : city.countryCode === 'CAN' ? 'Canadá' : 'México'}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {otherCities.map((c) => (
              <Link
                key={c.citySlug}
                href={withLocale(locale as Locale, `/2026/hospitality/sedes/${c.citySlug}`)}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]/60"
              >
                <div className="font-display text-sm uppercase">{c.cityName}</div>
                <div className="mt-1 font-mono text-[10px] text-[var(--color-fg-subtle)]">{c.stadiumName}</div>
                <div className="mt-2 font-mono text-[10px] text-[var(--color-pitch)]">desde {c.priceFromUsd.toLocaleString('es-ES')} USD</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
