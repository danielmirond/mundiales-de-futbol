'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FeedCard } from '@/lib/live-feed';
import { Crest } from '@/components/portal/crest';
import { Reactions } from './reactions';
import type { CardReactions } from '@/lib/feed-reactions';

const ago = (iso: string) => {
  if (!iso) return '';
  const m = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`;
};
const LANG: Record<string, string> = { en: 'EN', it: 'IT', de: 'DE', pt: 'PT', fr: 'FR' };

function Share({ title, href }: { title: string; href: string }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    const url = href.startsWith('http') ? href : `${location.origin}${href}`;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1500); }
    } catch { /* cancelado */ }
  };
  return (
    <button type="button" onClick={onClick} aria-label="Compartir" className="grid h-12 w-12 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60">
      {done ? <span className="text-[10px] font-semibold">Copiado</span> : (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" /></svg>
      )}
    </button>
  );
}

/** Fondo: imagen a sangre con degradado para leer el texto encima. */
function Backdrop({ image, color }: { image?: string; color?: string }) {
  return (
    <>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 20% 10%, ${color ?? 'var(--accent)'}55, transparent 60%), var(--color-bg-2)` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
    </>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">{children}</div>;
}

function VideoCard({ c, play, setPlay }: { c: Extract<FeedCard, { kind: 'video' }>; play: boolean; setPlay: (v: boolean) => void }) {
  return (
    <>
      <Backdrop color={c.color} />
      <div className="absolute inset-x-0 top-[18%] mx-auto aspect-video w-full max-w-[460px] overflow-hidden bg-black">
        {play ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/videoseries?list=UU${c.channelId.slice(2)}&autoplay=1&rel=0&playsinline=1`} title={`Vídeos de ${c.team}`}
            allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="h-full w-full" />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="grid h-full w-full place-items-center" aria-label={`Ver vídeos de ${c.team}`}>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-black"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg></span>
          </button>
        )}
      </div>
      <div className="relative mt-auto p-6 pb-10">
        <Kicker>Vídeo · Canal oficial</Kicker>
        <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">Lo último de {c.team}</h2>
        {c.channelUrl && <a href={c.channelUrl} target="_blank" rel="noopener" className="mt-4 inline-flex text-sm font-semibold text-white/85 hover:text-white">Abrir el canal en YouTube ↗</a>}
      </div>
    </>
  );
}

function ScoreCard({ c }: { c: Extract<FeedCard, { kind: 'score' }> }) {
  const m = c.match;
  const live = m.state === 'in';
  const side = (t: typeof m.home, win: boolean) => (
    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
      <Crest src={t.logo} abbr={t.abbr} color={t.color} size="l" />
      <span className={`w-full truncate text-[15px] leading-tight ${win ? 'font-semibold text-white' : 'text-white/75'}`}>{t.name}</span>
    </div>
  );
  const hs = m.home.score ?? 0, as = m.away.score ?? 0;
  return (
    <>
      <Backdrop color={m.home.color ? `#${m.home.color}` : undefined} />
      <a href={c.href} className="relative my-auto flex flex-col items-center px-6">
        <Kicker>{c.comp}</Kicker>
        <div className="mt-3">{live ? <span className="st live"><i className="pulse" />En directo{m.clock ? ` · ${m.clock}` : ''}</span> : <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">Final</span>}</div>
        <div className="mt-8 grid w-full max-w-[420px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          {side(m.home, hs > as)}
          <span className="font-display text-[48px] leading-none tab-num text-white sm:text-[64px]">{hs}<span className="mx-1.5 text-white/40">-</span>{as}</span>
          {side(m.away, as > hs)}
        </div>
        <span className="mt-10 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-black">Ver el partido</span>
      </a>
    </>
  );
}

function Card({ c, play, setPlay }: { c: FeedCard; play: boolean; setPlay: (v: boolean) => void }) {
  if (c.kind === 'video') return <VideoCard c={c} play={play} setPlay={setPlay} />;
  if (c.kind === 'score') return <ScoreCard c={c} />;
  const press = c.kind === 'press';
  return (
    <>
      <Backdrop image={c.image} />
      <div className="relative mt-auto p-6 pb-10 pr-20">
        <Kicker>{press ? `${c.comp} · ${c.source}` : `${c.label} · Mundiales`}</Kicker>
        <h2 className="mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-white md:text-[32px]">{c.title}</h2>
        {!press && <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-white/80">{c.summary}</p>}
        <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
          {press && LANG[c.lang] && <span className="rounded-full bg-white/15 px-2 py-0.5">{LANG[c.lang]}</span>}
          <span>{ago(c.date)}</span>
        </div>
        <a href={c.href} {...(press ? { target: '_blank', rel: 'noopener nofollow' } : {})} className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-black">
          {press ? `Leer en ${c.source} ↗` : 'Leer la pieza'}
        </a>
      </div>
    </>
  );
}

/**
 * Directo vertical: una tarjeta por pantalla con scroll por imán (snap).
 * En escritorio, columna central tipo móvil; flechas ↑/↓ y j/k para pasar.
 */
export function LiveFeed({ cards }: { cards: FeedCard[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Vídeo en reproducción: se descarga (y se para) en cuanto su tarjeta sale de pantalla.
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        const i = Number((e.target as HTMLElement).dataset.i);
        setActive(i);
        setPlaying((p) => (p === cards[i]?.id ? p : null));
      }
    }, { root, threshold: 0.6 });
    root.querySelectorAll('[data-i]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cards]);

  // Reacciones de la tarjeta activa y sus vecinas; se refrescan cada 15 s.
  const [reactions, setReactions] = useState<Record<string, CardReactions>>({});
  const loadReactions = useCallback(async (center: number) => {
    const ids = cards.slice(Math.max(0, center - 1), center + 3).map((c) => c.id);
    if (!ids.length) return;
    try {
      const r = await fetch(`/api/feed-react?cards=${ids.join(',')}`, { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); setReactions((prev) => ({ ...prev, ...j })); }
    } catch { /* sin red: se mantiene lo último */ }
  }, [cards]);
  useEffect(() => {
    const first = setTimeout(() => loadReactions(active), 0);
    const t = setInterval(() => loadReactions(active), 15_000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [active, loadReactions]);

  const go = useCallback((d: number) => {
    const root = box.current;
    if (root) root.scrollBy({ top: d * root.clientHeight, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input,textarea')) return;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return (
    <div className="relative mx-auto h-[calc(100svh-var(--header-h,7rem))] w-full md:max-w-[480px] md:py-4">
      <div ref={box} className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll md:rounded-[24px] md:border md:border-[var(--color-border)]">
        {cards.map((c, i) => (
          <section key={c.id} data-i={i} data-sport={c.sport} className="relative flex h-full snap-start snap-always flex-col overflow-hidden bg-black">
            <Card c={c} play={playing === c.id} setPlay={(v) => setPlaying(v ? c.id : null)} />
            {c.kind !== 'video' && <Reactions card={c.id} match={c.kind === 'score'} data={reactions[c.id]} active={active === i} onReacted={() => loadReactions(i)} />}
            {c.kind !== 'video' && (
              <div className="absolute bottom-28 right-4 flex flex-col items-center gap-3">
                <Share title={c.kind === 'score' ? `${c.match.home.name} ${c.match.home.score ?? 0}-${c.match.away.score ?? 0} ${c.match.away.name}` : c.title} href={c.href} />
              </div>
            )}
          </section>
        ))}
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] tab-num text-white md:right-6 md:top-8">{active + 1}/{cards.length}</div>
      <div className="absolute right-[-64px] top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        <button type="button" onClick={() => go(-1)} aria-label="Anterior" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-bg-2)]">↑</button>
        <button type="button" onClick={() => go(1)} aria-label="Siguiente" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-bg-2)]">↓</button>
      </div>
    </div>
  );
}
