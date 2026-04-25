import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getFormatter } from 'next-intl/server';
import { ArrowLeft, MapPin, Users as UsersIcon } from 'lucide-react';
import { getVenueBySlug, getVenueMatches } from '@/lib/data/venues';
import { getTournament } from '@/lib/tournaments';
import { STAGE_LABEL_ES } from '@/lib/data/matches';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const name = venue.name.trim();
  const city = venue.city?.trim() ?? '';
  // Patrón confirmado: "Estadio Azteca · Ciudad de México · 5 Mundiales 1970-2026"
  const years = (venue.wc_years ?? []).filter(Boolean).sort((a: number, b: number) => a - b);
  const yearsLabel =
    years.length === 0
      ? ''
      : years.length === 1
      ? `Mundial ${years[0]}`
      : years.length <= 3
      ? `Mundial ${years.join(', ')}`
      : `${years.length} Mundiales ${years[0]}-${years[years.length - 1]}`;
  const title = [name, city, yearsLabel].filter(Boolean).join(' · ');
  const description = years.length > 0
    ? `${name}${city ? `, ${city}` : ''}: sede del ${years.length === 1 ? 'Mundial' : `Mundial en ${years.join(', ')}`}. Capacidad, historia, partidos disputados y curiosidades.`
    : `${name}${city ? ` en ${city}` : ''}, estadio mundialista. Capacidad, historia y partidos disputados.`;
  const url =
    locale === routing.defaultLocale
      ? `${siteUrl}/estadios/${venue.slug}`
      : `${siteUrl}/${locale}/estadios/${venue.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}/estadios/${venue.slug}`
            : `${siteUrl}/${l}/estadios/${venue.slug}`,
        ]),
      ),
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      images: venue.hero_image_url ? [{ url: venue.hero_image_url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function StadiumDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();

  const matches = await getVenueMatches(venue.id);
  const format = await getFormatter();

  const totalAttendance = matches.reduce((s, m) => s + (m.attendance ?? 0), 0);
  const years = [...new Set(matches.map((m) => m.tournament_year))].sort();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'StadiumOrArena',
    name: venue.name.trim(),
    address: venue.city
      ? { '@type': 'PostalAddress', addressLocality: venue.city.trim(), addressCountry: venue.country_code ?? undefined }
      : undefined,
    geo: venue.latitude && venue.longitude
      ? { '@type': 'GeoCoordinates', latitude: venue.latitude, longitude: venue.longitude }
      : undefined,
    url: `${siteUrl}/estadios/${venue.slug}`,
    image: venue.hero_image_url,
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
      {/* Hero with full-bleed photo */}
      <section className="relative flex min-h-[60svh] items-end overflow-hidden pt-24">
        {venue.hero_image_url ? (
          <Image
            src={venue.hero_image_url}
            alt={venue.name}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-[var(--color-bg)]/30" />
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10 md:pb-24">
          <Link
            href={withLocale(locale as Locale, '/estadios')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Estadios
          </Link>

          <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {venue.country_code ?? ''}
            {venue.city ? ` · ${venue.city.trim()}` : ''}
          </div>
          <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9] text-white">
            {venue.name.trim()}
          </h1>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Partidos Mundial" value={String(matches.length)} />
          <Stat label="Mundiales" value={String(years.length)} />
          <Stat
            label="Asistencia total"
            value={totalAttendance > 0 ? format.number(totalAttendance) : '—'}
          />
          <Stat
            label="Años"
            value={years.length ? `${years[0]}–${years[years.length - 1]}` : '—'}
            small
          />
        </div>
      </section>

      {/* Meta */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Datos clave
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          El recinto
        </h2>
        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 text-sm">
          <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            Ciudad
          </dt>
          <dd className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--color-fg-muted)]" />
            {venue.city?.trim() ?? '—'}, {venue.country_code ?? '—'}
          </dd>
          {venue.latitude && venue.longitude && (
            <>
              <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Coordenadas
              </dt>
              <dd className="font-mono tab-num text-[var(--color-fg-muted)]">
                {venue.latitude.toFixed(4)}, {venue.longitude.toFixed(4)}
              </dd>
            </>
          )}
        </dl>
      </section>

      {/* Matches played here */}
      {matches.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Historial
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            {matches.length} partido{matches.length === 1 ? '' : 's'} disputado
            {matches.length === 1 ? '' : 's'} aquí
          </h2>

          <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => {
              const t = getTournament(m.tournament_year);
              return (
                <Link
                  key={m.id}
                  href={withLocale(locale as Locale, `/ediciones/${t?.slug ?? m.tournament_year}/partido/${m.match_number}`)}
                  className="group flex flex-col gap-3 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    <span>{m.tournament_year} · {STAGE_LABEL_ES[m.stage ?? 'group'] ?? m.stage}</span>
                    <span>{fmtDate(m.match_date)}</span>
                  </div>
                  <div className="flex items-center gap-3 font-display text-xl md:text-2xl">
                    <span className="flex-1 truncate text-end">{m.home_code}</span>
                    <span className="font-mono tab-num">
                      {m.home_score ?? '—'} — {m.away_score ?? '—'}
                    </span>
                    <span className="flex-1 truncate">{m.away_code}</span>
                  </div>
                  {m.attendance && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      <UsersIcon className="h-3 w-3" /> {format.number(m.attendance)}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex flex-col gap-3 bg-[var(--color-bg-2)] p-5 md:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {label}
      </div>
      <div className={`font-display tab-num ${small ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>
        {value}
      </div>
    </div>
  );
}
