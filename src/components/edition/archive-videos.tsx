import { Play, ExternalLink } from 'lucide-react';
import { getMediaForTournament, mediaTitle, type MediaItem } from '@/lib/data/media';

function sourceLabel(src: string) {
  if (src === 'youtube') return 'YouTube · FIFA';
  if (src === 'archive.org') return 'Internet Archive';
  return src;
}

/**
 * Estrategia de reproducción:
 * - YouTube (FIFA): NO embedimos (FIFA bloquea muchos embeds y el iframe
 *   muestra "Video no disponible"). Mostramos thumbnail clickable que
 *   abre la búsqueda en YouTube en pestaña nueva → siempre funciona.
 * - Internet Archive: sí embedimos (no bloquea).
 */
function ArchiveCard({ item, locale }: { item: MediaItem; locale: string }) {
  const title = mediaTitle(item, locale);
  const isYouTube = item.source === 'youtube';

  // Para YouTube no embedimos: enlazamos directo al vídeo o a la búsqueda.
  const youtubeHref = isYouTube
    ? item.source_id
      ? `https://www.youtube.com/watch?v=${item.source_id}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`
    : null;

  // Para Archive.org sí podemos embeber (no bloquea)
  const archiveEmbed =
    item.source === 'archive.org' && item.source_id
      ? `https://archive.org/embed/${item.source_id}`
      : null;
  const archiveHref =
    item.url ??
    (item.source === 'archive.org' && item.source_id
      ? `https://archive.org/details/${item.source_id}`
      : null);

  // Thumbnail YouTube por defecto si no se aporta
  const thumb =
    item.thumbnail_url ??
    (isYouTube && item.source_id
      ? `https://i.ytimg.com/vi/${item.source_id}/hqdefault.jpg`
      : null);

  const finalHref = youtubeHref ?? archiveHref ?? item.url ?? '#';

  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] transition-colors hover:border-[var(--color-border-strong)]">
      {isYouTube ? (
        // YouTube → tarjeta clickable (no iframe), siempre funciona
        <a
          href={finalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-video w-full overflow-hidden bg-black"
          aria-label={`Ver "${title}" en YouTube`}
        >
          {thumb && (
            <img
              src={thumb}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-pitch)] text-black shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 fill-current" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            YouTube
          </div>
        </a>
      ) : archiveEmbed ? (
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={archiveEmbed}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        </div>
      ) : thumb ? (
        <div className="relative aspect-video w-full bg-black">
          <img
            src={thumb}
            alt={title}
            className="h-full w-full object-cover opacity-70"
            loading="lazy"
          />
        </div>
      ) : null}
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
          href={finalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-[var(--color-border-strong)] p-2.5 text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          aria-label={`Abrir en ${sourceLabel(item.source)}`}
        >
          <ExternalLink className="h-4 w-4" />
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
