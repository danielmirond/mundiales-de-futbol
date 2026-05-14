import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  Briefcase,
  Ban,
  CheckCircle2,
  Wine,
  Flag,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import {
  CLUSTER_PAGES,
  CLEAR_BAG_POLICY,
  PROHIBITED_ITEMS,
  ALCOHOL_BY_COUNTRY,
  FAQ,
} from '@/lib/wc-2026-stadium-rules';

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
    path: '/2026/normas-estadios',
    title: 'Normas en los estadios del Mundial 2026 · Bolsa, items prohibidos y reglas FIFA',
    description:
      'Reglamento oficial FIFA del Mundial 2026 para los 16 estadios USA, Canadá y México: política de bolsa transparente unificada, 22 items prohibidos, alcohol por país, mensajes políticos y sanciones por incumplimiento.',
    keywords: [
      'normas estadios Mundial 2026',
      'reglas estadio Mundial 2026',
      'qué llevar al Mundial 2026',
      'qué se puede llevar al estadio',
      'items prohibidos Mundial 2026',
      'clear bag policy Mundial 2026',
      'mochila transparente Mundial 2026',
      'alcohol estadio Mundial 2026',
      'sanciones estadio Mundial 2026',
      'banderas Mundial 2026',
      'código de conducta Mundial 2026',
      'FIFA stadium code of conduct 2026',
    ],
    type: 'article',
  });
}

function pageIcon(slug: string) {
  const map: Record<string, React.ReactNode> = {
    'mochila-transparente': <Briefcase className="h-5 w-5 text-[var(--color-pitch)]" />,
    'items-prohibidos': <Ban className="h-5 w-5 text-[var(--color-pitch)]" />,
    'que-puedes-llevar': <CheckCircle2 className="h-5 w-5 text-[var(--color-pitch)]" />,
    'alcohol-por-pais': <Wine className="h-5 w-5 text-[var(--color-pitch)]" />,
    'banderas-y-mensajes': <Flag className="h-5 w-5 text-[var(--color-pitch)]" />,
    sanciones: <AlertTriangle className="h-5 w-5 text-[var(--color-pitch)]" />,
  };
  return map[slug] ?? <ShieldCheck className="h-5 w-5 text-[var(--color-pitch)]" />;
}

