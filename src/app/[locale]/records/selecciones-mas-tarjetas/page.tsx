import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Users } from 'lucide-react';
import { getTeamCardsRanking } from '@/lib/data/teams';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

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
    path: '/records/selecciones-mas-tarjetas',
    title: 'Selecciones con más tarjetas en Mundiales · Ranking histórico',
    description:
      'Ranking de selecciones por tarjetas en la historia de los Mundiales: Brasil 10 rojas, Argentina 9, Uruguay 8. Las nacionales con peor disciplina histórica.',
    keywords: [
      'selección con más tarjetas Mundial',
      'Brasil expulsiones Mundiales',
      'Argentina rojas Copa del Mundo',
      'ranking disciplinario selecciones FIFA',
    ],
  });
}

export default async function SeleccionesTarjetasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const ranking = await getTeamCardsRanking(30);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Selecciones con más tarjetas en Mundiales',
    numberOfItems: ranking.length,
    itemListElement: ranking.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SportsTeam',
        name: r.team_name,
        url: localeUrl(locale, `/selecciones/${r.team_code}`),
      },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          itemListLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Récords', path: '/records' },
            { name: 'Selecciones con más tarjetas', path: '/records/selecciones-mas-tarjetas' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/records')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Récords mundialistas
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-orange-300">
          <Users className="h-4 w-4" />
          <span>Ranking · 22 ediciones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Selecciones<br />más expulsadas
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Brasil lidera el récord histórico de expulsiones (10 rojas en 22 Mundiales jugados). Argentina (9) y Uruguay (8) completan el podio sudamericano. Cada partido cuenta: el agregado es total, no por edición.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="w-14 px-4 py-4">#</th>
                <th className="px-4 py-4">Selección</th>
                <th className="px-4 py-4 text-right">Rojas</th>
                <th className="px-4 py-4 text-right">Amarillas</th>
                <th className="hidden px-4 py-4 text-right md:table-cell">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {ranking.map((r, i) => (
                <tr key={r.team_code} className="hover:bg-[var(--color-bg-2)]/40">
                  <td className="px-4 py-3 font-mono text-[var(--color-fg-subtle)] tab-num">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={withLocale(locale as Locale, `/selecciones/${r.team_code}`)}
                      className="font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                    >
                      {r.team_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tab-num text-red-300">{r.reds}</td>
                  <td className="px-4 py-3 text-right font-mono tab-num text-yellow-300">{r.yellows}</td>
                  <td className="hidden px-4 py-3 text-right font-mono tab-num text-[var(--color-fg-muted)] md:table-cell">
                    {r.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="h-24" />
    </article>
  );
}
