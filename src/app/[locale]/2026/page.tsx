import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, MapPin, Trophy } from 'lucide-react';
import { Countdown } from '@/components/home/countdown';
import { getTournament } from '@/lib/tournaments';
import { getAllVenues } from '@/lib/data/venues';
import { routing, type Locale } from '@/i18n/routing';
import { VENUES_2026, HOSTS, GROUPS_2026, PHASE_DATES, WC_2026 } from '@/lib/wc-2026';
import { WC2026Calendar } from '@/components/edition/wc2026-calendar';
import { WC2026Bracket } from '@/components/edition/wc2026-bracket';
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
    path: '/2026',
    // Patrón A SEO confirmado.
    title: 'Mundial 2026 calendario completo · Sedes, grupos y horarios',
    description:
      'Mundial 2026 (USA, México, Canadá): calendario completo de los 104 partidos, 16 estadios, 12 grupos. Cuándo empieza y cuándo es la final.',
    keywords: [
      'Mundial 2026',
      'Mundial 2026 calendario',
      'Mundial 2026 fechas',
      'Mundial 2026 horarios',
      'Mundial 2026 grupos',
      'Mundial 2026 sedes',
      'Mundial 2026 estadios',
      'cuándo empieza Mundial 2026',
      'cuándo es la final Mundial 2026',
      'Estados Unidos México Canadá',
    ],
  });
}

