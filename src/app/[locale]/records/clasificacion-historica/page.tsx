import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';
import { allTimeStandings } from '@/lib/wc-head-to-head';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/records/clasificacion-historica',
    title: 'Clasificación histórica de los Mundiales: tabla de todas las selecciones (1930-2022)',
    description:
      'La tabla de posiciones histórica de la Copa Mundial de fútbol: todas las selecciones ordenadas por puntos, con partidos, victorias, empates, derrotas y goles de todos los Mundiales (1930-2022). Brasil lidera, seguido de Alemania, Argentina e Italia.',
    keywords: [
      'posiciones de copa mundial de fútbol',
      'clasificación mundial',
      'clasificación histórica Mundiales',
      'tabla histórica Copa del Mundo',
      'ranking selecciones mundiales',
    ],
  });
}

function withLocale(locale: string, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export default async function ClasificacionHistoricaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const rows = allTimeStandings();
  const top = rows[0];

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-28 md:px-10 md:pt-32">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Récords', path: '/records' },
          { name: 'Clasificación histórica', path: '/records/clasificacion-historica' },
        ])}
      />

      <Link
        href={withLocale(locale, '/records')}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Récords
      </Link>

      <header className="mt-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Tabla histórica · 1930-2022
        </div>
        <h1 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.95]">
          Clasificación histórica de los Mundiales
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          La tabla de posiciones de <strong className="text-[var(--color-fg)]">todas las
          selecciones</strong> en la historia de la Copa Mundial de fútbol (1930-2022), ordenada por
          puntos (3 por victoria, 1 por empate). Lidera{' '}
          <strong className="text-[var(--color-fg)]">{top.name}</strong> con {top.points} puntos en{' '}
          {top.played} partidos. Se fusionan los linajes (RFA y RDA en Alemania, URSS en Rusia,
          Yugoslavia en Serbia, Checoslovaquia en Chequia).
        </p>
      </header>

      <div className="mt-10 overflow-x-auto rounded-3xl border border-[var(--color-border)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-[var(--color-bg-2)] font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              <th className="px-3 py-3 text-left">#</th>
              <th className="px-3 py-3 text-left">Selección</th>
              <th className="px-2 py-3 text-center" title="Mundiales jugados">M</th>
              <th className="px-2 py-3 text-center" title="Partidos jugados">PJ</th>
              <th className="px-2 py-3 text-center">G</th>
              <th className="px-2 py-3 text-center">E</th>
              <th className="px-2 py-3 text-center">P</th>
              <th className="px-2 py-3 text-center" title="Goles a favor">GF</th>
              <th className="px-2 py-3 text-center" title="Goles en contra">GC</th>
              <th className="px-2 py-3 text-center" title="Diferencia de goles">DG</th>
              <th className="px-3 py-3 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const dg = r.goalsFor - r.goalsAgainst;
              return (
                <tr
                  key={r.code}
                  className="border-t border-[var(--color-border)] odd:bg-[var(--color-bg)] even:bg-[var(--color-bg-2)]/40"
                >
                  <td className="px-3 py-2.5 font-mono tab-num text-[var(--color-fg-subtle)]">
                    {i + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={withLocale(locale, `/selecciones/${r.code}`)}
                      className="inline-flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                    >
                      <span aria-hidden>{r.flag}</span>
                      {r.name}
                    </Link>
                  </td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-subtle)]">{r.wcCount}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.played}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.wins}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.draws}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.losses}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.goalsFor}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.goalsAgainst}</td>
                  <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-subtle)]">
                    {dg > 0 ? `+${dg}` : dg}
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono tab-num font-semibold text-[var(--color-pitch)]">
                    {r.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
        Datos de las fases finales de todos los Mundiales (1930-2022). Puntuación a 3 puntos por
        victoria para una comparación homogénea. Los partidos resueltos en la prórroga cuentan por
        su resultado; las eliminatorias por penaltis se contabilizan como empate en el cómputo de
        goles. Consulta el{' '}
        <Link
          href={withLocale(locale, '/records')}
          className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-pitch)]"
        >
          resto de récords del Mundial
        </Link>
        .
      </p>
    </main>
  );
}
