import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ListChecks, Clock } from 'lucide-react';
import {
  SQUADS_2026,
  STATUS_LABELS,
  type SquadStatus,
} from '@/lib/wc-2026-squads';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const STATUS_COLORS: Record<SquadStatus, string> = {
  pending: 'border-[var(--color-border)] text-[var(--color-fg-subtle)]',
  provisional: 'border-amber-500/40 text-amber-300',
  final: 'border-[var(--color-pitch)]/40 text-[var(--color-pitch)]',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/listas',
    title:
      'Listas Mundial 2026: convocatorias de las 48 selecciones por país',
    description:
      'Convocatorias oficiales del Mundial 2026 selección a selección. Lista de los 26 jugadores por país conforme cada federación las anuncia, del 5 al 11 de mayo (provisional) y al 1 de junio (definitiva).',
    keywords: [
      'lista España Mundial 2026',
      'convocatoria Argentina Mundial 2026',
      'lista Brasil Mundial 2026',
      'plantilla Francia Mundial 2026',
      'lista 26 jugadores Mundial 2026',
      'convocatorias Mundial 2026 selecciones',
    ],
  });
}

export default async function ListasIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Ordenar: anunciadas primero, luego pendientes.
  const sorted = [...SQUADS_2026].sort((a, b) => {
    const order = { final: 0, provisional: 1, pending: 2 } as const;
    if (order[a.status] !== order[b.status]) {
      return order[a.status] - order[b.status];
    }
    return (a.teamCode ?? '').localeCompare(b.teamCode ?? '');
  });

  const announcedCount = SQUADS_2026.filter((s) => s.status !== 'pending').length;
  const finalCount = SQUADS_2026.filter((s) => s.status === 'final').length;

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Listas Mundial 2026',
    url: localeUrl(locale, '/2026/listas'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Convocatorias del Mundial 2026 selección por selección, actualizadas conforme cada federación las anuncia.',
    hasPart: SQUADS_2026.map((s) => ({
      '@type': 'SportsTeam',
      name: TEAMS_2026[s.teamCode]?.name ?? s.teamCode,
      url: localeUrl(locale, `/2026/listas/${s.teamCode}`),
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
            { name: 'Listas', path: '/2026/listas' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ListChecks className="h-4 w-4" />
          <span>Convocatorias · 48 selecciones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Listas del<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Convocatorias oficiales de las 48 selecciones del Mundial 2026,
          actualizadas conforme cada federación las anuncia. FIFA fija dos
          plazos: lista provisional el 11 de mayo y definitiva (23-26
          jugadores con 3 porteros obligatorios) el 1 de junio.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          <span>{announcedCount}/48 anunciadas</span>
          <span>{finalCount}/48 definitivas</span>
          <span className="inline-flex items-center gap-2 text-[var(--color-pitch)]">
            <Clock className="h-3 w-3" />
            Plazo final FIFA: 1 junio 2026
          </span>
        </div>
      </header>

      <ul className="mx-auto mt-16 grid w-full max-w-[1400px] gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] px-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((s) => {
          const team = TEAMS_2026[s.teamCode];
          if (!team) return null;
          return (
            <li key={s.teamCode} className="bg-[var(--color-bg)]">
              <Link
                href={withLocale(locale as Locale, `/2026/listas/${s.teamCode}`)}
                className="group flex h-full items-center gap-4 p-6 transition-colors hover:bg-[var(--color-bg-2)]"
              >
                <span className="text-3xl" aria-hidden>
                  {team.flag}
                </span>
                <div className="flex-1">
                  <div className="font-display text-xl uppercase leading-none text-[var(--color-fg)] group-hover:text-[var(--color-pitch)] transition-colors">
                    {team.name}
                  </div>
                  <div
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] ${STATUS_COLORS[s.status]}`}
                  >
                    {STATUS_LABELS[s.status]}
                    {s.players.length > 0 && (
                      <span className="opacity-70">· {s.players.length}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-pitch)] rtl:rotate-180" />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mx-auto mt-8 w-full max-w-[1400px] px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)] md:px-10">
        Página actualizada en tiempo real. Cada lista enlaza a la fuente
        oficial de la federación.
      </p>

      <div className="h-24" />
    </div>
  );
}
