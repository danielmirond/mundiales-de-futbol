import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, MapPin } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { HOSPITALITY_CITIES } from '@/lib/wc-2026-hospitality';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/hospitality/sedes',
    title: 'Hospitality por sede Mundial 2026 · 16 ciudades USA, Canadá, México',
    description:
      'Paquetes hospitality oficiales por ciudad sede del Mundial 2026. 11 ciudades en USA, 2 en Canadá y 3 en México. Precio mínimo, estadio, partidos clave y enlaces a hospitality + hotel + vuelo cerca.',
    keywords: [
      'hospitality por sede mundial 2026',
      'hospitality ciudad sede mundial',
      'hospitality nueva york mundial',
      'hospitality los angeles mundial',
      'hospitality mexico mundial 2026',
    ],
    type: 'article',
  });
}

const BY_COUNTRY = {
  USA: HOSPITALITY_CITIES.filter((c) => c.countryCode === 'USA'),
  CAN: HOSPITALITY_CITIES.filter((c) => c.countryCode === 'CAN'),
  MEX: HOSPITALITY_CITIES.filter((c) => c.countryCode === 'MEX'),
} as const;

const COUNTRY_LABELS = {
  USA: { name: 'Estados Unidos', flag: '🇺🇸' },
  CAN: { name: 'Canadá', flag: '🇨🇦' },
  MEX: { name: 'México', flag: '🇲🇽' },
} as const;

export default async function SedesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Hospitality por sede Mundial 2026',
            url: localeUrl(locale, '/2026/hospitality/sedes'),
            inLanguage: locale,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: HOSPITALITY_CITIES.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${c.cityName} · ${c.stadiumName}`,
                url: localeUrl(locale, `/2026/hospitality/sedes/${c.citySlug}`),
              })),
            },
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Por sede', path: '/2026/hospitality/sedes' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/hospitality')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Hospitality Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="mr-2 inline h-3 w-3" /> 16 sedes
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Hospitality por sede
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Cada ciudad sede tiene su propia oferta hospitality. Aquí está
          el listado completo con precio mínimo desde donde arranca cada
          paquete Single Match y los partidos clave que se juegan en cada
          estadio.
        </p>
      </header>

      {(['USA', 'CAN', 'MEX'] as const).map((cc) => (
        <section key={cc} className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
          <h2 className="flex items-baseline gap-3 font-display text-2xl uppercase">
            <span>{COUNTRY_LABELS[cc].flag}</span>
            <span>{COUNTRY_LABELS[cc].name}</span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              {BY_COUNTRY[cc].length} sedes
            </span>
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {BY_COUNTRY[cc].map((c) => (
              <Link
                key={c.citySlug}
                href={withLocale(locale as Locale, `/2026/hospitality/sedes/${c.citySlug}`)}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg uppercase">{c.cityName}</h3>
                  <span className="font-mono text-sm text-[var(--color-pitch)]">
                    {c.priceFromUsd.toLocaleString('es-ES')} USD
                  </span>
                </div>
                <div className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  {c.stadiumName} · {c.stadiumCapacity.toLocaleString('es-ES')} cap
                </div>
                <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{c.role}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/hospitality/productos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Productos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/precios')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/selecciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por selección
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/private-suites')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Private Suites
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
