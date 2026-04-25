import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAllTeamsRanked, teamDisplayName } from '@/lib/data/teams';
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
    path: '/selecciones',
    title: 'Selecciones · Todas las nacionales mundialistas',
    description:
      'Las selecciones que han disputado un Mundial de fútbol: campeones, finalistas y debutantes. De Brasil y Alemania a las selecciones que solo han tocado la copa una vez.',
    keywords: [
      'selecciones mundialistas',
      'campeones Copa del Mundo',
      'Brasil Mundial',
      'Argentina Alemania Italia',
      'naciones FIFA',
    ],
  });
}

export default async function SelectionsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const teams = await getAllTeamsRanked();

  const champions = teams.filter((t) => t.titles > 0);
  const others = teams.filter((t) => t.titles === 0);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Selecciones mundialistas',
    url: localeUrl(locale, '/selecciones'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    numberOfItems: teams.length,
    description: 'Listado de todas las selecciones nacionales que han participado en una Copa del Mundo.',
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Selecciones', path: '/selecciones' },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Archivo · Selecciones
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {teams.length} selecciones
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
          Todas las selecciones que han disputado al menos un partido en un Mundial.
          Ordenadas por títulos, luego por subcampeonatos y apariciones.
        </p>
      </div>

      {/* Champions band */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Campeones
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {champions.length} naciones con título
        </h2>
        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-4">
          {champions.map((t) => (
            <Link
              key={t.code}
              href={withLocale(locale as Locale, `/selecciones/${t.code}`)}
              className="group flex flex-col gap-3 bg-[var(--color-bg)] p-6 transition-colors hover:bg-[var(--color-bg-2)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{t.flag_emoji ?? '🏳️'}</span>
                <span className="rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-pitch)] tab-num">
                  {t.titles}★
                </span>
              </div>
              <div className="mt-auto">
                <div className="font-display text-2xl uppercase leading-none text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                  {teamDisplayName(t)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  {t.wc_count} mundiales · {t.matches_played} partidos
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Rest of teams */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Resto de participantes
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {others.length} selecciones
        </h2>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                <th className="p-4 w-8"></th>
                <th className="p-4">Selección</th>
                <th className="p-4 hidden md:table-cell">Confederación</th>
                <th className="p-4 text-right">Mundiales</th>
                <th className="p-4 text-right">PJ</th>
                <th className="p-4 text-right hidden md:table-cell">G-E-P</th>
                <th className="p-4 text-right hidden md:table-cell">GF-GC</th>
                <th className="p-4 text-right">Subcampeón</th>
              </tr>
            </thead>
            <tbody>
              {others.map((t) => (
                <tr
                  key={t.code}
                  className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <td className="p-4 text-xl">{t.flag_emoji ?? ''}</td>
                  <td className="p-4">
                    <Link
                      href={withLocale(locale as Locale, `/selecciones/${t.code}`)}
                      className="font-medium text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)]"
                    >
                      {teamDisplayName(t)}
                    </Link>
                  </td>
                  <td className="p-4 hidden md:table-cell font-mono text-xs text-[var(--color-fg-muted)]">
                    {t.confederation ?? '—'}
                  </td>
                  <td className="p-4 text-right tab-num text-[var(--color-fg)]">{t.wc_count}</td>
                  <td className="p-4 text-right tab-num text-[var(--color-fg)]">{t.matches_played}</td>
                  <td className="p-4 text-right hidden md:table-cell tab-num text-[var(--color-fg-muted)]">
                    {t.wins}-{t.draws}-{t.losses}
                  </td>
                  <td className="p-4 text-right hidden md:table-cell tab-num text-[var(--color-fg-muted)]">
                    {t.goals_for}-{t.goals_against}
                  </td>
                  <td className="p-4 text-right tab-num">
                    {t.runners_up > 0 ? (
                      <span className="text-[var(--color-sun)]">{t.runners_up}</span>
                    ) : (
                      <span className="text-[var(--color-fg-subtle)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
