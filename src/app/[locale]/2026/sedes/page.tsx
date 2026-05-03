import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, MapPin, Users } from 'lucide-react';
import { SEDES_2026, getVenueForSede } from '@/lib/wc-2026-sedes';
import { HOSTS } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { SedesMapClient } from '@/components/sedes/sedes-map-client';

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
  const t = await getTranslations({ locale, namespace: 'pages.sedes' });
  return pageMetadata({
    locale,
    path: '/2026/sedes',
    title: t('title'),
    description: t('description'),
    keywords: [
      'sedes Mundial 2026',
      'ciudades Mundial 2026',
      'host cities World Cup 2026',
      'World Cup 2026 host cities',
      'cidades-sede Copa do Mundo 2026',
      'villes hôtes Coupe du Monde 2026',
      'estadios Mundial 2026',
      'guía viaje Mundial 2026',
    ],
  });
}

export default async function SedesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.sedes' });

  // Agrupado por país, en orden México → USA → Canadá (orden histórico-FIFA).
  const grouped = (['MEX', 'USA', 'CAN'] as const).map((code) => ({
    host: HOSTS.find((h) => h.code === code)!,
    sedes: SEDES_2026.filter((s) => s.countryCode === code),
  }));

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sedes Mundial 2026',
    url: localeUrl(locale, '/2026/sedes'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Las 16 ciudades anfitrionas del Mundial 2026: estadios, partidos, qué hacer y cómo llegar.',
    hasPart: SEDES_2026.map((s) => ({
      '@type': 'Place',
      name: s.cityName,
      url: localeUrl(locale, `/2026/sedes/${s.citySlug}`),
      address: { '@type': 'PostalAddress', addressCountry: s.countryCode },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: s.coords[0],
        longitude: s.coords[1],
      },
    })),
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Sedes', path: '/2026/sedes' },
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
          {t('h1Line1')}<br />{t('h1Line2')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t('intro')}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {HOSTS.map((h) => (
            <span key={h.code} className="inline-flex items-center gap-2">
              <span aria-hidden>{h.flag}</span>
              {h.name} · {t('hostStats', { cities: h.cityCount, matches: h.matchCount })}
            </span>
          ))}
        </div>
      </header>

      {/* Mapa interactivo Leaflet de las 16 sedes */}
      <section className="mx-auto mt-12 w-full max-w-[1400px] px-6 md:px-10">
        <SedesMapClient sedes={SEDES_2026} />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          {t('mapHint')}
        </p>
      </section>

      <div className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        {grouped.map(({ host, sedes }) => (
          <section
            key={host.code}
            className="border-t border-[var(--color-border)] py-14 md:py-20"
          >
            <div className="grid gap-10 md:grid-cols-[280px_1fr]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {host.flag} {host.name}
                </div>
                <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
                  {t('sedesCount', { count: sedes.length })}
                </h2>
                <p className="mt-4 font-mono text-xs text-[var(--color-fg-subtle)]">
                  {t('tournamentMatches', { matches: host.matchCount })}
                </p>
              </div>

              <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2">
                {sedes.map((s) => {
                  const venue = getVenueForSede(s);
                  return (
                    <li key={s.citySlug} className="bg-[var(--color-bg)]">
                      <Link
                        href={withLocale(
                          locale as Locale,
                          `/2026/sedes/${s.citySlug}`,
                        )}
                        className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-[var(--color-bg-2)] md:p-7"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-display text-2xl uppercase leading-none text-[var(--color-fg)] md:text-3xl">
                            {s.cityName}
                          </h3>
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                            {s.airport.iata}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            {venue?.name ?? s.venueSlug}
                          </span>
                          {venue?.capacity ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="h-3 w-3" />
                              {venue.capacity.toLocaleString('es-ES')}
                            </span>
                          ) : null}
                          {venue?.role ? (
                            <span className="text-[var(--color-pitch)]">
                              {venue.role}
                            </span>
                          ) : null}
                        </div>

                        <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                          {s.shortIntro}
                        </p>

                        <span className="mt-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">
                          {t('sedeCardCta')}
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <div className="h-24" />
    </div>
  );
}
