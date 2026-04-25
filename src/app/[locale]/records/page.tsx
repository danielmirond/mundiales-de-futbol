import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Trophy, Goal, Calendar, Clock, Square, AlertOctagon, Users } from 'lucide-react';
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
    path: '/records',
    title: 'Récords mundialistas · Goleadores, Mundiales y tarjetas',
    description:
      'Todos los récords de los Mundiales de fútbol: máximos goleadores, jugadores con más Mundiales jugados, más minutos, más tarjetas, goles en propia. Datos verificados desde 1930.',
    keywords: [
      'récords Mundiales',
      'máximos goleadores Copa del Mundo',
      'jugadores con más Mundiales',
      'récords FIFA World Cup',
      'estadísticas históricas Mundial',
    ],
  });
}

const RECORDS = [
  {
    slug: 'maximos-goleadores',
    icon: Goal,
    title: 'Máximos goleadores',
    description: 'Klose, Ronaldo, Müller, Pelé… los 30 jugadores con más goles en toda la historia de los Mundiales.',
    badge: 'Top 30',
    color: 'text-emerald-300',
    accent: 'border-emerald-500/30 bg-emerald-500/5',
    available: true,
  },
  {
    slug: 'mas-mundiales-jugados',
    icon: Calendar,
    title: 'Más Mundiales jugados',
    description: 'Carbajal, Matthäus, Maldini, Messi, Ronaldo... los jugadores que repitieron Mundial tras Mundial.',
    badge: 'Top 30',
    color: 'text-sky-300',
    accent: 'border-sky-500/30 bg-sky-500/5',
    available: false,
  },
  {
    slug: 'mas-minutos',
    icon: Clock,
    title: 'Más minutos disputados',
    description: 'Ranking de los jugadores que más minutos pisaron el césped en una Copa del Mundo.',
    badge: 'Top 30',
    color: 'text-amber-300',
    accent: 'border-amber-500/30 bg-amber-500/5',
    available: false,
  },
  {
    slug: 'mas-amarillas',
    icon: Square,
    title: 'Más tarjetas amarillas',
    description: 'Los reincidentes del fair play. De Mascherano a Cafu pasando por la lista negra del arbitraje.',
    badge: 'Top 20',
    color: 'text-yellow-300',
    accent: 'border-yellow-500/30 bg-yellow-500/5',
    available: false,
  },
  {
    slug: 'mas-rojas',
    icon: AlertOctagon,
    title: 'Más expulsados',
    description: 'Las rojas más recordadas y los pocos jugadores que repitieron expulsión en distintos Mundiales.',
    badge: 'Lista completa',
    color: 'text-red-300',
    accent: 'border-red-500/30 bg-red-500/5',
    available: false,
  },
  {
    slug: 'goles-en-propia',
    icon: Goal,
    title: 'Goles en propia puerta',
    description: 'Cada autogol en la historia de los Mundiales. Curiosidades, finales perdidas y errores legendarios.',
    badge: 'Lista completa',
    color: 'text-fuchsia-300',
    accent: 'border-fuchsia-500/30 bg-fuchsia-500/5',
    available: false,
  },
  {
    slug: 'selecciones-mas-tarjetas',
    icon: Users,
    title: 'Selecciones con más tarjetas',
    description: 'Brasil 10 rojas, Argentina 9, Uruguay 8... las nacionales más expulsadas a lo largo de la historia.',
    badge: 'Ranking',
    color: 'text-orange-300',
    accent: 'border-orange-500/30 bg-orange-500/5',
    available: false,
  },
];

export default async function RecordsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Récords mundialistas',
    url: localeUrl(locale, '/records'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Todos los récords históricos de los Mundiales de fútbol agrupados por categoría.',
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Récords', path: '/records' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>Récords · 1930 — 2026</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Récords<br />mundialistas
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Las marcas que se han escrito desde Uruguay 1930. Goleadores, supervivientes, expulsados y curiosidades, todo agregado desde nuestra base de datos histórica.
        </p>
      </header>

      <section className="mx-auto mt-16 grid w-full max-w-[1400px] gap-4 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3">
        {RECORDS.map((r) => {
          const href = withLocale(locale as Locale, `/records/${r.slug}`);
          const cardClass = `group relative flex flex-col gap-4 rounded-3xl border ${r.available ? r.accent : 'border-[var(--color-border)] bg-[var(--color-bg-2)]'} p-6 md:p-8 transition-colors ${r.available ? 'hover:border-[var(--color-border-strong)]' : 'opacity-60'}`;
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <r.icon className={`h-6 w-6 ${r.available ? r.color : 'text-[var(--color-fg-subtle)]'}`} />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {r.available ? r.badge : 'Próximamente'}
                </span>
              </div>
              <h2 className={`font-display text-2xl uppercase leading-tight ${r.available ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'} md:text-3xl`}>
                {r.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {r.description}
              </p>
              {r.available && (
                <span className="mt-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-pitch)]">
                  Ver récord
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </span>
              )}
            </>
          );
          return r.available ? (
            <Link key={r.slug} href={href} className={cardClass}>
              {inner}
            </Link>
          ) : (
            <div key={r.slug} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </section>

      <div className="h-24" />
    </div>
  );
}
