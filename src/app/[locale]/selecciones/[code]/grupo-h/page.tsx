import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Trophy, MapPin, Tv } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { AmazonProductGrid } from '@/components/affiliate/amazon-card';
import { getProductsByTeam } from '@/lib/amazon-products';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// Solo construimos esta sub-ruta para España (única selección con cluster
// dedicado de Grupo H). Para el resto, redirigimos a la ficha general.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, code: 'ESP' }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  if (code !== 'ESP') return {};
  return pageMetadata({
    locale,
    path: '/selecciones/ESP/grupo-h',
    title: 'España en el Grupo H del Mundial 2026 · Cabo Verde y Uruguay',
    description:
      'España en el Grupo H del Mundial 2026: rivales (Cabo Verde, Uruguay), calendario, sedes (Atlanta y Guadalajara), pronóstico, jugadores clave y dónde ver los partidos.',
    keywords: [
      'España Grupo H Mundial 2026',
      'España Cabo Verde Mundial',
      'España Uruguay Mundial',
      'calendario España Mundial 2026',
      'partidos España Mundial 2026',
      'rivales España Mundial 2026',
      'la Roja Mundial 2026',
    ],
  });
}

const PARTIDOS = [
  {
    matchday: 'J1',
    fechaIso: '2026-06-13',
    fecha: '13 jun 2026',
    rival: 'Cabo Verde',
    rivalCode: 'CPV',
    home: true,
    sede: 'Mercedes-Benz Stadium',
    ciudad: 'Atlanta · USA',
    venueSlug: 'mercedes-benz-stadium',
    horaLocal: '15:00 ET',
    horaEspaña: '21:00',
    expectativa:
      'Estreno de la Roja en su segundo Mundial post-La Roja. Cabo Verde llega como cenicienta, primer Mundial de su historia. Sobre el papel, gestión de minutos y posibles rotaciones.',
  },
  {
    matchday: 'J2',
    fechaIso: '2026-06-18',
    fecha: '18 jun 2026',
    rival: 'Uruguay',
    rivalCode: 'URU',
    home: false,
    sede: 'Estadio Akron',
    ciudad: 'Guadalajara · México',
    venueSlug: 'estadio-akron',
    horaLocal: '20:00 CST',
    horaEspaña: '04:00 (jueves madrugada)',
    expectativa:
      'El partido del grupo. Uruguay viene del subcampeonato continental y mantiene el ADN charrúa. Choque clásico que recuerda al Mundial 2010 (España campeona, Uruguay 4ª).',
  },
  {
    matchday: 'J3',
    fechaIso: '2026-06-24',
    fecha: '24 jun 2026',
    rival: 'Ganador playoff',
    rivalCode: 'TBD',
    home: true,
    sede: 'Por confirmar',
    ciudad: 'Sede pendiente del sorteo',
    venueSlug: null,
    horaLocal: 'Por confirmar',
    horaEspaña: 'Por confirmar',
    expectativa:
      'Cierre del grupo contra el ganador del playoff intercontinental. La identidad del rival se conocerá tras los repechajes de marzo de 2026.',
  },
];

const RIVALES = [
  {
    code: 'CPV',
    name: 'Cabo Verde',
    flag: '🇨🇻',
    historia:
      'Primer Mundial de la historia de Cabo Verde. Selección de un país de poco más de medio millón de habitantes, con tradición futbolística surgida de la diáspora portuguesa.',
    jugadoresClave: 'Ryan Mendes, Stopira, Jovane Cabral. Combinan experiencia europea (ligas portuguesa y francesa) con jóvenes talentos.',
    historial: 'Ningún antecedente directo con España. La eliminatoria africana de 2024-25 fue su clasificación histórica.',
  },
  {
    code: 'URU',
    name: 'Uruguay',
    flag: '🇺🇾',
    historia:
      'Doble campeón del mundo (1930, 1950) y semifinalista de Sudáfrica 2010 cuando España ganó la copa. Cuarta participación consecutiva. Leyenda celeste viva.',
    jugadoresClave: 'Federico Valverde, Darwin Núñez, Ronald Araújo, Manuel Ugarte. Plantilla joven, técnica y físicamente exigente.',
    historial: 'Cinco enfrentamientos previos en Mundiales, último en 2010. España y Uruguay nunca se han eliminado mutuamente.',
  },
  {
    code: 'TBD',
    name: 'Ganador playoff',
    flag: '⚽',
    historia:
      'El playoff intercontinental de marzo 2026 reúne a 6 selecciones de las distintas confederaciones. Posibles candidatos: Bolivia, Surinam, Jamaica, RDC, Iraq, Nueva Caledonia.',
    jugadoresClave: 'Por confirmar tras el playoff.',
    historial: 'Por confirmar.',
  },
];

