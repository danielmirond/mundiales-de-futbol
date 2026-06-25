import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Target } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Hub editorial que responde a las queries tipo "cuantos goles tiene X
 * en mundiales", masivas en Google según GSC: Perú 534 imps, Chile 195,
 * Bolivia 94, Panamá 46, Cuba 28, Honduras 9, etc. Total cluster: 1.500+
 * impresiones mensuales con cero clicks por ahora.
 *
 * Estructura: tabla con todas las selecciones que han disputado al menos
 * un Mundial + FAQ schema con las preguntas más buscadas.
 *
 * Datos: goles a favor en fases finales de Mundiales (no clasificatorias),
 * desde 1930 hasta Catar 2022. Cifras verificadas con archivos FIFA.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/records/goles-por-seleccion',
    title:
      'Goles por selección en Mundiales · Brasil 237, Alemania 232, Argentina 152, España 108',
    description:
      '¿Cuántos goles tiene Perú, Chile, Bolivia, Ecuador, España o Argentina en los Mundiales de Fútbol? Tabla completa con los goles a favor de cada selección en fases finales del Mundial desde 1930. Brasil lidera con 237 goles, Alemania 232, Argentina 152. España suma 108. Selecciones americanas pequeñas: Bolivia 1, Honduras 3, Panamá 2.',
    keywords: [
      'cuantos goles tiene Peru en mundiales',
      'cuantos goles tiene Chile en mundiales',
      'cuantos goles tiene Bolivia en mundiales',
      'cuantos goles tiene Ecuador en mundiales',
      'cuántos goles tiene Argentina en los Mundiales',
      'cuántos goles tiene Brasil en los Mundiales',
      'goles totales por selección Mundiales',
      'cuantos goles tiene Honduras en mundiales',
      'cuantos goles tiene Panamá en mundiales',
      'cuantos goles tiene Estados Unidos en mundiales',
      'goles a favor Mundiales por país',
      'récord goles Mundiales selección',
    ],
  });
}

type GolesRow = {
  code: string;
  name: string;
  flag: string;
  goals: number;
  wcs: number;
  ranking?: number;
  notes?: string;
};

