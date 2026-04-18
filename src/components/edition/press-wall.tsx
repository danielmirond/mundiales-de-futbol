import { getMediaForTournament, mediaTitle, mediaDescription, type MediaItem } from '@/lib/data/media';

function Clipping({ item, locale, rotation }: { item: MediaItem; locale: string; rotation: number }) {
  const title = mediaTitle(item, locale);
  const kicker = mediaDescription(item, locale);
  return (
    <article
      className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-sm shadow-xl transition-transform duration-500 hover:!rotate-0 hover:scale-[1.02]"
      style={{
        background: `
          radial-gradient(120% 80% at 20% 0%, rgba(255, 244, 220, 0.04) 0%, transparent 50%),
          linear-gradient(180deg, #ede3cc 0%, #dfd2b2 70%, #cfbf98 100%)
        `,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-35"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25 0 0 0 0 0.18 0 0 0 0 0.1 0 0 0 0.4 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 flex flex-col gap-2 p-6 pt-5">
        <div
          className="flex items-center justify-between border-b-2 pb-2"
          style={{
            borderColor: 'rgba(40, 26, 10, 0.6)',
            fontFamily: "'Times New Roman', Georgia, serif",
            color: '#281a0a',
          }}
        >
          <span className="font-serif italic text-xs tracking-wider">
            {item.attribution?.toUpperCase()}
          </span>
          <span className="font-mono text-[10px] tracking-wider">
            {item.credit?.split('·').pop()?.trim()}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 px-6">
        <h3
          className="font-serif leading-[0.95]"
          style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 900,
            color: '#1b100a',
            fontSize: 'clamp(1.2rem, 2.6vw, 1.75rem)',
          }}
        >
          {title}
        </h3>
        {kicker && (
          <p
            className="mt-3 font-serif text-sm leading-snug"
            style={{
              fontFamily: "'Times New Roman', Georgia, serif",
              color: '#3c2a16',
              fontStyle: 'italic',
            }}
          >
            {kicker}
          </p>
        )}
      </div>

      {/* Credit line */}
      <div className="relative z-10 flex items-center justify-between p-5 pt-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(40, 26, 10, 0.55)' }}>
        <span>{item.credit?.split('·')[1]?.trim() ?? ''}</span>
        {item.featured && <span className="rounded-full bg-[#1b100a] px-2 py-0.5 text-[#ede3cc]">Portada</span>}
      </div>

      {/* Fold shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-40"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1), transparent)' }}
      />
    </article>
  );
}

export async function PressWall({ year, locale }: { year: number; locale: string }) {
  const all = await getMediaForTournament(year);
  const press = all.filter((m) => m.source === 'press');
  if (press.length === 0) return null;

  // Subtle rotations for a "scattered on a desk" feel
  const rotations = [-2.5, 1.8, -1.2, 2.2, -0.8, 1.5, -2, 0.9];

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Así lo narró la prensa
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        {press.length} titular{press.length === 1 ? '' : 'es'}
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
        Portadas y aperturas reales de la prensa mundial en el día del Mundial. Textos citados editorialmente.
      </p>

      <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {press.map((item, i) => (
          <Clipping key={item.id} item={item} locale={locale} rotation={rotations[i % rotations.length]} />
        ))}
      </div>
    </section>
  );
}
