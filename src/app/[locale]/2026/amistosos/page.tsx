import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarClock, MapPin } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { getAllFriendlies, type PreFriendly } from '@/lib/wc-2026-pre-friendlies';
import { TEAMS_2026 } from '@/lib/wc-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/amistosos',
    title: 'Amistosos pre-Mundial 2026 · Calendario completo de las 48 selecciones',
    description:
      'Calendario completo de los amistosos previos al Mundial 2026: fechas, sedes, rivales y horarios. Ventana FIFA del 1 al 9 de junio. Cobertura de las 48 selecciones participantes y sus rivales de calentamiento.',
    keywords: [
      'amistosos pre Mundial 2026',
      'amistosos previos Mundial 2026',
      'calendario amistosos junio 2026',
      'partidos preparacion Mundial 2026',
      'amistosos seleccion Mundial 2026',
      'warm up matches World Cup 2026',
    ],
    type: 'article',
  });
}

function groupByDate(friendlies: PreFriendly[]): { day: string; matches: PreFriendly[] }[] {
  const map = new Map<string, PreFriendly[]>();
  for (const f of friendlies) {
    const day = f.date.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(f);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, matches]) => ({ day, matches }));
}

function formatDayHeader(isoDay: string): string {
  const d = new Date(isoDay + 'T12:00:00Z');
  const weekday = d.toLocaleDateString('es-ES', { weekday: 'long', timeZone: 'UTC' });
  const monthDay = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${monthDay}`;
}

function FriendlyCard({
  f,
  locale,
}: {
  f: PreFriendly;
  locale: string;
}) {
  const home = TEAMS_2026[f.homeCode as keyof typeof TEAMS_2026];
  const away = TEAMS_2026[f.awayCode as keyof typeof TEAMS_2026];
  const date = new Date(f.date);
  const timeLabel = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          {timeLabel} local
        </div>
        {f.result && (
          <div className="font-mono text-sm font-bold text-[var(--color-pitch)]">
            FT {f.result.home}-{f.result.away}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <Link
          href={withLocale(locale as Locale, `/selecciones/${f.homeCode}`)}
          className="flex items-baseline gap-2 font-display text-lg uppercase hover:text-[var(--color-pitch)]"
        >
          <span>{home?.flag ?? ''}</span>
          <span>{home?.name ?? f.homeCode}</span>
        </Link>
        <span className="font-mono text-xs text-[var(--color-fg-subtle)]">vs</span>
        <Link
          href={withLocale(locale as Locale, `/selecciones/${f.awayCode}`)}
          className="flex items-baseline gap-2 font-display text-lg uppercase hover:text-[var(--color-pitch)]"
        >
          <span>{away?.flag ?? ''}</span>
          <span>{away?.name ?? f.awayCode}</span>
        </Link>
      </div>
      {(f.venue || f.city) && (
        <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          <MapPin className="h-3 w-3" />
          <span>{[f.venue, f.city, f.country].filter(Boolean).join(' · ')}</span>
        </div>
      )}
      {f.notes && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{f.notes}</p>
      )}
    </div>
  );
}

export default async function AmistososPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const all = getAllFriendlies();
  const byDay = groupByDate(all);

  // JSON-LD: ItemList con SportsEvent
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Amistosos pre-Mundial 2026',
    url: localeUrl(locale, '/2026/amistosos'),
    inLanguage: locale,
    numberOfItems: all.length,
    itemListElement: all.map((f, i) => {
      const home = TEAMS_2026[f.homeCode as keyof typeof TEAMS_2026];
      const away = TEAMS_2026[f.awayCode as keyof typeof TEAMS_2026];
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SportsEvent',
          name: `${home?.name ?? f.homeCode} vs ${away?.name ?? f.awayCode}`,
          startDate: f.date,
          sport: 'Football (Association)',
          eventStatus:
            f.status === 'played'
              ? 'https://schema.org/EventCompleted'
              : 'https://schema.org/EventScheduled',
          location: f.venue
            ? {
                '@type': 'Place',
                name: f.venue,
                address: [f.city, f.country].filter(Boolean).join(', '),
              }
            : undefined,
          competitor: [
            { '@type': 'SportsTeam', name: home?.name ?? f.homeCode },
            { '@type': 'SportsTeam', name: away?.name ?? f.awayCode },
          ],
        },
      };
    }),
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          itemListLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Amistosos previos', path: '/2026/amistosos' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CalendarClock className="mr-2 inline h-3 w-3" /> Ventana FIFA · 1-9 junio 2026
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Amistosos pre-Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Calendario completo de los partidos de preparación de las 48 selecciones
          clasificadas antes del debut del torneo el <strong>11 de junio</strong>.
          La ventana FIFA reservada para amistosos es del <strong>1 al 9 de junio</strong>,
          aunque algunas selecciones también juegan tests en mayo durante la concentración
          previa.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          {all.length} amistosos confirmados
        </div>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="space-y-10">
          {byDay.map(({ day, matches }) => (
            <div key={day}>
              <h2 className="font-display text-2xl uppercase">{formatDayHeader(day)}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {matches.map((f) => (
                  <FriendlyCard
                    key={f.date + f.homeCode + f.awayCode}
                    f={f}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Otras secciones del Mundial 2026</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Calendario oficial del torneo
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/listas')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Convocatorias por selección
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Los 12 grupos
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              16 sedes
            </Link>
            <Link
              href={withLocale(locale as Locale, '/noticias')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Noticias
            </Link>
          </div>
          <Link
            href={withLocale(locale as Locale, '/2026/amistosos')}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
          >
            Volver al inicio del calendario <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </article>
  );
}
