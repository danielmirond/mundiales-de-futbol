import Link from 'next/link';
import { buildLiveFeed, type FeedCard } from '@/lib/live-feed';
import { BrandSymbol } from '@/components/brand/brand-mark';
import { AutoSwipe } from './auto-swipe';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

function Mini({ c, eager }: { c: FeedCard; eager: boolean }) {
  if (c.kind === 'score') {
    const m = c.match, live = m.state === 'in';
    return (
      <span className="flex h-full flex-col items-center justify-center gap-2 bg-[var(--color-bg-2)] px-3 text-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">{c.comp}</span>
        <span className="font-display text-[40px] leading-none tab-num text-[var(--color-fg)]">{m.home.score ?? 0}-{m.away.score ?? 0}</span>
        <span className="text-[11px] leading-tight text-[var(--color-fg-muted)]">{m.home.name}<br />{m.away.name}</span>
        <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${live ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-subtle)]'}`}>{live ? 'En directo' : 'Final'}</span>
      </span>
    );
  }
  if (c.kind === 'ad') {
    return (
      <span className="flex h-full flex-col justify-end gap-2 bg-[var(--color-bg-2)] p-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Publicidad</span>
        <span className="text-[14px] font-semibold leading-tight text-[var(--color-fg)]">{c.campaign.titulo}</span>
      </span>
    );
  }
  if (c.kind === 'video') {
    return (
      <span className="flex h-full flex-col justify-end gap-2 bg-[radial-gradient(120%_80%_at_20%_10%,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_60%),var(--color-bg-2)] p-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg></span>
        <span className="text-[14px] font-semibold leading-tight text-white">Vídeos de {c.team}</span>
      </span>
    );
  }
  const img = c.image;
  return (
    <span className="relative flex h-full flex-col justify-end">
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" loading={eager ? 'eager' : 'lazy'} referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <span className="relative flex flex-col gap-1.5 p-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">{c.kind === 'press' ? c.source : c.label}</span>
        <span className="line-clamp-4 text-[14px] font-semibold leading-[1.2] text-white">{c.title}</span>
      </span>
    </span>
  );
}

/**
 * Entrada al directo en la portada: tarjetas verticales que abren el feed a
 * pantalla completa justo en la tarjeta pulsada (`/directo#c-<id>`).
 */
export async function LiveStrip({ locale, sport, title = 'Lo último, deslizando' }: { locale: Locale; sport?: string; title?: string }) {
  // La tira enseña lo que cambia: sin vídeos de club ni anuncios (esos viven en el directo).
  const cards = (await buildLiveFeed((h) => withLocale(locale, h), { sport })).filter((c) => c.kind !== 'video' && c.kind !== 'ad').slice(0, 12);
  if (cards.length < 4) return null;
  const base = withLocale(locale, '/directo');
  const href = sport ? `${base}?d=${sport}` : base;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pt-8 md:px-10" aria-labelledby="directo-titulo">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="kicker flex items-center gap-2"><i className="pulse" />Directo</div>
          <h2 id="directo-titulo" className="t-h2 mt-2 text-[var(--color-fg)]">{title}</h2>
        </div>
        <Link href={href} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--color-fg)] px-4 text-sm font-semibold text-[var(--color-bg)]">
          <BrandSymbol size={16} />Abrir el directo
        </Link>
      </div>
      <AutoSwipe className="no-scrollbar -mx-6 mt-5 flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 md:-mx-10 md:scroll-px-10 md:px-10">
        {cards.map((c, i) => (
          <Link key={c.id} href={`${href}#c-${c.id}`} data-sport={c.sport}
            className="relative block aspect-[9/16] w-[148px] shrink-0 snap-start overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-black transition-transform hover:-translate-y-0.5 md:w-[168px]">
            <Mini c={c} eager={i < 3} />
          </Link>
        ))}
      </AutoSwipe>
    </section>
  );
}
