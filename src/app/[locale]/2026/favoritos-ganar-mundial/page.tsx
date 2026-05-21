import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { countryName } from '@/lib/country-names';
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
    path: '/2026/favoritos-ganar-mundial',
    title: 'Favoritos para ganar el Mundial 2026: cuotas, ranking y análisis de los 12 candidatos',
    description:
      'Quién va a ganar el Mundial 2026: ranking de los 12 favoritos según casas de apuestas (Bet365, William Hill, Pinnacle), análisis de plantilla, grupo y pronóstico realista. Argentina, Francia, Brasil, España, Inglaterra y los outsiders.',
    keywords: [
      'favoritos mundial 2026',
      'quien va a ganar el mundial 2026',
      'cuotas mundial 2026',
      'ranking selecciones mundial 2026',
      'apuestas mundial 2026',
      'pronosticos mundial 2026',
      'favoritos copa del mundo 2026',
      'world cup 2026 favourites',
      'world cup 2026 odds',
      'argentina mundial 2026 ganar',
      'brasil mundial 2026 ganar',
      'francia mundial 2026 ganar',
    ],
    type: 'article',
  });
}

type Favorito = {
  code: string;
  rank: number;
  cuota: string;
  cuotaNum: number;
  group: string;
  status: 'campeona' | 'finalista' | 'semifinalista' | 'cabeza-serie' | 'anfitriona' | 'outsider';
  fortaleza: string;
  riesgo: string;
  estrella: string;
  partidoClave: string;
};

