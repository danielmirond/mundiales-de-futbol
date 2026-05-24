import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarClock, MapPin, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Landing del Mundial Sub-17 Qatar 2026.
 *
 * Captura las queries en alza tras el sorteo del 21-may-2026:
 *  - "mundial sub 17 qatar 2026"
 *  - "sorteo mundial sub-17 grupos"
 *  - "selección argentina sub-17 2026"
 *  - "FIFA u17 world cup 2026 groups"
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/sub-17-qatar',
    title:
      'Mundial Sub-17 Qatar 2026: grupos, fechas y selecciones · 48 equipos, 19 nov - 13 dic',
    description:
      'Toda la información del Mundial Sub-17 Qatar 2026: los 12 grupos sorteados el 21 de mayo, las 48 selecciones participantes, el calendario completo, las sedes en Doha, Al Rayyan y Al Khor y los grupos de Argentina, Brasil, México, España, Colombia y todas las selecciones latinoamericanas.',
    keywords: [
      'Mundial Sub-17 Qatar 2026',
      'Mundial Sub17 2026',
      'sorteo Mundial Sub-17',
      'FIFA U17 World Cup 2026',
      'grupos Mundial Sub-17',
      'Argentina Sub-17 Mundial',
      'España Sub-17 Mundial',
      'Brasil Sub-17 Mundial',
    ],
  });
}

const GROUPS = [
  { letter: 'A', teams: ['Qatar 🇶🇦', 'Egipto 🇪🇬', 'Panamá 🇵🇦', 'Grecia 🇬🇷'] },
  { letter: 'B', teams: ['Corea del Sur 🇰🇷', 'Ecuador 🇪🇨', 'Nueva Caledonia 🇳🇨', 'CAF 1 (por confirmar)'] },
  { letter: 'C', teams: ['Argentina 🇦🇷', 'Australia 🇦🇺', 'Dinamarca 🇩🇰', 'CAF 2 (por confirmar)'] },
  { letter: 'D', teams: ['Francia 🇫🇷', 'Arabia Saudita 🇸🇦', 'Haití 🇭🇹', 'Uruguay 🇺🇾'] },
  { letter: 'E', teams: ['Italia 🇮🇹', 'Uzbekistán 🇺🇿', 'Costa de Marfil 🇨🇮', 'Jamaica 🇯🇲'] },
  { letter: 'F', teams: ['Senegal 🇸🇳', 'Croacia 🇭🇷', 'Tayikistán 🇹🇯', 'Cuba 🇨🇺'] },
  { letter: 'G', teams: ['Mali 🇲🇱', 'Bélgica 🇧🇪', 'Nueva Zelanda 🇳🇿', 'Vietnam 🇻🇳'] },
  { letter: 'H', teams: ['España 🇪🇸', 'Marruecos 🇲🇦', 'Fiyi 🇫🇯', 'China 🇨🇳'] },
  { letter: 'I', teams: ['Brasil 🇧🇷', 'Irlanda 🇮🇪', 'Costa Rica 🇨🇷', 'Tanzania 🇹🇿'] },
  { letter: 'J', teams: ['Estados Unidos 🇺🇸', 'Chile 🇨🇱', 'Montenegro 🇲🇪', 'Argelia 🇩🇿'] },
  { letter: 'K', teams: ['México 🇲🇽', 'Venezuela 🇻🇪', 'Camerún 🇨🇲', 'Rumanía 🇷🇴'] },
  { letter: 'L', teams: ['Japón 🇯🇵', 'Colombia 🇨🇴', 'Honduras 🇭🇳', 'Serbia 🇷🇸'] },
];

const KEY_FACTS = [
  { label: 'Fechas', value: '19 nov - 13 dic 2026' },
  { label: 'Sede', value: 'Qatar' },
  { label: 'Selecciones', value: '48 (formato ampliado)' },
  { label: 'Grupos', value: '12 grupos de 4 equipos' },
  { label: 'Sorteo', value: '21 mayo 2026, Zúrich' },
  { label: 'Confederaciones', value: 'Todas las 6 (CONCACAF, CONMEBOL, UEFA, AFC, CAF, OFC)' },
  { label: 'Clasificados', value: 'Top 2 + 8 mejores terceros' },
  { label: 'Anterior campeón', value: 'Alemania (Catar 2025)' },
];

