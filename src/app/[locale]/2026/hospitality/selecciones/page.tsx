import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Flag } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { FMT_TEAM_PARAMS } from '@/lib/wc-2026-hospitality';
import { TEAMS_2026 } from '@/lib/wc-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/hospitality/selecciones',
    title: 'Follow My Team Mundial 2026 · Hospitality por selección · 48 equipos',
    description:
      'Hospitality "Follow My Team" para las 48 selecciones del Mundial 2026: sigue a Argentina, Brasil, España, México, USA, Inglaterra, Francia, Alemania y el resto desde la fase de grupos hasta donde llegue tu equipo.',
    keywords: [
      'follow my team mundial 2026',
      'hospitality por seleccion mundial',
      'hospitality argentina mundial',
      'hospitality espana mundial 2026',
      'hospitality brasil mundial 2026',
    ],
    type: 'article',
  });
}

// Agrupar por confederación
const CONFS = ['CONCACAF', 'CONMEBOL', 'UEFA', 'CAF', 'AFC', 'OFC'] as const;
type Conf = typeof CONFS[number];

const TEAMS_BY_CONF: Record<Conf, { code: string; name: string; flag: string }[]> = {
  CONCACAF: [],
  CONMEBOL: [],
  UEFA: [],
  CAF: [],
  AFC: [],
  OFC: [],
};

for (const code of Object.keys(FMT_TEAM_PARAMS)) {
  const team = TEAMS_2026[code as keyof typeof TEAMS_2026];
  if (!team) continue;
  TEAMS_BY_CONF[team.conf as Conf].push({ code, name: team.name, flag: team.flag });
}

const CONF_LABELS: Record<Conf, string> = {
  CONCACAF: 'CONCACAF · USA, Canadá, México y Caribe',
  CONMEBOL: 'CONMEBOL · Sudamérica',
  UEFA: 'UEFA · Europa',
  CAF: 'CAF · África',
  AFC: 'AFC · Asia',
  OFC: 'OFC · Oceanía',
};

export default async function SeleccionesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Follow My Team Mundial 2026',
            url: localeUrl(locale, '/2026/hospitality/selecciones'),
            inLanguage: locale,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: Object.keys(FMT_TEAM_PARAMS)
                .map((code, i) => {
                  const team = TEAMS_2026[code as keyof typeof TEAMS_2026];
                  if (!team) return null;
                  return {
                    '@type': 'ListItem',
                    position: i + 1,
                    name: team.name,
                    url: localeUrl(locale, `/2026/hospitality/selecciones/${code}`),
                  };
                })
                .filter(Boolean),
            },
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Por selección', path: '/2026/hospitality/selecciones' },
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
          <Flag className="mr-2 inline h-3 w-3" /> 48 selecciones
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Follow My Team por selección
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          El paquete <strong>Follow My Team</strong> te da asiento premium
          garantizado en todos los partidos de tu selección, desde la fase
          de grupos hasta donde llegue. Selecciona tu equipo abajo.
        </p>
      </header>

      {CONFS.map((conf) => {
        const teams = TEAMS_BY_CONF[conf];
        if (teams.length === 0) return null;
        return (
          <section key={conf} className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
            <h2 className="font-display text-2xl uppercase">{CONF_LABELS[conf]}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {teams.map((t) => (
                <Link
                  key={t.code}
                  href={withLocale(locale as Locale, `/2026/hospitality/selecciones/${t.code}`)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-2 text-sm transition-colors hover:border-[var(--color-pitch)]/60 hover:text-[var(--color-pitch)]"
                >
                  <span>{t.flag}</span>
                  <span>{t.name}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

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
            <Link href={withLocale(locale as Locale, '/2026/hospitality/sedes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por sede
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/faq')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