export default async function NormasEstadiosPillarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const url = localeUrl(locale, '/2026/normas-estadios');
  const subPages = CLUSTER_PAGES.filter((p) => p.slug !== '');

  // FAQPage para los 8 FAQs comunes del cluster.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // CollectionPage con ItemList de las 6 sub-páginas.
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Normas en los estadios del Mundial 2026',
    description:
      'Reglamento oficial FIFA del Mundial 2026: bolsa transparente unificada, 22 items prohibidos, alcohol por país, mensajes políticos y sanciones.',
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: subPages.length,
      itemListElement: subPages.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: localeUrl(locale, p.pathname),
      })),
    },
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          collectionLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Normas estadios', path: '/2026/normas-estadios' },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShieldCheck className="mr-2 inline h-3 w-3" />
          Reglamento oficial FIFA · actualizado 12 mayo 2026
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Normas<br />
          <span className="text-[var(--color-pitch)]">en el estadio</span>
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          FIFA ha publicado el <strong>primer reglamento unificado</strong> para los 16
          estadios del Mundial 2026 en Estados Unidos, Canadá y México. Bolsa
          transparente para los tres países, lista de 22 items prohibidos común a
          todas las sedes y matices por jurisdicción local en alcohol y mensajes
          políticos. Aquí tienes la versión completa, ordenada por temas.
        </p>
      </header>

      {/* Sub-páginas grid */}
      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          El cluster completo
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          {subPages.length} guías especializadas
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subPages.map((p) => (
            <li key={p.slug}>
              <Link
                href={withLocale(locale as Locale, p.pathname)}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
              >
                <div className="flex items-start justify-between">
                  {pageIcon(p.slug)}
                  <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
                <h3 className="font-display text-base uppercase leading-tight text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Tabla resumen visual */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Resumen visual
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          Lo más importante en 4 puntos
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Briefcase className="mr-2 inline h-3 w-3" /> Bolsa transparente
            </div>
            <p className="mt-3 font-display text-3xl tab-num">
              {CLEAR_BAG_POLICY.maxSize.width}×{CLEAR_BAG_POLICY.maxSize.depth}×{CLEAR_BAG_POLICY.maxSize.height}″
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Pulgadas máximo (≈ {CLEAR_BAG_POLICY.maxSizeCm.width}×{CLEAR_BAG_POLICY.maxSizeCm.depth}×{CLEAR_BAG_POLICY.maxSizeCm.height} cm). Política
              unificada en los 16 estadios USA + CAN + MEX.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Ban className="mr-2 inline h-3 w-3" /> Items prohibidos
            </div>
            <p className="mt-3 font-display text-3xl tab-num">{PROHIBITED_ITEMS.length}</p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Desde drones y palos selfie hasta pirotecnia, banderas con asta y
              comida del exterior. Lista detallada con razón de la prohibición.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Wine className="mr-2 inline h-3 w-3" /> Alcohol por país
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {ALCOHOL_BY_COUNTRY.map((c) => (
                <li key={c.countryCode} className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[var(--color-fg)]">
                    <span aria-hidden>{c.flag}</span>
                    {c.countryName}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
                      c.alcohol === 'banned-total' ? 'text-red-500' : 'text-[var(--color-pitch)]'
                    }`}
                  >
                    {c.alcohol === 'banned-total' ? 'Prohibido' : 'Zonas autorizadas'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <AlertTriangle className="mr-2 inline h-3 w-3" /> Sanciones
            </div>
            <p className="mt-3 font-display text-3xl tab-num">3 niveles</p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Decomiso simple → expulsión sin reembolso → denuncia ante DHS / RCMP /
              Guardia Nacional según país.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          Lo que más se pregunta
        </h2>

        <dl className="mt-8 divide-y divide-[var(--color-border)]">
          {FAQ.map((entry, i) => (
            <details key={i} className="group py-5">
              <summary className="cursor-pointer list-none font-display text-base uppercase leading-tight text-[var(--color-fg)] hover:text-[var(--color-pitch)]">
                <span className="inline-flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tab-num text-[var(--color-fg-subtle)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {entry.q}
                </span>
              </summary>
              <p className="mt-4 pl-10 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {entry.a}
              </p>
            </details>
          ))}
        </dl>
      </section>

      {/* CTA cluster Mundial 2026 */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-10">
          <h2 className="font-display text-2xl uppercase">Antes del partido</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
            FIFA actualizará el código de conducta en mayo y junio con guías «Know Before
            You Go» específicas por sede. Aquí tienes el resto del cluster del Mundial 2026.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Las 16 sedes
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/entradas')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Entradas
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/donde-ver')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Dónde ver
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Hub Mundial 2026
            </Link>
          </div>
        </div>
      </section>

      {/* Fuentes */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Fuentes oficiales
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://digitalhub.fifa.com/m/50ebae81c412b7d5/original/FIFA-World-Cup-2026-Stadium-Code-of-Conduct.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
              >
                FIFA · Stadium Code of Conduct (PDF oficial)
              </a>
            </li>
            <li>
              <a
                href="https://gpcustomersupportfwc2026.tickets.fifa.com/hc/en-gb/articles/30198151350813"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
              >
                FIFA Tickets · restricciones para entrar al estadio
              </a>
            </li>
            <li>
              <a
                href="https://fifaworldcup26.hospitality.fifa.com/know-before-you-go/miami"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
              >
                FIFA · Hospitality «Know Before You Go» (Miami como ejemplo)
              </a>
            </li>
            <li>
              <a
                href="https://www.nytimes.com/athletic/7273489/2026/05/12/world-cup-stadium-code-of-conduct-prohibited-items/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
              >
                The Athletic (NYT) · World Cup stadium code of conduct (12 may 2026)
              </a>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
