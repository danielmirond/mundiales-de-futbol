import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getAllVenues } from '@/lib/data/venues';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

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
    path: '/estadios',
    title: 'Estadios · Sedes históricas de los Mundiales',
    description:
      'Todos los estadios que han albergado partidos de la Copa del Mundo, del Centenario de Montevideo al Estadio Azteca pasando por Wembley, Maracaná y Lusail.',
    keywords: [
      'estadios Mundiales',
      'sedes Copa del Mundo',
      'Estadio Azteca Maracaná Wembley',
      'Lusail Stadium',
      'Centenario Montevideo',
    ],
  });
}

export default async function StadiumsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const venues = await getAllVenues();

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Estadios mundialistas',
    url: localeUrl(locale, '/estadios'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    numberOfItems: venues.length,
    description: 'Listado de todos los estadios que han sido sede de partidos de la Copa del Mundo masculina.',
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Estadios', path: '/estadios' },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Archivo · Estadios
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {venues.length} estadios
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
          Todos los recintos que han albergado al menos un partido del Mundial. Ordenados por
          partidos disputados.
        </p>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3">
          {venues.map((v) => (
            <Link
              key={v.id}
              href={withLocale(locale as Locale, `/estadios/${v.slug}`)}
              className="group relative aspect-[4/3] flex flex-col justify-end overflow-hidden bg-[var(--color-bg)] transition-transform hover:scale-[1.01]"
            >
              {v.hero_image_url ? (
                <Image
                  src={v.hero_image_url}
                  alt={v.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--color-bg-2)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10 p-5">
                <div className="font-display text-xl uppercase leading-none text-white md:text-2xl">
                  {v.name.trim()}
                </div>
                <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/70">
                  <span>
                    {v.city?.trim() ?? ''} · {v.country_code ?? '—'}
                  </span>
                  <span className="tab-num">
                    {v.matches_played} partidos
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
