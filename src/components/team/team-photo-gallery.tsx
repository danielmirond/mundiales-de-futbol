import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';
import { getTeamPhotosByYear, type TeamPhoto } from '@/lib/team-photos';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const YEAR_TO_SLUG: Record<number, string> = {
  1930: '1930-uruguay',
  1934: '1934-italia',
  1938: '1938-francia',
  1950: '1950-brasil',
  1954: '1954-suiza',
  1958: '1958-suecia',
  1962: '1962-chile',
  1966: '1966-inglaterra',
  1970: '1970-mexico',
  1974: '1974-alemania',
  1978: '1978-argentina',
  1982: '1982-espana',
  1986: '1986-mexico',
  1990: '1990-italia',
  1994: '1994-estados-unidos',
  1998: '1998-francia',
  2002: '2002-corea-japon',
  2006: '2006-alemania',
  2010: '2010-sudafrica',
  2014: '2014-brasil',
  2018: '2018-rusia',
  2022: '2022-qatar',
};

export function TeamPhotoGallery({
  teamCode,
  teamName,
  locale,
}: {
  teamCode: string;
  teamName: string;
  locale: string;
}) {
  const byYear = getTeamPhotosByYear(teamCode);
  if (byYear.size === 0) return null;

  const years = [...byYear.keys()];
  const totalPhotos = [...byYear.values()].reduce((sum, list) => sum + list.length, 0);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Camera className="h-4 w-4" />
            <span>Galería histórica</span>
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            {teamName} a lo largo de los Mundiales
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)] md:text-base">
            {totalPhotos} {totalPhotos === 1 ? 'foto verificada' : 'fotos verificadas'} en{' '}
            {years.length} {years.length === 1 ? 'edición' : 'ediciones'} del torneo. Imágenes con licencia libre — Wikimedia Commons.
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-16">
        {years.map((year) => {
          const list = byYear.get(year) ?? [];
          if (list.length === 0) return null;
          const featured = list.find((p) => p.featured) ?? list[0];
          const rest = list.filter((p) => p !== featured);
          const tournamentSlug = YEAR_TO_SLUG[year];

          return (
            <div key={year} className="border-t border-[var(--color-border)] pt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-5xl tab-num text-[var(--color-fg)] md:text-6xl">
                    {year}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    {list.length} {list.length === 1 ? 'foto' : 'fotos'}
                  </span>
                </div>
                {tournamentSlug && (
                  <Link
                    href={withLocale(locale as Locale, `/ediciones/${tournamentSlug}`)}
                    className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
                  >
                    Mundial {year}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                  </Link>
                )}
              </div>

              {/* Featured + grid de complementarias */}
              <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:gap-5">
                <PhotoCard photo={featured} priority />
                {rest.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {rest.slice(0, 4).map((p, i) => (
                      <PhotoCard key={p.url + i} photo={p} compact />
                    ))}
                  </div>
                )}
              </div>

              {rest.length > 4 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {rest.slice(4).map((p, i) => (
                    <PhotoCard key={p.url + i + 'x'} photo={p} compact />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PhotoCard({
  photo,
  priority,
  compact,
}: {
  photo: TeamPhoto;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] transition-colors hover:border-[var(--color-border-strong)]">
      <div className={`relative w-full ${compact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={compact ? '(max-width: 640px) 50vw, 25vw' : '(max-width: 1024px) 100vw, 60vw'}
          className="object-cover"
          unoptimized
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[var(--color-border)] px-4 py-3">
        <span className={`text-[var(--color-fg)] ${compact ? 'text-xs' : 'text-sm'}`}>{photo.caption}</span>
        <a
          href={photo.source}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
        >
          {photo.credit} · {photo.license}
        </a>
      </figcaption>
    </figure>
  );
}
