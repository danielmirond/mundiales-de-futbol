import { Play } from 'lucide-react';
import { getMediaForTournament, mediaTitle, type MediaItem } from '@/lib/data/media';

function ArchiveCard({ item, locale }: { item: MediaItem; locale: string }) {
  const title = mediaTitle(item, locale);
  const embed = item.embed_url ?? (item.source_id ? `https://archive.org/embed/${item.source_id}` : null);
  const href = item.url ?? (item.source_id ? `https://archive.org/details/${item.source_id}` : '#');

  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] transition-colors hover:border-[var(--color-border-strong)]">
      <div className="relative aspect-video w-full bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={title}
            loading="lazy"
            allow="fullscreen"
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
            {item.source === 'youtube' ? 'YouTube · Internet Archive' : 'Internet Archive'}
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
          aria-label="Abrir en Internet Archive"
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
  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Videoteca · Internet Archive
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        {items.length} vídeo{items.length === 1 ? '' : 's'}
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <ArchiveCard key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </section>
  );
}
