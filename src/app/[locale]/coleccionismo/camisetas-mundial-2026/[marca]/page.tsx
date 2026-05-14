import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ShieldCheck, Shirt } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { TEAMS_2026 } from '@/lib/wc-2026';
import {
  TEAM_KITS_2026,
  BRAND_BY_TEAM,
  brandTeamCounts,
  type KitBrand,
} from '@/lib/team-kit-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Pilares por marca técnica: las selecciones del Mundial 2026 patrocinadas
 * por adidas, Nike y Puma. Cubre las tres mayores (39 de las 48
 * selecciones). El resto (New Balance, Puma rare, Macron, Hummel, Kappa,
 * Federation propias) tiene poca masa critica por separado y vive solo
 * en el hub principal.
 *
 * SEO: keywords pilar "camiseta adidas mundial 2026", "kit nike mundial
 * 2026", "puma world cup 2026 jersey", etc.
 */

const BRAND_META: Record<
  string,
  {
    slug: string;
    brand: KitBrand;
    headline: string;
    intro: string;
    seoTitle: string;
    seoDesc: string;
    contractInfo?: string;
  }
> = {
  adidas: {
    slug: 'adidas',
    brand: 'adidas',
    headline: 'Las camisetas adidas del Mundial 2026',
    intro:
      'adidas es la marca técnica con más presencia en el Mundial 2026: 15 selecciones repartidas entre las cinco confederaciones. Líneas heredadas (Argentina, Alemania, España, México, Bélgica, Colombia, Japón) y nuevas firmas africanas y asiáticas. Todas las camisetas adidas comparten la tecnología AEROREADY (réplica) o HEAT.RDY (auténtica jugador) y diseño con las tres rayas reinterpretadas.',
    seoTitle: 'Camisetas adidas Mundial 2026: las 15 selecciones, precios y dónde comprar',
    seoDesc:
      'Catálogo completo de las 15 camisetas adidas del Mundial 2026: Argentina, Alemania, España, México, Bélgica, Colombia, Japón, Suecia, Escocia, Egipto, Argelia, Arabia Saudí, Irán, Jordania y Paraguay. Precios RRP, tecnología AEROREADY y enlaces de compra.',
    contractInfo: 'Contrato FIFA × adidas vigente hasta 2030, valor estimado 200 M€ anuales por toda la oficialidad.',
  },
  nike: {
    slug: 'nike',
    brand: 'Nike',
    headline: 'Las camisetas Nike del Mundial 2026',
    intro:
      'Nike viste a 15 selecciones del Mundial 2026, igualando a adidas en cobertura por primera vez en un Mundial. Las grandes del cuadro arriba (Brasil, Francia, Inglaterra, Portugal, Países Bajos, Croacia) y los anfitriones USA y Canadá. Tecnología Dri-FIT para réplica fan y Match Dri-FIT ADV para versiones auténticas. Drops oficiales entre marzo y mayo de 2026.',
    seoTitle: 'Camisetas Nike Mundial 2026: las 15 selecciones, precios y dónde comprar',
    seoDesc:
      'Catálogo completo de las 15 camisetas Nike del Mundial 2026: Brasil, Francia, Inglaterra, Portugal, Países Bajos, Croacia, USA, Canadá, Australia, Noruega, Corea del Sur, Polonia, Qatar, Turquía y Nueva Zelanda. Precios RRP, tecnología Dri-FIT y enlaces de compra.',
    contractInfo: 'Nike viste a más finalistas mundialistas que ninguna otra marca (Brasil tetracampeón, Francia bicampeón, USA anfitrión).',
  },
  puma: {
    slug: 'puma',
    brand: 'Puma',
    headline: 'Las camisetas Puma del Mundial 2026',
    intro:
      'Puma firma 9 selecciones para el Mundial 2026, su mejor cobertura desde 2010. Suiza, Marruecos (semifinalista 2022), Uruguay (centenario), Ghana, Costa de Marfil, Senegal, República Checa, Austria y Bosnia. Tecnología dryCELL en la línea réplica. La estrategia Puma apunta a selecciones con cluster africano fuerte y a Uruguay como icono histórico.',
    seoTitle: 'Camisetas Puma Mundial 2026: las 9 selecciones, precios y dónde comprar',
    seoDesc:
      'Catálogo completo de las 9 camisetas Puma del Mundial 2026: Suiza, Marruecos, Uruguay, Ghana, Costa de Marfil, Senegal, Chequia, Austria y Bosnia. Precios RRP, tecnología dryCELL y enlaces de compra. La Uruguay del centenario y la Marruecos semifinalista son los pilares.',
  },
};

export function generateStaticParams() {
  return Object.keys(BRAND_META).flatMap((marca) =>
    routing.locales.map((locale) => ({ locale, marca })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; marca: string }>;
}) {
  const { locale, marca } = await params;
  const meta = BRAND_META[marca];
  if (!meta) return {};
  return pageMetadata({
    locale,
    path: `/coleccionismo/camisetas-mundial-2026/${marca}`,
    title: meta.seoTitle,
    description: meta.seoDesc,
    keywords: [
      `camiseta ${meta.brand.toLowerCase()} mundial 2026`,
      `${meta.brand.toLowerCase()} mundial 2026`,
      `${meta.brand.toLowerCase()} world cup 2026`,
      `${meta.brand.toLowerCase()} kit 2026`,
      `donde comprar camiseta ${meta.brand.toLowerCase()} mundial 2026`,
      `precio camiseta ${meta.brand.toLowerCase()} mundial 2026`,
    ],
    type: 'article',
  });
}