export default async function NorthAmerica2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getTournament(2026)!;

  // Pull venue hero images from DB
  const allVenues = await getAllVenues();
  const venueImages = new Map(
    allVenues.map((v) => [v.slug, v.hero_image_url]),
  );

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Copa Mundial de la FIFA 2026',
    alternateName: ['FIFA World Cup 2026', 'Mundial 2026'],
    sport: 'Football (Association)',
    startDate: WC_2026.kickoff,
    endDate: WC_2026.final,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: HOSTS.map((h) => ({
      '@type': 'Country',
      name: h.name,
    })),
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: localeUrl(locale, '/2026'),
    description:
      'Primer Mundial con 48 selecciones, organizado por Estados Unidos, México y Canadá del 11 de junio al 19 de julio de 2026.',
  };

  // FAQPage schema — preguntas de alto volumen relacionadas con el Mundial 2026.
  // Las respuestas también se renderizan visualmente abajo (FAQ visible).
  const faq = [
    {
      q: '¿Cuándo empieza el Mundial 2026?',
      a: 'El Mundial 2026 se inaugura el jueves 11 de junio de 2026 con el partido México-Sudáfrica en el Estadio Azteca de Ciudad de México (13:00 hora local).',
    },
    {
      q: '¿Cuándo es la final del Mundial 2026?',
      a: 'La final del Mundial 2026 se jugará el domingo 19 de julio de 2026 en el MetLife Stadium de Nueva Jersey (15:00 ET).',
    },
    {
      q: '¿Dónde se juega el Mundial 2026?',
      a: 'El Mundial 2026 se disputa en 16 estadios repartidos por tres países: 11 en Estados Unidos, 3 en México (Azteca, Akron y BBVA) y 2 en Canadá (BMO Field de Toronto y BC Place de Vancouver).',
    },
    {
      q: '¿Cuántas selecciones participan en el Mundial 2026?',
      a: 'Por primera vez en la historia, 48 selecciones disputan la fase final, repartidas en 12 grupos de 4 equipos. Antes eran 32.',
    },
    {
      q: '¿En qué grupo está España en el Mundial 2026?',
      a: 'España juega en el Grupo H junto a Uruguay, Arabia Saudí y Cabo Verde. Debuta el 15 de junio contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta.',
    },
    {
      q: '¿Cuántos partidos se juegan en el Mundial 2026?',
      a: 'Se disputan 104 partidos en total: 72 de fase de grupos, 16 de dieciseisavos, 8 de octavos, 4 de cuartos, 2 semifinales, el partido por el tercer puesto y la final.',
    },
  ];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div>
      <JsonLd
        data={[
          eventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 50% at 50% 0%, ${t.palette.from}55 0%, transparent 60%), radial-gradient(40% 60% at 90% 10%, ${t.palette.to}55 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            23ᵃ edición · 11 junio → 19 julio 2026
          </div>
          <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.88]">
            <span className="block text-[var(--color-fg)]">Norteamérica</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${t.palette.from}, ${t.palette.to})` }}
            >
              2026
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-fg-muted)] md:text-2xl">
            48 selecciones. 104 partidos. 16 ciudades. 3 países. El primer Mundial del nuevo formato.
          </p>
        </div>
      </section>

      <Countdown />

      {/* Host countries */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Tres sedes
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Un Mundial a tres bandas
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {HOSTS.map((h) => (
            <div key={h.code} className="relative overflow-hidden bg-[var(--color-bg-2)] p-8 md:p-10">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{ background: `radial-gradient(80% 60% at 50% 0%, ${h.accent} 0%, transparent 80%)` }}
              />
              <div className="relative">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl">{h.flag}</span>
                  <span className="font-display text-4xl uppercase leading-none">{h.name}</span>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      Ciudades
                    </div>
                    <div className="mt-1 font-display text-5xl tab-num">{h.cityCount}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      Partidos
                    </div>
                    <div className="mt-1 font-display text-5xl tab-num">{h.matchCount}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 16 venues grid */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              16 sedes
            </div>
            <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
              Los estadios
            </h2>
          </div>
          <Link
            href={withLocale(locale as Locale, '/estadios')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Todos los estadios
            <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {VENUES_2026.map((v) => {
            const img = venueImages.get(v.slug);
            return (
              <Link
                key={v.slug}
                href={withLocale(locale as Locale, `/estadios/${v.slug}`)}
                className="group relative aspect-[4/5] flex flex-col justify-end overflow-hidden bg-[var(--color-bg)]"
              >
                {img && (
                  <Image
                    src={img}
                    alt={v.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-pitch)]">
                    {v.country} · {v.hostCity}
                  </div>
                  <div className="mt-1 font-display text-lg uppercase leading-tight text-white">
                    {v.name}
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-white/60">
                    {v.capacity.toLocaleString()} · {v.role}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 12 groups */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Los 12 grupos · A – L
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Cada grupo, 4 selecciones
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
          Los clasifican los 2 primeros + los 8 mejores terceros, avanzando a una R32 inédita en
          Mundiales. México abre el torneo en el Grupo A, Canadá juega en B y Estados Unidos en D.
        </p>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {GROUPS_2026.map((g) => (
            <Link
              key={g.letter}
              href={withLocale(locale as Locale, `/2026/grupo/${g.letter}`)}
              className="group flex flex-col gap-3 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl uppercase text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                  {g.letter}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  Grupo
                </span>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm">
                {g.teams.map((code, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                      {i + 1}.
                    </span>
                    {code ? (
                      <span className="text-[var(--color-fg)]">{code}</span>
                    ) : (
                      <span className="text-[var(--color-fg-subtle)] italic">por decidir</span>
                    )}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* Phase timeline */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Calendario · 38 días
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Fases del torneo
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] overflow-hidden rounded-3xl border border-[var(--color-border)] md:grid-cols-5">
          <Phase label="Fase de grupos"    dates="11 — 27 jun" count="72 partidos" />
          <Phase label="R32 (nueva)"       dates="28 jun — 3 jul" count="16 partidos" />
          <Phase label="Octavos / Cuartos" dates="4 — 11 jul" count="12 partidos" />
          <Phase label="Semifinales"       dates="14 — 15 jul" count="2 partidos" />
          <Phase label="Tercero / Final"   dates={`${PHASE_DATES.thirdPlace.slice(8)} y ${PHASE_DATES.final.slice(8)} jul`} count="2 partidos" highlight />
        </div>

        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-6 py-4">
            <Trophy className="h-5 w-5 text-[var(--color-pitch)]" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)]">
              Final · MetLife Stadium · Nueva York
            </span>
          </div>
        </div>
      </section>

      <WC2026Bracket />
      <WC2026Calendar locale={locale as Locale} />

      {/* FAQ — preguntas de alto volumen sobre el Mundial 2026.
          Empareja con FAQPage JSON-LD para captar Rich Snippets. */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-20 md:px-10 md:py-28">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes · Mundial 2026
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Lo que más se busca sobre el Mundial 2026
        </h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {faq.map(({ q, a }) => (
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

      <div className="mt-8 pb-24 flex justify-center">
        <Link
          href={withLocale(locale as Locale, '/ediciones/2026-norteamerica')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          Ficha completa de 2026
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

function Phase({
  label,
  dates,
  count,
  highlight,
}: {
  label: string;
  dates: string;
  count: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-6"
      style={{
        background: highlight ? 'color-mix(in oklch, var(--color-pitch) 8%, var(--color-bg-2))' : 'var(--color-bg-2)',
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: highlight ? 'var(--color-pitch)' : 'var(--color-fg-subtle)' }}
      >
        {dates}
      </div>
      <div className="font-display text-xl uppercase text-[var(--color-fg)]">{label}</div>
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        <MapPin className="h-3 w-3" />
        {count}
      </div>
    </div>
  );
}
