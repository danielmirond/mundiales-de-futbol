import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ListTree, MapPin, CalendarDays } from 'lucide-react';
import { WC2026Bracket } from '@/components/edition/wc2026-bracket';
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
    path: '/2026/cuadro',
    title: 'Cuadro Mundial 2026 · Llaves de la fase eliminatoria desde dieciseisavos a la final',
    description:
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
    type: 'article',
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

  const pageUrl = localeUrl(locale, '/2026/cuadro');

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Mundial 2026', path: '/2026' },
          { name: 'Cuadro', path: '/2026/cuadro' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Cuadro Mundial 2026: llaves de la fase eliminatoria',
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
          <ArrowLeft className="h-4 w-4" /> Volver a Mundial 2026
        </Link>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <ListTree className="mr-1 inline h-3 w-3" /> Fase eliminatoria
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Cuadro Mundial 2026
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--color-fg-muted)]">
          Por primera vez en la historia del Mundial, la fase eliminatoria arranca en <strong>dieciseisavos</strong> con
          <strong> 32 equipos</strong>: los dos primeros de cada uno de los 12 grupos más los ocho mejores terceros.
          Cinco rondas, 32 partidos, y una final el <strong>19 de julio de 2026</strong> en MetLife Stadium.
        </p>
      </header>

      <WC2026Bracket />

      <section className="mt-16 grid gap-8 sm:grid-cols-2">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-[var(--color-pitch)]" />
            Calendario de las rondas
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Round label="Dieciseisavos (R32)" dates="28 jun – 3 jul · 16 partidos" />
            <Round label="Octavos (R16)" dates="4 jul – 7 jul · 8 partidos" />
            <Round label="Cuartos (QF)" dates="9 jul – 11 jul · 4 partidos" />
            <Round label="Semifinales (SF)" dates="14 jul – 15 jul · 2 partidos" />
            <Round label="Tercer puesto" dates="18 jul · 1 partido" />
            <Round label="Final" dates="19 jul · 14:00 hora del Este USA · MetLife Stadium (East Rutherford, Nueva Jersey)" highlight />
          </dl>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-[var(--color-pitch)]" />
            Sedes de las eliminatorias
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-fg-muted)]">
            <li><strong className="text-[var(--color-fg)]">Final</strong>: MetLife Stadium (Nueva York / Nueva Jersey)</li>
            <li><strong className="text-[var(--color-fg)]">Tercer puesto</strong>: Hard Rock Stadium (Miami)</li>
            <li><strong className="text-[var(--color-fg)]">Semifinales</strong>: AT&T Stadium (Dallas) y Mercedes-Benz Stadium (Atlanta)</li>
            <li><strong className="text-[var(--color-fg)]">Cuartos</strong>: Foxborough, Kansas City, Inglewood y Miami</li>
            <li><strong className="text-[var(--color-fg)]">Octavos</strong>: 8 sedes diferentes para evitar saturación logística</li>
            <li><strong className="text-[var(--color-fg)]">Dieciseisavos</strong>: las 16 sedes del torneo en rotación</li>
          </ul>
        </article>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Cómo se construye el cuadro</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            El Mundial 2026 estrena formato: <strong>48 equipos</strong> divididos en <strong>12 grupos de 4</strong>.
            Cada grupo clasifica los <strong>dos primeros</strong> directos a dieciseisavos. Los <strong>ocho mejores
            terceros</strong> entre los 12 grupos completan los 32 equipos de la fase eliminatoria. La criba se hace
            por puntos, diferencia de goles, goles a favor y, en caso de empate absoluto, sorteo público.
          </p>
          <p>
            Los emparejamientos de dieciseisavos siguen el cuadro pre-establecido por FIFA en el sorteo del 5 de
            diciembre de 2025 en Las Vegas: el ganador del Grupo A cruza con el segundo del Grupo B; el ganador
            del C con el segundo del D, etc. Los terceros clasificados se ubican en las posiciones libres del
            cuadro según un sistema de prioridades publicado por FIFA.
          </p>
          <p>
            Una vez dibujado el cuadro, no hay re-sorteos: ronda a ronda los ganadores avanzan en líneas fijas
            hasta la final. La <strong>llave alta</strong> (mitad superior del cuadro) llega a la final por
            Atlanta; la <strong>llave baja</strong> (mitad inferior) por Dallas.
          </p>
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        <CTA href={withLocale(L, '/2026/grupos')} title="Grupos completos" body="Los 12 grupos con todos los partidos y horarios." />
        <CTA href={withLocale(L, '/2026/sedes')} title="16 sedes" body="Estadios, ciudades, aforos y partidos asignados." />
        <CTA href={withLocale(L, '/2026/calendario')} title="Calendario" body="Los 104 partidos día a día con hora local y de Madrid." />
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