export default async function CamisetasPorMarca({
  params,
}: {
  params: Promise<{ locale: string; marca: string }>;
}) {
  const { locale, marca } = await params;
  setRequestLocale(locale);

  const meta = BRAND_META[marca];
  if (!meta) notFound();

  // Selecciones del Mundial 2026 vistiendo esta marca
  const teamCodes = Object.entries(BRAND_BY_TEAM)
    .filter(([, b]) => b === meta.brand)
    .map(([code]) => code);

  // Las que tienen drop verificado (con datos completos)
  const verified = teamCodes
    .map((c) => TEAM_KITS_2026[c])
    .filter((k): k is NonNullable<typeof k> => Boolean(k) && !k!.unverified);

  // Las que todavia no estan en el catalogo detallado
  const pending = teamCodes.filter((c) => !TEAM_KITS_2026[c] || TEAM_KITS_2026[c]?.unverified);

  const url = localeUrl(locale, `/coleccionismo/camisetas-mundial-2026/${marca}`);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: meta.headline,
    description: meta.intro,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: teamCodes.length,
      itemListElement: teamCodes.map((code, i) => {
        const t = TEAMS_2026[code];
        return {
          '@type': 'ListItem',
          position: i + 1,
          name: `Camiseta ${t?.name} ${meta.brand} Mundial 2026`,
          url: localeUrl(locale, `/selecciones/${code}/camisetas`),
        };
      }),
    },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          itemListLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            {
              name: 'Camisetas Mundial 2026',
              path: '/coleccionismo/camisetas-mundial-2026',
            },
            {
              name: meta.brand,
              path: `/coleccionismo/camisetas-mundial-2026/${marca}`,
            },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Camisetas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Shirt className="mr-2 inline h-3 w-3" />
          Coleccionismo · {teamCodes.length} selecciones
        </div>

        <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
          {meta.brand}
          <br />
          Mundial 2026
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {meta.intro}
        </p>

        {meta.contractInfo && (
          <p className="mt-6 max-w-3xl font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            {meta.contractInfo}
          </p>
        )}
      </header>

      {/* Verificadas */}
      {verified.length > 0 && (
        <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <ShieldCheck className="mr-2 inline h-3 w-3" />
            Drops verificados con precio
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            En venta hoy ({verified.length} selecciones)
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {verified.map((kit) => {
              const t = TEAMS_2026[kit.teamCode];
              const home = kit.kits.find((k) => k.variant === 'home');
              return (
                <li key={kit.teamCode}>
                  <Link
                    href={withLocale(locale as Locale, `/selecciones/${kit.teamCode}/camisetas`)}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span aria-hidden className="text-2xl">{t?.flag}</span>
                        <span className="font-display text-lg uppercase">{t?.name}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">
                      {kit.intro.slice(0, 130)}
                      {kit.intro.length > 130 ? '…' : ''}
                    </p>
                    <div className="mt-auto flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                      {home?.priceEur && (
                        <span className="font-display text-base tab-num text-[var(--color-pitch)]">
                          Desde {home.priceEur} €
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 group-hover:text-[var(--color-pitch)]">
                        Ver detalles
                        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Pendientes de drop verificado */}
      {pending.length > 0 && (
        <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Resto del catálogo {meta.brand}
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Pendientes de drop oficial ({pending.length} selecciones)
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)]">
            {meta.brand} aún no ha publicado los detalles oficiales (precio,
            fecha exacta) para estas selecciones. Iremos actualizando conforme
            se publiquen los kits.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {pending.map((code) => {
              const t = TEAMS_2026[code];
              return (
                <li key={code}>
                  <Link
                    href={withLocale(locale as Locale, `/selecciones/${code}/camisetas`)}
                    className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-3.5 transition-colors hover:border-[var(--color-pitch)]/40"
                  >
                    <span aria-hidden className="text-lg">{t?.flag}</span>
                    <span className="text-sm">{t?.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* CTA hub */}
      <section className="mx-auto mb-24 mt-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">
            Otras marcas técnicas
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(BRAND_META)
              .filter(([k]) => k !== marca)
              .map(([k, m]) => {
                const count = brandTeamCounts().find((b) => b.brand === m.brand)?.count ?? 0;
                return (
                  <Link
                    key={k}
                    href={withLocale(locale as Locale, `/coleccionismo/camisetas-mundial-2026/${k}`)}
                    className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
                  >
                    {m.brand} <span className="text-[var(--color-fg-muted)]">· {count}</span>
                  </Link>
                );
              })}
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/precio')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Comparador de precios
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
            >
              Ver las 48
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            Enlaces de afiliación · ver{' '}
            <Link href={withLocale(locale as Locale, '/aviso-afiliados')} className="underline">
              aviso de afiliados
            </Link>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
