import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ListTree, MapPin, CalendarDays } from 'lucide-react';
import { WC2026Bracket } from '@/components/edition/wc2026-bracket';
import { KnockoutCrosses } from '@/components/edition/knockout-crosses';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// ─── Contenido por idioma ────────────────────────────────────────
// Cada locale traducido recibe la copia entera. Si añades un locale nuevo,
// añade su clave en COPY y actualiza availableLocales abajo.
type PageCopy = {
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  breadcrumb: { home: string; wc: string; cuadro: string };
  backLink: string;
  kicker: string;
  h1: string;
  intro: React.ReactNode;
  calendarTitle: string;
  rounds: ReadonlyArray<{ label: string; dates: string; highlight?: boolean }>;
  venuesTitle: string;
  venues: ReadonlyArray<readonly [string, string]>;
  formatTitle: string;
  format: ReadonlyArray<React.ReactNode>;
  ctas: ReadonlyArray<{ href: string; title: string; body: string }>;
  headlineLd: string;
};

const COPY: Record<string, PageCopy> = {
  es: {
    metaTitle: 'Cuadro Mundial 2026 · Llaves de la fase eliminatoria desde dieciseisavos a la final',
    metaDescription:
      'Cuadro completo del Mundial 2026: 32avos, octavos, cuartos, semifinales y final. 32 equipos en fase eliminatoria por primera vez en la historia del Mundial, con calendario, sede y emparejamientos.',
    keywords: [
      'cuadro Mundial 2026',
      'llaves Mundial 2026',
      'bracket World Cup 2026',
      'chaveamento Copa do Mundo 2026',
      'fase eliminatoria Mundial 2026',
      'octavos Mundial 2026',
      'cuartos Mundial 2026',
      'semifinales Mundial 2026',
      'final Mundial 2026 MetLife',
      'dieciseisavos Mundial 2026',
    ],
    breadcrumb: { home: 'Inicio', wc: 'Mundial 2026', cuadro: 'Cuadro' },
    backLink: 'Volver a Mundial 2026',
    kicker: 'Fase eliminatoria',
    h1: 'Cuadro Mundial 2026',
    intro: (
      <>
        Por primera vez en la historia del Mundial, la fase eliminatoria arranca en{' '}
        <strong>dieciseisavos</strong> con <strong>32 equipos</strong>: los dos primeros de cada
        uno de los 12 grupos más los ocho mejores terceros. Cinco rondas, 32 partidos, y una final
        el <strong>19 de julio de 2026</strong> en MetLife Stadium.
      </>
    ),
    calendarTitle: 'Calendario de las rondas',
    rounds: [
      { label: 'Dieciseisavos (R32)', dates: '28 jun – 3 jul · 16 partidos' },
      { label: 'Octavos (R16)', dates: '4 jul – 7 jul · 8 partidos' },
      { label: 'Cuartos (QF)', dates: '9 jul – 11 jul · 4 partidos' },
      { label: 'Semifinales (SF)', dates: '14 jul – 15 jul · 2 partidos' },
      { label: 'Tercer puesto', dates: '18 jul · 1 partido' },
      { label: 'Final', dates: '19 jul · 14:00 hora del Este USA · MetLife Stadium (East Rutherford, Nueva Jersey)', highlight: true },
    ],
    venuesTitle: 'Sedes de las eliminatorias',
    venues: [
      ['Final', 'MetLife Stadium (Nueva York / Nueva Jersey)'],
      ['Tercer puesto', 'Hard Rock Stadium (Miami)'],
      ['Semifinales', 'AT&T Stadium (Dallas) y Mercedes-Benz Stadium (Atlanta)'],
      ['Cuartos', 'Foxborough, Kansas City, Inglewood y Miami'],
      ['Octavos', '8 sedes diferentes para evitar saturación logística'],
      ['Dieciseisavos', 'las 16 sedes del torneo en rotación'],
    ] as Array<[string, string]>,
    formatTitle: 'Cómo se construye el cuadro',
    format: [
      <>
        El Mundial 2026 estrena formato: <strong>48 equipos</strong> divididos en{' '}
        <strong>12 grupos de 4</strong>. Cada grupo clasifica los <strong>dos primeros</strong>{' '}
        directos a dieciseisavos. Los <strong>ocho mejores terceros</strong> entre los 12 grupos
        completan los 32 equipos de la fase eliminatoria. La criba se hace por puntos, diferencia
        de goles, goles a favor y, en caso de empate absoluto, sorteo público.
      </>,
      <>
        Los emparejamientos de dieciseisavos siguen el cuadro pre-establecido por FIFA en el sorteo
        del 5 de diciembre de 2025 en Las Vegas: el ganador del Grupo A cruza con el segundo del
        Grupo B; el ganador del C con el segundo del D, etc. Los terceros clasificados se ubican
        en las posiciones libres del cuadro según un sistema de prioridades publicado por FIFA.
      </>,
      <>
        Una vez dibujado el cuadro, no hay re-sorteos: ronda a ronda los ganadores avanzan en
        líneas fijas hasta la final. La <strong>llave alta</strong> (mitad superior del cuadro)
        llega a la final por Atlanta; la <strong>llave baja</strong> (mitad inferior) por Dallas.
      </>,
    ],
    ctas: [
      { href: '/2026/grupos', title: 'Grupos completos', body: 'Los 12 grupos con todos los partidos y horarios.' },
      { href: '/2026/sedes', title: '16 sedes', body: 'Estadios, ciudades, aforos y partidos asignados.' },
      { href: '/2026/calendario', title: 'Calendario', body: 'Los 104 partidos día a día con hora local y de Madrid.' },
    ],
    headlineLd: 'Cuadro Mundial 2026: llaves de la fase eliminatoria',
  },
  en: {
    metaTitle: '2026 World Cup Bracket · Knockout draw from Round of 32 to the Final',
    metaDescription:
      'Full 2026 FIFA World Cup bracket: Round of 32, Round of 16, quarter-finals, semi-finals and final. 32 teams in the knockout stage for the first time in World Cup history, with schedule, venue and pairings.',
    keywords: [
      '2026 World Cup bracket',
      'World Cup 2026 knockout',
      'World Cup 2026 schedule knockout',
      '2026 World Cup Round of 32',
      'World Cup 2026 quarter-finals',
      'World Cup 2026 semi-finals',
      '2026 World Cup final MetLife',
      'World Cup 2026 knockout draw',
    ],
    breadcrumb: { home: 'Home', wc: 'World Cup 2026', cuadro: 'Bracket' },
    backLink: 'Back to World Cup 2026',
    kicker: 'Knockout stage',
    h1: '2026 World Cup Bracket',
    intro: (
      <>
        For the first time in World Cup history, the knockout stage opens with a{' '}
        <strong>Round of 32</strong> featuring <strong>32 teams</strong>: the top two from each of
        the 12 groups plus the eight best third-placed sides. Five rounds, 32 matches, and a final
        on <strong>July 19, 2026</strong> at MetLife Stadium.
      </>
    ),
    calendarTitle: 'Round-by-round schedule',
    rounds: [
      { label: 'Round of 32', dates: 'Jun 28 – Jul 3 · 16 matches' },
      { label: 'Round of 16', dates: 'Jul 4 – Jul 7 · 8 matches' },
      { label: 'Quarter-finals', dates: 'Jul 9 – Jul 11 · 4 matches' },
      { label: 'Semi-finals', dates: 'Jul 14 – Jul 15 · 2 matches' },
      { label: 'Third-place play-off', dates: 'Jul 18 · 1 match' },
      { label: 'Final', dates: 'Jul 19 · 2:00 PM ET · MetLife Stadium (East Rutherford, New Jersey)', highlight: true },
    ],
    venuesTitle: 'Knockout-stage venues',
    venues: [
      ['Final', 'MetLife Stadium (New York / New Jersey)'],
      ['Third-place play-off', 'Hard Rock Stadium (Miami)'],
      ['Semi-finals', 'AT&T Stadium (Dallas) and Mercedes-Benz Stadium (Atlanta)'],
      ['Quarter-finals', 'Foxborough, Kansas City, Inglewood and Miami'],
      ['Round of 16', '8 different venues to spread the logistical load'],
      ['Round of 32', 'all 16 tournament venues in rotation'],
    ] as Array<[string, string]>,
    formatTitle: 'How the bracket is built',
    format: [
      <>
        The 2026 World Cup launches a new format: <strong>48 teams</strong> divided into{' '}
        <strong>12 groups of 4</strong>. Each group sends its <strong>top two</strong> directly to
        the Round of 32. The <strong>eight best third-placed teams</strong> across the 12 groups
        round out the 32-team knockout. Tie-breaking is by points, goal difference, goals scored
        and, if still level, a public draw.
      </>,
      <>
        Round-of-32 pairings follow FIFA\'s pre-determined bracket from the December 5, 2025 draw
        in Las Vegas: the Group A winner faces the Group B runner-up, the C winner faces the D
        runner-up, and so on. Third-placed qualifiers slot into the open positions per the
        priority system FIFA published with the draw.
      </>,
      <>
        Once the bracket is drawn there are no re-draws: winners advance through fixed branches to
        the final. The <strong>upper bracket</strong> (top half) reaches the final via Atlanta;
        the <strong>lower bracket</strong> (bottom half) via Dallas.
      </>,
    ],
    ctas: [
      { href: '/2026/grupos', title: 'Full groups', body: 'All 12 groups with every match and kick-off time.' },
      { href: '/2026/sedes', title: '16 host venues', body: 'Stadiums, cities, capacities and assigned matches.' },
      { href: '/2026/calendario', title: 'Schedule', body: 'All 104 matches day by day with local and Madrid time.' },
    ],
    headlineLd: '2026 World Cup Bracket: knockout-stage draw',
  },
};