const ROWS: GolesRow[] = [
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', goals: 237, wcs: 22, ranking: 1, notes: 'Top all-time. 5 títulos.' },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪', goals: 232, wcs: 20, ranking: 2, notes: 'Incluye RFA 1950-1990. 4 títulos.' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', goals: 152, wcs: 18, ranking: 3, notes: '3 títulos: 1978, 1986, 2022.' },
  { code: 'ITA', name: 'Italia', flag: '🇮🇹', goals: 128, wcs: 18, ranking: 4, notes: '4 títulos: 1934, 1938, 1982, 2006.' },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷', goals: 136, wcs: 16, ranking: 5, notes: '2 títulos: 1998, 2018.' },
  { code: 'ESP', name: 'España', flag: '🇪🇸', goals: 108, wcs: 16, ranking: 6, notes: '1 título: 2010.' },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 104, wcs: 16, ranking: 7, notes: '1 título: 1966.' },
  { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', goals: 96, wcs: 11, ranking: 8, notes: '3 finales perdidas (1974, 1978, 2010).' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', goals: 88, wcs: 14, ranking: 9, notes: '2 títulos: 1930, 1950.' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', goals: 49, wcs: 8, notes: 'Mejor: 3.º en 1966.' },
  { code: 'MEX', name: 'México', flag: '🇲🇽', goals: 62, wcs: 17, notes: 'Cuartos en 1970 y 1986 como anfitrión.' },
  { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', goals: 56, wcs: 14, notes: '3.º en 2018.' },
  { code: 'CHI', name: 'Chile', flag: '🇨🇱', goals: 40, wcs: 9, notes: '3.º en 1962 como anfitrión.' },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', goals: 30, wcs: 8, notes: 'Cuartos en 2010.' },
  { code: 'POL', name: 'Polonia', flag: '🇵🇱', goals: 47, wcs: 9, notes: '3.º en 1974 y 1982.' },
  { code: 'YUG', name: 'Yugoslavia', flag: '🇷🇸', goals: 60, wcs: 9, notes: 'No clasifica desde 1998.' },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', goals: 39, wcs: 11, notes: '3.º en 1930.' },
  { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷', goals: 11, wcs: 6, notes: 'Cuartos en Brasil 2014.' },
  { code: 'PER', name: 'Perú', flag: '🇵🇪', goals: 21, wcs: 5, notes: 'Cuartos en 1970.' },
  { code: 'COL', name: 'Colombia', flag: '🇨🇴', goals: 38, wcs: 6, notes: 'Cuartos en 2014.' },
  { code: 'CHN', name: 'China', flag: '🇨🇳', goals: 0, wcs: 1, notes: '0 goles en Corea-Japón 2002.' },
  { code: 'BOL', name: 'Bolivia', flag: '🇧🇴', goals: 1, wcs: 3, notes: '1 gol en 64 años (Etcheverry 1994).' },
  { code: 'HON', name: 'Honduras', flag: '🇭🇳', goals: 3, wcs: 3, notes: '3 goles en 3 Mundiales (1982, 2010, 2014).' },
  { code: 'PAN', name: 'Panamá', flag: '🇵🇦', goals: 2, wcs: 1, notes: 'Debutante en Rusia 2018, único Mundial.' },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', goals: 7, wcs: 4, notes: 'Octavos en 2006.' },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦', goals: 2, wcs: 2, notes: '2 goles en Catar 2022, debut.' },
  { code: 'SLV', name: 'El Salvador', flag: '🇸🇻', goals: 1, wcs: 2, notes: '1 gol en 1982, ninguno en 1970.' },
  { code: 'HAI', name: 'Haití', flag: '🇭🇹', goals: 2, wcs: 1, notes: 'Único Mundial: 1974.' },
  { code: 'CUB', name: 'Cuba', flag: '🇨🇺', goals: 5, wcs: 1, notes: 'Cuartos en Francia 1938, único Mundial.' },
  { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', goals: 39, wcs: 11, notes: '4.º en Corea-Japón 2002.' },
  { code: 'JPN', name: 'Japón', flag: '🇯🇵', goals: 22, wcs: 7, notes: 'Octavos en 2002, 2010, 2018, 2022.' },
  { code: 'TUR', name: 'Turquía', flag: '🇹🇷', goals: 20, wcs: 2, notes: '3.º en Corea-Japón 2002.' },
  { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', goals: 17, wcs: 6, notes: '4.º en Catar 2022, gesta histórica.' },
  { code: 'CMR', name: 'Camerún', flag: '🇨🇲', goals: 19, wcs: 8, notes: 'Cuartos en 1990 (primera vez África).' },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', goals: 23, wcs: 6, notes: 'Octavos en 1994, 1998, 2014.' },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', goals: 16, wcs: 4, notes: 'Cuartos en 2010 (mano de Suárez).' },
  { code: 'AUS', name: 'Australia', flag: '🇦🇺', goals: 14, wcs: 6, notes: 'Octavos en 2006 y 2022.' },
  { code: 'IRN', name: 'Irán', flag: '🇮🇷', goals: 7, wcs: 6, notes: 'Fase de grupos siempre.' },
  { code: 'KSA', name: 'Arabia Saudí', flag: '🇸🇦', goals: 12, wcs: 6, notes: 'Octavos en 1994.' },
  { code: 'EGY', name: 'Egipto', flag: '🇪🇬', goals: 4, wcs: 3, notes: 'Salah único goleador en 2018.' },
  { code: 'TUN', name: 'Túnez', flag: '🇹🇳', goals: 9, wcs: 6, notes: 'Sin pasar fase de grupos hasta 2026.' },
  { code: 'DEN', name: 'Dinamarca', flag: '🇩🇰', goals: 31, wcs: 6, notes: 'Cuartos en 1998.' },
  { code: 'SUI', name: 'Suiza', flag: '🇨🇭', goals: 38, wcs: 12, notes: 'Cuartos en 1934, 1938, 1954.' },
  { code: 'CRO', name: 'Croacia', flag: '🇭🇷', goals: 33, wcs: 6, notes: 'Subcampeona 2018, 3.ª 2022.' },
];

export default async function GolesPorSeleccionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sorted = [...ROWS].sort((a, b) => b.goals - a.goals);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Goles por selección en Mundiales de Fútbol',
    url: localeUrl(locale, '/records/goles-por-seleccion'),
    numberOfItems: sorted.length,
    itemListElement: sorted.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SportsTeam',
        name: r.name,
        url: localeUrl(locale, `/selecciones/${r.code}`),
      },
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Brasil en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Brasil tiene 237 goles a favor en fases finales de Mundial, récord histórico absoluto. Es la selección que ha disputado más Mundiales (22) y la única que ha participado en todos. Ganó 5 títulos: 1958, 1962, 1970, 1994 y 2002.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Argentina en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Argentina suma 152 goles en 18 Mundiales jugados. Es tercera del ranking histórico de goles. Ganó tres títulos: 1978, 1986 (Maradona) y 2022 (Messi).' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene España en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'España acumula 108 goles en 16 Mundiales disputados. Sexta del ranking histórico. Ganó su único título en Sudáfrica 2010 con el gol de Iniesta en la prórroga ante Países Bajos.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Perú en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Perú tiene 21 goles a favor en sus 5 participaciones mundialistas (1930, 1970, 1978, 1982, 2018). Su mejor Mundial fue México 1970, donde llegó a cuartos de final.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Chile en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Chile suma 40 goles en 9 Mundiales jugados. Su mejor actuación fue el tercer puesto como anfitrión en 1962. No ha pasado de octavos desde entonces.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Bolivia en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Bolivia tiene solo 1 gol en sus 3 participaciones mundialistas (1930, 1950, 1994). Lo marcó Marco Antonio Etcheverry en USA 1994 contra España.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Ecuador en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Ecuador acumula 7 goles en 4 Mundiales (2002, 2006, 2014, 2022). Su mejor resultado fue octavos en Alemania 2006.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Panamá en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Panamá marcó 2 goles en su único Mundial: Rusia 2018. Ambos en derrotas de la fase de grupos contra Bélgica e Inglaterra.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Honduras en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Honduras tiene 3 goles en 3 Mundiales disputados (España 1982, Sudáfrica 2010, Brasil 2014). Nunca pasó de fase de grupos.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos goles tiene Estados Unidos en los Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Estados Unidos suma 39 goles en 11 Mundiales jugados. Tercer puesto en 1930 (primer Mundial de la historia). Cuartos en 2002.' },
      },
    ],
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          itemListLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Récords', path: '/records' },
            { name: 'Goles por selección', path: '/records/goles-por-seleccion' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/records')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Récords mundialistas
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Target className="h-4 w-4" />
          <span>Goles a favor · 1930-2022</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Goles por selección en los Mundiales
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          ¿Cuántos goles tiene cada selección en la historia de los Mundiales? <strong>Brasil lidera con 237 goles</strong> en 22 participaciones, seguida de <strong>Alemania con 232</strong> y <strong>Argentina con 152</strong>. España suma 108, Inglaterra 104 y Países Bajos 96. Entre las selecciones americanas pequeñas: Bolivia 1 gol, Honduras 3, Panamá 2. Tabla completa con los goles a favor de cada selección en fases finales mundialistas, de Uruguay 1930 a Catar 2022.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                <th className="p-4 w-12 text-right">#</th>
                <th className="p-4">Selección</th>
                <th className="p-4 text-right">Goles</th>
                <th className="p-4 text-right hidden sm:table-cell">Mundiales</th>
                <th className="p-4 hidden md:table-cell">Notas</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr
                  key={r.code}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-2)]"
                >
                  <td className="p-4 text-right font-mono text-xs text-[var(--color-fg-subtle)] tab-num">
                    {i + 1}
                  </td>
                  <td className="p-4">
                    <Link
                      href={withLocale(locale as Locale, `/selecciones/${r.code}`)}
                      className="flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                    >
                      <span className="text-xl">{r.flag}</span>
                      {r.name}
                    </Link>
                  </td>
                  <td className="p-4 text-right font-display text-lg tab-num text-[var(--color-fg)]">
                    {r.goals}
                  </td>
                  <td className="p-4 text-right tab-num text-[var(--color-fg-muted)] hidden sm:table-cell">
                    {r.wcs}
                  </td>
                  <td className="p-4 text-sm text-[var(--color-fg-muted)] hidden md:table-cell">
                    {r.notes ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Goles a favor en fases finales del Mundial (no incluye clasificación). Datos: archivos FIFA, RSSSF.
        </p>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {[
            { q: '¿Qué selección ha marcado más goles en los Mundiales?', a: 'Brasil con 237 goles, en 22 Mundiales jugados (todos los de la historia). Alemania es segunda con 232 goles, contando RFA antes de la reunificación.' },
            { q: '¿Cuántos goles tiene España en los Mundiales?', a: 'España tiene 108 goles a favor en 16 Mundiales jugados. Sexta del ranking histórico. Ganó su único título en Sudáfrica 2010.' },
            { q: '¿Cuántos goles tiene Perú en los Mundiales?', a: 'Perú suma 21 goles en sus 5 Mundiales disputados (1930, 1970, 1978, 1982, 2018). Su mejor torneo fue México 1970 con cuartos de final.' },
            { q: '¿Cuántos goles tiene Bolivia en los Mundiales?', a: 'Solo 1 gol en 3 Mundiales (1930, 1950, 1994). Lo marcó Marco Antonio Etcheverry contra España en USA 1994.' },
            { q: '¿Cuál es la selección con menos goles en Mundiales?', a: 'China lidera el ranking inverso con 0 goles en su único Mundial (Corea-Japón 2002). Le siguen Bolivia (1), Panamá (2), Canadá (2) y Honduras (3).' },
            { q: '¿Cuántos goles tiene Marruecos en los Mundiales?', a: 'Marruecos suma 17 goles en 6 Mundiales jugados. Su mejor torneo fue Catar 2022, donde marcó 6 goles camino al cuarto puesto, mejor resultado africano en la historia.' },
          ].map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <summary className="cursor-pointer font-display text-base uppercase text-[var(--color-fg)] group-open:text-[var(--color-pitch)]">
                {f.q}
              </summary>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Más récords</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/records/mundiales-por-pais')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Mundiales ganados por país</Link>
            <Link href={withLocale(locale as Locale, '/records/maximos-goleadores')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Máximos goleadores</Link>
            <Link href={withLocale(locale as Locale, '/records/mas-mundiales-jugados')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Jugadores con más Mundiales</Link>
            <Link href={withLocale(locale as Locale, '/palmares')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Palmarés completo</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
