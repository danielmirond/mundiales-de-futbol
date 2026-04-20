import { Play, ExternalLink } from 'lucide-react';
import { getMediaForTournament, mediaTitle, type MediaItem } from '@/lib/data/media';

function sourceLabel(src: string) {
  if (src === 'youtube') return 'YouTube · FIFA';
  if (src === 'archive.org') return 'Internet Archive';
  return src;
}

function ArchiveCard({ item, locale }: { item: MediaItem; locale: string }) {
  const title = mediaTitle(item, locale);
  const embed =
    item.embed_url ??
    (item.source === 'youtube' && item.source_id
      ? `https://www.youtube-nocookie.com/embed/${item.source_id}`
      : item.source_id
        ? `https://archive.org/embed/${item.source_id}`
        : null);
  const href =
    item.url ??
    (item.source === 'youtube' && item.source_id
      ? `https://www.youtube.com/watch?v=${item.source_id}`
      : item.source_id
        ? `https://archive.org/details/${item.source_id}`
        : '#');

  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] transition-colors hover:border-[var(--color-border-strong)]">
      <div className="relative aspect-video w-full bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        ) : item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={title}
            className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
          />
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {sourceLabel(item.source)}
            {item.featured && ' · Destacado'}
          </div>
          <h3 className="mt-2 text-base font-medium leading-snug text-[var(--color-fg)]">
            {title}
          </h3>
          {item.attribution && (
            <div className="mt-2 text-xs text-[var(--color-fg-subtle)]">{item.attribution}</div>
          )}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-[var(--color-border-strong)] p-2.5 text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          aria-label={`Abrir en ${sourceLabel(item.source)}`}
        >
          <Play className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export async function ArchiveVideos({ year, locale }: { year: number; locale: string }) {
  const all = await getMediaForTournament(year);
  const items = all.filter((m) => m.kind === 'video');

  // Split by source so the display groups logically
  const youtube = items.filter((m) => m.source === 'youtube');
  const archive = items.filter((m) => m.source === 'archive.org');

  const fifaSearch = `https://www.youtube.com/@fifa/search?query=${encodeURIComponent(
    `World Cup ${year}`,
  )}`;

  if (items.length === 0 && year < 1958) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Videoteca
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            {items.length > 0
              ? `${items.length} vídeo${items.length === 1 ? '' : 's'}`
              : 'Buscar en FIFA TV'}
          </h2>
        </div>
        <a
          href={fifaSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          Más en @fifa
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {youtube.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            YouTube · FIFA oficial
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {youtube.map((item) => (
              <ArchiveCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {archive.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Internet Archive · películas y noticieros históricos
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {archive.map((item) => (
              <ArchiveCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