const FAVORITOS: Favorito[] = [
  {
    code: 'ARG',
    rank: 1,
    cuota: '5/1',
    cuotaNum: 5,
    group: 'J',
    status: 'campeona',
    fortaleza: 'Campeona vigente con núcleo de Qatar 2022 reforzado por Julián Álvarez consolidado y Mac Allister en su mejor versión.',
    riesgo: 'Messi cumple 39 años durante el torneo. Si no rinde como en Qatar, el equipo pierde su carta principal en jugadas clave.',
    estrella: 'Lionel Messi · posible despedida mundialista',
    partidoClave: '23 jun · Argentina-Austria · AT&T Stadium · Dallas',
  },
  {
    code: 'FRA',
    rank: 2,
    cuota: '6/1',
    cuotaNum: 6,
    group: 'I',
    status: 'finalista',
    fortaleza: 'Mbappé llega como capitán del PSG con 2 Champions y 5 ligas francesas. Tchouaméni y Camavinga consolidan el centro del campo.',
    riesgo: 'La defensa post-Varane es la más débil de las últimas tres décadas. Cualquier rival con velocidad arriba puede explotar el lado izquierdo.',
    estrella: 'Kylian Mbappé · capitán y Bota de Oro Qatar 2022',
    partidoClave: '26 jun · Francia-Noruega · Gillette Stadium · Boston',
  },
  {
    code: 'BRA',
    rank: 3,
    cuota: '7/1',
    cuotaNum: 7,
    group: 'C',
    status: 'cabeza-serie',
    fortaleza: 'La generación Vinicius Jr / Rodrygo / Endrick / Raphinha es la más profunda en ofensiva desde Ronaldo Naz / Ronaldinho de 2002.',
    riesgo: 'Sin Casemiro al 100 %, el doble pivote es frágil. Centrales jóvenes no han pasado un torneo grande con la responsabilidad de los Silvas.',
    estrella: 'Vinícius Jr · capitán y Balón de Oro 2024 candidato',
    partidoClave: '13 jun · Brasil-Marruecos · MetLife · Nueva York/NJ',
  },
  {
    code: 'ESP',
    rank: 4,
    cuota: '8/1',
    cuotaNum: 8,
    group: 'H',
    status: 'cabeza-serie',
    fortaleza: 'Campeona Eurocopa 2024 con Lamine Yamal a pleno vuelo, Pedri sin lesiones y Rodri Balón de Oro recuperado.',
    riesgo: 'Calor y altitud de Guadalajara en el partido contra Uruguay (J3) son la única variable que España no ha podido simular.',
    estrella: 'Lamine Yamal · 19 años, Champions y Eurocopa al hombro',
    partidoClave: '26 jun · Uruguay-España · Estadio Akron · Guadalajara',
  },
  {
    code: 'ENG',
    rank: 5,
    cuota: '9/1',
    cuotaNum: 9,
    group: 'L',
    status: 'finalista',
    fortaleza: 'Bellingham es el mejor 10 del mundo y Saka, Foden y Kane forman la plantilla más completa de Inglaterra desde 1990.',
    riesgo: 'El historial reciente de eliminaciones por penaltis sigue pesando. Tuchel tiene que romper el muro mental.',
    estrella: 'Jude Bellingham · capitán y Liga 2024 con Real Madrid',
    partidoClave: '17 jun · Inglaterra-Croacia · AT&T Stadium · Dallas',
  },
  {
    code: 'GER',
    rank: 6,
    cuota: '12/1',
    cuotaNum: 12,
    group: 'E',
    status: 'cabeza-serie',
    fortaleza: 'Anfitriona moral de Euro 2024 (semifinalista en casa). Wirtz y Musiala dan creatividad como hace 20 años no se veía.',
    riesgo: 'Fase de reconstrucción tras el desastre Qatar 2022. La nueva camada todavía no ha levantado un torneo internacional.',
    estrella: 'Florian Wirtz · MVP Bundesliga y nuevo galáctico',
    partidoClave: '21 jun · Alemania-Costa de Marfil · BMO Field · Toronto',
  },
  {
    code: 'POR',
    rank: 7,
    cuota: '14/1',
    cuotaNum: 14,
    group: 'K',
    status: 'cabeza-serie',
    fortaleza: 'Última oportunidad mundialista de Cristiano Ronaldo + ascenso de Bernardo Silva, Bruno Fernandes y la dupla Leão / Conceição.',
    riesgo: 'Convivencia entre el ego histórico CR7 y los nuevos referentes. Cualquier conflicto en vestuario hunde el proyecto.',
    estrella: 'Cristiano Ronaldo · quinto y último Mundial confirmado',
    partidoClave: '27 jun · Colombia-Portugal · Hard Rock · Miami',
  },
  {
    code: 'NED',
    rank: 8,
    cuota: '20/1',
    cuotaNum: 20,
    group: 'F',
    status: 'cabeza-serie',
    fortaleza: 'Generación 2010 reformulada con Frenkie de Jong en su mejor versión, Gakpo y Simons como ataque principal.',
    riesgo: 'Defensa central post-Van Dijk vulnerable. Calcado al patrón histórico: ofensiva top y defensa irregular.',
    estrella: 'Cody Gakpo · finalista Champions y refuerzo del Liverpool',
    partidoClave: '25 jun · Túnez-Países Bajos · Arrowhead · Kansas City',
  },
  {
    code: 'CRO',
    rank: 9,
    cuota: '30/1',
    cuotaNum: 30,
    group: 'L',
    status: 'semifinalista',
    fortaleza: 'Modrić sigue siendo el cerebro táctico. Sucu generacional Sosa / Petković ha mejorado en 2025-26.',
    riesgo: 'Edad de la columna histórica. Si Modrić no completa los 90 minutos, el equipo cae 30 % en su capacidad ofensiva.',
    estrella: 'Luka Modrić · ¿su última Copa del Mundo?',
    partidoClave: '17 jun · Inglaterra-Croacia · AT&T · Dallas',
  },
  {
    code: 'BEL',
    rank: 10,
    cuota: '35/1',
    cuotaNum: 35,
    group: 'G',
    status: 'cabeza-serie',
    fortaleza: 'Última cita generacional De Bruyne / Lukaku / Hazard. Doku da explosión joven que les faltó en Qatar.',
    riesgo: 'La desconexión entre veteranos y jóvenes en eliminatorias clasificación 2025 fue evidente. Tedesco no ha cohesionado.',
    estrella: 'Kevin De Bruyne · cerebro y capitán generacional',
    partidoClave: 'Grupo G accesible si pasan primeros',
  },
  {
    code: 'USA',
    rank: 11,
    cuota: '50/1',
    cuotaNum: 50,
    group: 'D',
    status: 'anfitriona',
    fortaleza: 'Anfitriones con factor cancha en cuadro favorable. Pulisic, Reyna y McKennie están en clubes top europeos.',
    riesgo: 'Sin tradición mundialista para gestionar la presión local. La FIFA puede empujarles, pero llegan al Mundial sin haber ganado nada serio.',
    estrella: 'Christian Pulisic · capitán y referente del Milan',
    partidoClave: '12 jun · USA-Paraguay · SoFi · Los Ángeles · partido inaugural compartido',
  },
  {
    code: 'MEX',
    rank: 12,
    cuota: '50/1',
    cuotaNum: 50,
    group: 'A',
    status: 'anfitriona',
    fortaleza: 'Apertura con partido inaugural en el Estadio Azteca, escenario único en su historia mundialista. Edson Álvarez y Hugo Sánchez (asistente) son la columna emocional.',
    riesgo: 'Mismo pelirroto histórico: gran fase de grupos, eliminación en octavos. Para 2026 hay que romper «la maldición del 5to partido».',
    estrella: 'Edson Álvarez · capitán y referente del West Ham',
    partidoClave: '11 jun · México-Sudáfrica · Estadio Azteca · CDMX · partido inaugural',
  },
];

