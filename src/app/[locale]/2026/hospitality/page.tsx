import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Sparkles, ShieldCheck, Crown, MapPin, Flag, Banknote, HelpCircle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import {
  HOSPITALITY_PRODUCTS,
  HOSPITALITY_CITIES,
  FMT_TEAM_PARAMS,
  CLUSTER_PAGES,
  fifaProductUrl,
} from '@/lib/wc-2026-hospitality';
import { TEAMS_2026 } from '@/lib/wc-2026';

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
  return pageMetadata({
    locale,
    path: '/2026/hospitality',
    title: 'Hospitality Mundial 2026 · Single Match, Venue Series, Follow My Team',
    description:
      'Guía completa de los paquetes hospitality oficiales del Mundial 2026 (FIFA + On Location). Single Match desde 2.500 USD, Venue Series desde 8.275 USD, Follow My Team y Private Suites. Por ciudad, por selección y por producto.',
    keywords: [
      'hospitality mundial 2026',
      'fifa hospitality 2026',
      'single match hospitality',
      'venue series mundial',
      'follow my team',
      'private suites mundial',
      'on location mundial 2026',
      'entradas premium mundial',
    ],
    type: 'website',
  });
}

const SECTION_ICONS = {
  productos: Sparkles,
  precios: Banknote,
  'private-suites': Crown,
  faq: HelpCircle,
  sedes: MapPin,
  selecciones: Flag,
} as const;

export default async function HospitalityPillar({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hospitality Mundial 2026',
    url: localeUrl(locale, '/2026/hospitality'),
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: CLUSTER_PAGES.filter((p) => p.slug !== '').map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: localeUrl(locale, p.path),
      })),
    },
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Crown className="mr-2 inline h-3 w-3" /> FIFA Hospitality oficial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-6xl">
          Hospitality Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Los paquetes hospitality oficiales del Mundial 2026 los vende
          <strong> On Location</strong> en exclusiva para FIFA. Son entradas
          premium con catering, lounge y, en algunos casos, suite privada.
          Aquí tienes el mapa completo: 7 productos, 16 sedes y las 48
          selecciones con &ldquo;Follow My Team&rdquo;.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          <ShieldCheck className="h-3 w-3" /> Único proveedor oficial: On Location · Resto = reventa
        </div>
      </header>

      {/* Sub-páginas */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Explora el cluster</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CLUSTER_PAGES.filter((p) => p.slug !== '').map((p) => {
            const Icon = SECTION_ICONS[p.slug as keyof typeof SECTION_ICONS] ?? Sparkles;
            return (
              <Link
                key={p.slug}
                href={withLocale(locale as Locale, p.path)}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
              >
                <Icon className="h-5 w-5 text-[var(--color-pitch)]" />
                <div className="mt-3 font-display text-lg uppercase">{p.title}</div>
                <div className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)] group-hover:text-[var(--color-pitch)]">
                  Ver detalle <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Productos */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Los 7 productos hospitality</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Desde la entrada premium más asequible hasta la suite privada con acceso a vestuarios.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {HOSPITALITY_PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    {p.id}
                  </div>
                  <h3 className="mt-1 font-display text-lg uppercase">{p.name}</h3>
                </div>
                {p.priceFromUsd && (
                  <div className="font-mono text-sm text-[var(--color-pitch)]">
                    desde {p.priceFromUsd.toLocaleString('es-ES')} USD
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{p.description}</p>
              <a
                href={fifaProductUrl(p)}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
              >
                Ver en FIFA Hospitality <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </a>
            </div>
          ))}
        </div>

        <Link
          href={withLocale(locale as Locale, '/2026/hospitality/productos')}
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
        >
          Ver comparativa completa de productos <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </section>

      {/* Sedes */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Por sede</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          16 ciudades en USA, Canadá y México. Selecciona la sede para ver hospitality, hotel cercano, vuelo y tours.
        </p>

        <div className="mt-6 grid gap-2 md:grid-cols-4">
          {HOSPITALITY_CITIES.map((c) => (
            <Link
              key={c.citySlug}
              href={withLocale(locale as Locale, `/2026/hospitality/sedes/${c.citySlug}`)}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]/60"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-sm uppercase leading-tight">{c.cityName}</div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{c.countryCode}</span>
              </div>
              <div className="mt-1 font-mono text-[10px] text-[var(--color-fg-subtle)]">
                {c.stadiumName}
              </div>
              <div className="mt-2 font-mono text-[10px] text-[var(--color-pitch)]">
                desde {c.priceFromUsd.toLocaleString('es-ES')} USD
              </div>
            </Link>
          ))}
        </div>

        <Link
          href={withLocale(locale as Locale, '/2026/hospitality/sedes')}
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
        >
          Ver detalle de las 16 sedes <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </section>

      {/* Selecciones */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Por selección · Follow My Team</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Sigue a tu equipo desde la fase de grupos hasta donde llegue. 48 selecciones disponibles.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {Object.keys(FMT_TEAM_PARAMS).map((code) => {
            const team = TEAMS_2026[code as keyof typeof TEAMS_2026];
            if (!team) return null;
            return (
              <Link
                key={code}
                href={withLocale(locale as Locale, `/2026/hospitality/selecciones/${code}`)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-1.5 text-xs transition-colors hover:border-[var(--color-pitch)]/60 hover:text-[var(--color-pitch)]"
              >
                <span>{team.flag}</span>
                <span>{team.name}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href={withLocale(locale as Locale, '/2026/hospitality/selecciones')}
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
        >
          Ver las 48 selecciones <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </section>

      {/* Aviso */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <p className="text-sm text-[var(--color-fg-muted)]">
            <strong>Aviso:</strong> esta guía es editorial. Las compras se
            realizan en el portal oficial On Location (FIFA Hospitality). Los
            paquetes oficiales NO incluyen vuelo ni hotel: planifica esos
            elementos por separado. Más info en{' '}
            <Link href={withLocale(locale as Locale, '/aviso-afiliados')} className="underline">aviso de afiliados</Link>.
          </p>
        </div>
      </section>
    </article>
  );
}