export default async function Sub17QatarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sportsEventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA U-17 World Cup 2026',
    startDate: '2026-11-19',
    endDate: '2026-12-13',
    location: {
      '@type': 'Country',
      name: 'Qatar',
    },
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    url: localeUrl(locale, '/2026/sub-17-qatar'),
    description:
      'Mundial Sub-17 FIFA Qatar 2026, con 48 selecciones por primera vez, del 19 de noviembre al 13 de diciembre.',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuándo se juega el Mundial Sub-17 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El Mundial Sub-17 Qatar 2026 se juega del 19 de noviembre al 13 de diciembre de 2026. La FIFA confirmó las fechas tras el sorteo de grupos realizado el 21 de mayo de 2026 en Zúrich.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuántas selecciones participan en el Mundial Sub-17 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Participan 48 selecciones por primera vez en la historia del Mundial Sub-17, replicando el formato del Mundial absoluto 2026. Se distribuyen en 12 grupos de 4 equipos cada uno. Clasifican a octavos los 2 primeros de cada grupo más los 8 mejores terceros.',
        },
      },
      {
        '@type': 'Question',
        name: '¿En qué grupo está Argentina en el Mundial Sub-17 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Argentina está en el Grupo C del Mundial Sub-17 Qatar 2026, junto a Australia, Dinamarca y la posición CAF 2 (selección africana por confirmar). Es el principal candidato del grupo.',
        },
      },
      {
        '@type': 'Question',
        name: '¿En qué grupo está España en el Mundial Sub-17 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'España está en el Grupo H del Mundial Sub-17 Qatar 2026, junto a Marruecos, Fiyi y China. España debutará contra China y se enfrentará a Marruecos en lo que se prevé el partido más equilibrado del grupo.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Quién es el actual campeón Sub-17?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El campeón vigente es Alemania, que ganó el Mundial Sub-17 Catar 2025 con final 3-2 contra Brasil. Alemania renueva título en Qatar tras 5 años de espera.',
        },
      },
    ],
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          sportsEventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Mundial Sub-17 Qatar 2026', path: '/2026/sub-17-qatar' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>Mundial Sub-17 · Catar 2026</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Mundial Sub-17 Qatar 2026: los 12 grupos del sorteo
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El Mundial Sub-17 FIFA se disputa en <strong className="text-[var(--color-fg)]">Qatar entre el 19 de noviembre y el 13 de diciembre de 2026</strong> con un formato ampliado a <strong>48 selecciones</strong> por primera vez en su historia. El sorteo de grupos celebrado el 21 de mayo en Zúrich definió las llaves. Argentina, Brasil, México, España y Colombia parten como favoritos confederales.
        </p>
      </header>

      {/* Datos rápidos */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Datos rápidos</h2>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {KEY_FACTS.map((k) => (
            <div key={k.label} className="bg-[var(--color-bg)] p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {k.label}
              </dt>
              <dd className="mt-2 font-display text-base uppercase tab-num text-[var(--color-fg)]">
                {k.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Los 12 grupos */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="h-3 w-3" />
          <span>Sorteo · 21 may 2026 · Zúrich</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">Los 12 grupos del Mundial Sub-17</h2>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <li key={g.letter} className="bg-[var(--color-bg-2)] p-5">
              <div className="font-display text-3xl uppercase leading-none text-[var(--color-pitch)]">
                Grupo {g.letter}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-fg)]">
                {g.teams.map((t, i) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                      {i + 1}.
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Las posiciones marcadas como CAF 1 y CAF 2 se confirmarán tras la fase final de la clasificación africana en septiembre de 2026.
        </p>
      </section>

      {/* Formato y clasificación */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CalendarClock className="h-3 w-3" />
          <span>Formato del torneo</span>
        </div>
        <h2 className="mt-2 font-display text-3xl uppercase">Cómo se juega</h2>
        <div className="mt-5 space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 text-base leading-relaxed text-[var(--color-fg)]">
          <p>
            El Mundial Sub-17 Qatar 2026 sigue el formato estrenado en el Mundial absoluto 2026: <strong>48 selecciones, 12 grupos de 4 equipos, fase eliminatoria desde octavos con 32 selecciones</strong>. Clasifican a la siguiente ronda los dos primeros de cada grupo y los ocho mejores terceros.
          </p>
          <p>
            La primera fase del torneo se juega del 19 al 30 de noviembre con dos partidos diarios. Los octavos de final se disputan del 1 al 4 de diciembre. Cuartos, semifinales y final se concentran entre el 6 y el 13 de diciembre.
          </p>
          <p>
            Las sedes son tres ciudades cataríes: <strong>Doha</strong> (capital, con cuatro estadios habilitados), <strong>Al Rayyan</strong> (estadio Education City) y <strong>Al Khor</strong> (estadio Al Bayt). La final del 13 de diciembre se jugará en el <strong>Estadio Lusail</strong>, el mismo escenario de la final del Mundial absoluto 2022 que ganó Argentina.
          </p>
        </div>
      </section>

      {/* Favoritos y selecciones */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Selecciones favoritas y dinámicas</h2>
        <div className="mt-5 space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 text-base leading-relaxed text-[var(--color-fg)]">
          <p>
            <strong>Alemania</strong> defiende el título conseguido en Catar 2025 (3-2 a Brasil en la final). Llega como gran favorita de la UEFA y rival a evitar en cualquier ronda eliminatoria.
          </p>
          <p>
            <strong>Argentina (Grupo C)</strong> es la principal candidata de la CONMEBOL. Llega con el bicampeonato Sudamericano Sub-17 y una generación liderada por jóvenes promesas del River Plate y el Boca Juniors.
          </p>
          <p>
            <strong>Brasil (Grupo I)</strong> compite tras la dolorosa final perdida en 2025. Grupo cómodo (Irlanda, Costa Rica, Tanzania) sobre el papel.
          </p>
          <p>
            <strong>España (Grupo H)</strong> con Marruecos como rival más complicado. Es uno de los grupos más equilibrados del torneo. La generación española viene de ganar el Europeo Sub-17 2025.
          </p>
          <p>
            <strong>Francia (Grupo D)</strong> está en uno de los grupos más exigentes con Uruguay como rival directo. Subcampeona Sub-17 europea 2025.
          </p>
          <p>
            <strong>México (Grupo K)</strong> con Camerún como rival africano. México apunta a octavos como mínimo tras la decepción de no clasificarse en 2023.
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Otros torneos del ciclo 2026</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Mundial absoluto 2026 <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/cuando-empieza')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Cuándo empieza el Mundial
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2030')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Mundial 2030
            </Link>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Fuente: FIFA · sorteo del 21 de mayo de 2026 en la sede de FIFA Zúrich. URL canónica: {SEO.siteUrl}/2026/sub-17-qatar.
        </p>
      </section>
    </article>
  );
}
