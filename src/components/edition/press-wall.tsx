import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import {
  getMediaForTournament,
  mediaTitle,
  mediaDescription,
  type MediaItem,
} from '@/lib/data/media';

function ClippingCard({ item, locale }: { item: MediaItem; locale: string }) {
  const title = mediaTitle(item, locale);
  const kicker = mediaDescription(item, locale);

  return (
    <article
      className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl shadow-xl transition-transform duration-500 hover:scale-[1.02]"
      style={{ background: '#1b100a' }}
    >
      <Image
        src={item.thumbnail_url!}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, 33vw"
        className="object-cover"
        unoptimized={false}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          {item.attribution}
        </div>
        <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
        {kicker && <p className="mt-1 text-xs text-white/80 leading-snug">{kicker}</p>}
        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
          {item.credit?.split('·').pop()?.trim()}
        </div>
      </div>
      {item.featured && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-[var(--color-pitch)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-black">
          Portada
        </span>
      )}
    </article>
  );
}

function PressGrid({ items, locale }: { items: MediaItem[]; locale: string }) {
  return (
    <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ClippingCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

export async function PressWall({ year, locale }: { year: number; locale: string }) {
  const all = await getMediaForTournament(year);
  // Only show press items that have a real image (scan or article OG).
  const press = all.filter((m) => m.source === 'press' && !!m.thumbnail_url);
  if (press.length === 0) return null;

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Así lo narró la prensa
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        {press.length} portada{press.length === 1 ? '' : 's'}
      </h2>
      <PressGrid items={press} locale={locale} />
    </section>
  );
}

export async function MatchPressWall({ matchId, locale }: { matchId: string; locale: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('media')
    .select(
      'id, kind, source, source_id, url, embed_url, thumbnail_url, tournament_year, title_i18n, description_i18n, credit, attribution, featured',
    )
    .eq('match_id', matchId)
    .eq('source', 'press')
    .not('thumbnail_url', 'is', null)
    .order('featured', { ascending: false });

  const press = (data ?? []) as MediaItem[];
  if (press.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Titulares del día
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        Cómo lo contó la prensa
      </h2>
      <PressGrid items={press} locale={locale} />
    </section>
  );
}