const FAQ = [
  {
    q: '¿Quién es favorito para ganar el Mundial 2026?',
    a: 'Argentina parte como principal favorita según las casas de apuestas (cuota 5/1 en Bet365 y William Hill, mayo 2026), seguida de Francia (6/1), Brasil (7/1) y España (8/1). Inglaterra completa el top-5 con cuota 9/1. Estos cinco equipos concentran el 70 % del dinero apostado en el ganador del Mundial.',
  },
  {
    q: '¿Por qué Argentina es la favorita?',
    a: 'Por tres razones: es la campeona vigente y mantiene el núcleo de Qatar 2022, tiene la doble carta Messi-Julián Álvarez bien consolidada, y un grupo (J: Argelia, Austria, Jordania) considerado el más asequible de los grupos con cabeza de serie de UEFA o CONMEBOL. Todo apunta a un cuadro favorable hasta cuartos de final.',
  },
  {
    q: '¿Cuándo arranca cada favorita?',
    a: 'México abre el Mundial 2026 el 11 de junio en el Estadio Azteca contra Sudáfrica. USA debuta el 12 de junio. Brasil lo hace el 13 contra Marruecos en MetLife. Alemania y Países Bajos el 14. España el 15 en Atlanta. Francia y Argentina el 16. Inglaterra el 17. La fase de grupos termina el 27 de junio.',
  },
  {
    q: '¿Las cuotas de las casas de apuestas son fiables como ranking?',
    a: 'Reflejan el dinero apostado, no necesariamente la probabilidad real. Sí son útiles como termómetro de expectativa: cuotas <8/1 indican equipos con probabilidad real de campeonar; cuotas 10-30/1 son equipos competitivos pero con techo en semis; cuotas >30/1 son outsiders que necesitan un cruce favorable y un torneo perfecto.',
  },
  {
    q: '¿Es la primera vez que el Mundial se juega en 3 países?',
    a: 'Sí. Mundial 2026 es la primera Copa del Mundo organizada por tres países simultáneos (USA, México, Canadá). También es la primera con 48 selecciones (frente a 32 desde 1998), introduce una ronda nueva de dieciseisavos y dura 39 días en lugar de los habituales 32. La final se jugará el 19 de julio en MetLife Stadium, Nueva York/Nueva Jersey.',
  },
  {
    q: '¿Qué selección es el dark horse o tapado del Mundial 2026?',
    a: 'Marruecos es la apuesta lógica tras su semifinal en Qatar 2022 (cuotas 40/1). Senegal aparece con potencial de octavos por su grupo accesible (Francia + Iraq + Noruega). En CONMEBOL, Uruguay con la generación Núñez-Valverde-Pellistri puede sorprender. Y Cabo Verde, debutante absoluto, llega con todo el factor sentimental.',
  },
];