const AVAILABLE: readonly string[] = ['es', 'en'];

function copyFor(locale: string): PageCopy {
  return COPY[locale] ?? COPY.es;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = copyFor(locale);
  return pageMetadata({
    locale,
    path: '/2026/cuadro',
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: [...c.keywords],
    type: 'article',
    availableLocales: AVAILABLE,
  });
}

export default async function CuadroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const L = locale as Locale;
  setRequestLocale(L);
  const c = copyFor(locale);

  const pageUrl = localeUrl(locale, '/2026/cuadro');

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: c.breadcrumb.home, path: '/' },
          { name: c.breadcrumb.wc, path: '/2026' },
          { name: c.breadcrumb.cuadro, path: '/2026/cuadro' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: c.headlineLd,
          inLanguage: locale,
          datePublished: '2026-05-26T10:00:00Z',
          dateModified: new Date().toISOString(),
          publisher: {
            '@type': 'Organization',
            name: SEO.siteName,
            url: SEO.siteUrl,
          },
          mainEntityOfPage: pageUrl,
        }}
      />

      <nav className="mb-6 text-sm text-[var(--color-fg-muted)]">
        <Link href={withLocale(L, '/2026')} className="inline-flex items-center gap-1 hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-4 w-4" /> {c.backLink}
        </Link>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <ListTree className="mr-1 inline h-3 w-3" /> {c.kicker}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{c.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--color-fg-muted)]">{c.intro}</p>
      </header>

      <KnockoutCrosses />

      <WC2026Bracket />

      <section className="mt-16 grid gap-8 sm:grid-cols-2">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-[var(--color-pitch)]" />
            {c.calendarTitle}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            {c.rounds.map((r) => (
              <Round key={r.label} label={r.label} dates={r.dates} highlight={r.highlight} />
            ))}
          </dl>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-[var(--color-pitch)]" />
            {c.venuesTitle}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-fg-muted)]">
            {c.venues.map(([label, body]) => (
              <li key={label}>
                <strong className="text-[var(--color-fg)]">{label}</strong>: {body}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">{c.formatTitle}</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {c.format.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        {c.ctas.map((cta) => (
          <CTA key={cta.href} href={withLocale(L, cta.href)} title={cta.title} body={cta.body} />
        ))}
      </section>
    </main>
  );
}

function Round({ label, dates, highlight }: { label: string; dates: string; highlight?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-2 last:border-b-0 ${highlight ? 'text-[var(--color-pitch)]' : ''}`}>
      <dt className="text-sm font-medium">{label}</dt>
      <dd className="text-xs text-[var(--color-fg-muted)]">{dates}</dd>
    </div>
  );
}

function CTA({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-pitch)]/50"
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-[var(--color-fg-muted)]">{body}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--color-pitch)]">
        Ver <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