const FAQ = [
  {
    q: '¿En qué grupo está España en el Mundial 2026?',
    a: 'España está en el Grupo H, junto a Cabo Verde, Uruguay y el ganador del playoff intercontinental. El sorteo se celebró el 5 de diciembre de 2025 en Las Vegas.',
  },
  {
    q: '¿Cuándo es el primer partido de España en el Mundial 2026?',
    a: 'España debuta el 13 de junio de 2026 contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta a las 21:00 hora peninsular española (15:00 ET).',
  },
  {
    q: '¿Cuándo juega España contra Uruguay?',
    a: 'El España-Uruguay se jugará el 18 de junio de 2026 en el Estadio Akron de Guadalajara (México). Empieza a las 20:00 hora local CST, lo que equivale a las 04:00 de la madrugada del jueves 19 en hora peninsular española.',
  },
  {
    q: '¿Quién es el rival más fuerte del Grupo H?',
    a: 'Sobre el papel, Uruguay. Es la única selección del grupo con dos títulos mundiales y cuarta posición reciente (2010). Cabo Verde llega como cenicienta y el ganador del playoff es por definición la selección más débil del grupo.',
  },
  {
    q: '¿Dónde ver los partidos de España en el Mundial 2026?',
    a: 'En España, Movistar Plus+ tiene los derechos vía DAZN. Es probable que RTVE asegure al menos los partidos de la selección en abierto, dado el marco legal español. Más detalles en nuestra guía dónde ver el Mundial 2026.',
  },
  {
    q: '¿Cuántas veces ha jugado España un Mundial en Norteamérica?',
    a: 'España ha disputado dos Mundiales en Norteamérica antes de este: México 1986 (cuartos, eliminada por Bélgica) y Estados Unidos 1994 (cuartos, eliminada por Italia con el famoso codazo de Tassotti a Luis Enrique). 2026 es la tercera.',
  },
  {
    q: '¿Cuándo fue la última vez que España y Uruguay se enfrentaron en un Mundial?',
    a: 'En la fase de grupos del Mundial Sudáfrica 2010 no se cruzaron. El último cruce mundialista fue en Sudáfrica 2010 fase final, donde España fue campeona y Uruguay cuarta, aunque no jugaron entre sí. La final ese año fue España-Holanda.',
  },
];

// ────────────────────────────────────────────────────────────────────

export default async function GrupoHPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  if (code !== 'ESP') notFound();
  setRequestLocale(locale);

  const espanaProducts = getProductsByTeam('ESP').slice(0, 4);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'España en el Grupo H del Mundial 2026',
    description:
      'Calendario, rivales, sedes y dónde ver los partidos de España en el Grupo H del Mundial 2026.',
    author: { '@type': 'Organization', name: 'Mundial de Fútbol' },
    publisher: { '@type': 'Organization', name: 'Mundial de Fútbol', url: localeUrl(locale, '/') },
    datePublished: '2026-04-26',
    dateModified: '2026-04-26',
    mainEntityOfPage: localeUrl(locale, '/selecciones/ESP/grupo-h'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // SportsEvent schema para los 3 partidos
  const partidosLd = PARTIDOS.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `España vs ${p.rival} · Mundial 2026 · Jornada ${p.matchday}`,
    startDate: p.fechaIso,
    sport: 'Football (Association)',
    location: p.sede !== 'Por confirmar'
      ? { '@type': 'Place', name: p.sede, address: p.ciudad }
      : undefined,
    competitor: [
      { '@type': 'SportsTeam', name: 'España' },
      { '@type': 'SportsTeam', name: p.rival },
    ],
  }));

  return (
    <article className="relative">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          ...partidosLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Selecciones', path: '/selecciones' },
            { name: 'España', path: '/selecciones/ESP' },
            { name: 'Grupo H', path: '/selecciones/ESP/grupo-h' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.18), transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/selecciones/ESP')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> España
          </Link>

          <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Trophy className="h-4 w-4" />
            <span>La Roja · Mundial 2026 · Grupo H</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            España<br />en el Grupo H
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            Tres partidos, dos países anfitriones (USA y México) y la primera
            piedra para una posible reedición del título de 2010. Calendario,
            rivales, sedes, jugadores y dónde verlos.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            <span>13 jun · vs Cabo Verde · Atlanta</span>
            <span>18 jun · vs Uruguay · Guadalajara</span>
            <span>24 jun · vs Playoff · Por confirmar</span>
          </div>
        </div>
      </section>

      {/* Partidos */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Calendario · Grupo H
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Los tres partidos
        </h2>

        <ol className="mt-10 space-y-4">
          {PARTIDOS.map((p) => (
            <li
              key={p.matchday}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl text-[var(--color-fg-subtle)]">
                    {p.matchday}
                  </span>
                  <h3 className="font-display text-2xl uppercase text-[var(--color-fg)] md:text-3xl">
                    España {p.home ? 'vs' : '—'} {p.rival}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {p.fecha}
                </span>
              </div>

              <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Sede
                  </div>
                  <div className="mt-1 text-[var(--color-fg)]">{p.sede}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[var(--color-fg-muted)]">
                    <MapPin className="h-3 w-3" /> {p.ciudad}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Hora local
                  </div>
                  <div className="mt-1 text-[var(--color-fg)]">{p.horaLocal}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Hora España
                  </div>
                  <div className="mt-1 text-[var(--color-fg)]">{p.horaEspaña}</div>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)]">
                {p.expectativa}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale as Locale, '/2026/donde-ver')}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Tv className="h-4 w-4" /> Dónde ver los partidos
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/2026/entradas')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Entradas oficiales FIFA
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Rivales */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Los tres rivales
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Quién es quién en el grupo
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {RIVALES.map((r) => (
            <div
              key={r.code}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{r.flag}</span>
                <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">
                  {r.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {r.historia}
              </p>
              <div className="space-y-2 text-xs leading-relaxed">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    Jugadores clave
                  </span>
                  <p className="mt-1 text-[var(--color-fg-muted)]">{r.jugadoresClave}</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    Historial vs España
                  </span>
                  <p className="mt-1 text-[var(--color-fg-muted)]">{r.historial}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos España */}
      {espanaProducts.length > 0 && (
        <AmazonProductGrid
          products={espanaProducts}
          title="Apoya a la Roja"
          subtitle="Camiseta oficial, accesorios y merchandising para vivir el Mundial con los colores de España."
        />
      )}

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Lo que más se pregunta
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="h-24" />
    </article>
  );
}