export default async function FavoritosGanarMundial({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Favoritos para ganar el Mundial 2026: ranking, cuotas y análisis de los 12 candidatos',
    description:
      'Quién va a ganar el Mundial 2026 según casas de apuestas y análisis editorial: Argentina, Francia, Brasil, España, Inglaterra y outsiders.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-04',
    dateModified: '2026-05-04',
    mainEntityOfPage: localeUrl(locale, '/2026/favoritos-ganar-mundial'),
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

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Favoritos', path: '/2026/favoritos-ganar-mundial' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>Cuotas y ranking · 12 candidatos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          ¿Quién va a ganar<br />el Mundial 2026?
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Argentina parte como favorita con cuota <strong className="text-[var(--color-fg)]">5/1</strong> en las grandes casas de apuestas. Francia, Brasil, España e Inglaterra completan el top-5. Aquí están los 12 candidatos serios al título, con su grupo del Mundial, jugador estrella, partido clave en fase de grupos y un análisis honesto de fortalezas y riesgos.
        </p>

        <ul className="mt-12 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Mundial', value: '11 jun · 19 jul' },
            { label: 'Selecciones', value: '48' },
            { label: 'Partidos', value: '104' },
            { label: 'Sedes', value: '16 ciudades' },
          ].map((f) => (
            <li
              key={f.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {f.label}
              </div>
              <div className="mt-2 font-display text-2xl tab-num text-[var(--color-pitch)]">
                {f.value}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          Ranking
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">Top 12 favoritos</h2>
        <p className="mt-4 max-w-3xl text-[var(--color-fg-muted)]">
          Cuotas de referencia compiladas de Bet365, William Hill, Pinnacle y Stake en mayo de 2026. Las cuotas se actualizan semanalmente conforme se acerca el torneo y los amistosos pre-Mundial dan información a los traders. Ranking ordenado por cuota más baja (mayor probabilidad implícita).
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-2)]">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  #
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Selección
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Grupo
                </th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Cuota
                </th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  P. implícita
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hidden md:table-cell">
                  Estatus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {FAVORITOS.map((f) => {
                const team = TEAMS_2026[f.code];
                const probability = ((1 / (f.cuotaNum + 1)) * 100).toFixed(1);
                return (
                  <tr key={f.code} className={f.rank <= 5 ? 'bg-[var(--color-pitch)]/5' : ''}>
                    <td className="px-4 py-3 font-mono tab-num">{String(f.rank).padStart(2, '0')}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={withLocale(locale as Locale, `/selecciones/${f.code}`)}
                        className="inline-flex items-center gap-2 hover:text-[var(--color-pitch)]"
                      >
                        <span aria-hidden>{team?.flag ?? ''}</span>
                        <span className="font-medium">{team?.name ?? countryName(f.code)}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <Link
                        href={withLocale(locale as Locale, `/2026/grupo/${f.group}`)}
                        className="hover:text-[var(--color-pitch)]"
                      >
                        {f.group}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-pitch)]">
                      {f.cuota}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-fg-muted)]">
                      {probability} %
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] hidden md:table-cell">
                      {f.status === 'campeona'
                        ? '🏆 Campeona vigente'
                        : f.status === 'finalista'
                          ? '🥈 Finalista 2022'
                          : f.status === 'semifinalista'
                            ? '🥉 Semis 2022'
                            : f.status === 'cabeza-serie'
                              ? 'Cabeza de serie'
                              : f.status === 'anfitriona'
                                ? '🇺🇸🇲🇽🇨🇦 Anfitriona'
                                : 'Outsider'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Análisis individual
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">Los 12 candidatos al detalle</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FAVORITOS.map((f) => {
            const team = TEAMS_2026[f.code];
            return (
              <article
                key={f.code}
                className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>{team?.flag}</span>
                    <div>
                      <h3 className="font-display text-xl uppercase">{team?.name}</h3>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                        Grupo {f.group} · Cuota {f.cuota}
                      </div>
                    </div>
                  </div>
                  <span className="font-display text-3xl tab-num text-[var(--color-fg-muted)]">
                    {String(f.rank).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-relaxed">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                      Fortaleza
                    </div>
                    <p className="mt-1 text-[var(--color-fg-muted)]">{f.fortaleza}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
                      Riesgo
                    </div>
                    <p className="mt-1 text-[var(--color-fg-muted)]">{f.riesgo}</p>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                      Estrella
                    </div>
                    <p className="mt-1 text-[var(--color-fg)]">{f.estrella}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                      Partido clave
                    </div>
                    <p className="mt-1 text-[var(--color-fg-muted)]">{f.partidoClave}</p>
                  </div>
                </div>

                <Link
                  href={withLocale(locale as Locale, `/selecciones/${f.code}`)}
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)] hover:text-[var(--color-fg)]"
                >
                  Ver perfil de {team?.name}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-7 md:p-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <AlertCircle className="h-4 w-4" />
            <span>Mi pronóstico</span>
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Pronóstico realista
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
            <p>
              <strong className="text-[var(--color-fg)]">Final hipotética</strong>: Argentina-Francia, repetición exacta de Qatar 2022. Cuadro favorable para ambas hasta cuartos de final, donde se cruzarían con Brasil y España respectivamente. Probabilidad: 25-30 %.
            </p>
            <p>
              <strong className="text-[var(--color-fg)]">Sorpresa más probable</strong>: Marruecos pasando de cuartos. Tienen el cuadro favorable del lado de Argentina (cruzan en octavos contra el segundo de un grupo accesible) y la generación 2022 se mantiene casi intacta.
            </p>
            <p>
              <strong className="text-[var(--color-fg)]">El equipo a evitar</strong>: Inglaterra. Son la 5ª favorita pero su historial reciente en torneos finales (3 Eurocopas seguidas, ninguna ganada con plantilla similar a la actual) no se ha quitado. La presión de eliminatorias puede romperla otra vez.
            </p>
            <p>
              <strong className="text-[var(--color-fg)]">El fenómeno anfitriones</strong>: USA y México llegan con factor cancha pero su historial mundialista no respalda. México ha caído en octavos en 7 de las últimas 8 Copas. USA llegó como mucho a cuartos en 2002. Difícil que rompan ese techo en 2026 incluso jugando en casa.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">FAQ</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
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

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando el Mundial 2026</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Los 12 grupos · A-L
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Calendario completo
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              16 sedes
            </Link>
            <Link
              href={withLocale(locale as Locale, '/noticias/espana-mundial-2026-opciones-pronosticos-grupo-h-yamal-rodri')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Análisis España
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
