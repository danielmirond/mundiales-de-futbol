'use client';

import { useEffect, useRef, useState } from 'react';
import { ALL_REACTIONS, REACTIONS_GENERAL, REACTIONS_MATCH, type CardReactions } from '@/lib/feed-reactions';

const MINE = 'feed-reactions-v1';
const readMine = (): Record<string, string> => { try { return JSON.parse(localStorage.getItem(MINE) ?? '{}'); } catch { return {}; } };
const saveMine = (m: Record<string, string>) => { try { localStorage.setItem(MINE, JSON.stringify(m)); } catch { /* modo privado */ } };

/** Burbujas que suben sobre la tarjeta con las últimas reacciones (estilo directo). */
function Floating({ items }: { items: { id: number; text: string }[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute bottom-40 right-16 h-[45%] w-44 overflow-hidden">
      {items.map((b) => (
        <span key={b.id} className="feed-bubble absolute bottom-0 right-0 whitespace-nowrap rounded-full bg-black/55 px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur">{b.text}</span>
      ))}
    </div>
  );
}

/**
 * Raíl de reacciones de una tarjeta: botón con el total, bandeja de frases
 * cerradas y burbujas flotantes con lo que va reaccionando la gente.
 */
export function Reactions({ card, match, data, active, onReacted }: {
  card: string; match: boolean; data?: CardReactions; active: boolean; onReacted: () => void;
}) {
  const defs = match ? REACTIONS_MATCH : REACTIONS_GENERAL;
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState<string | undefined>(undefined);
  const [local, setLocal] = useState<Record<string, number>>({});
  const [bubbles, setBubbles] = useState<{ id: number; text: string }[]>([]);
  const seq = useRef(0);

  // La reacción propia vive en localStorage: se lee tras hidratar (no existe en servidor).
  useEffect(() => { const t = setTimeout(() => setMine(readMine()[card]), 0); return () => clearTimeout(t); }, [card]);

  // Al entrar en pantalla, repasa las últimas reacciones como burbujas, una cada 0,9 s.
  useEffect(() => {
    if (!active || !data?.recent.length) return;
    const list = [...data.recent].reverse();
    let i = 0;
    const t = setInterval(() => {
      const r = ALL_REACTIONS.get(list[i % list.length].reaction);
      if (r) { const id = ++seq.current; setBubbles((b) => [...b.slice(-5), { id, text: `${r.emoji} ${r.label}` }]); }
      if (++i >= Math.min(list.length, 8)) clearInterval(t);
    }, 900);
    return () => clearInterval(t);
  }, [active, data]);

  const counts = { ...(data?.counts ?? {}) };
  for (const [k, v] of Object.entries(local)) counts[k] = (counts[k] ?? 0) + v;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const top = Object.entries(counts).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const react = async (key: string) => {
    setOpen(false);
    if (mine === key) return;
    setLocal((l) => ({ ...l, [key]: (l[key] ?? 0) + 1, ...(mine ? { [mine]: (l[mine] ?? 0) - 1 } : {}) }));
    setMine(key);
    saveMine({ ...readMine(), [card]: key });
    const r = ALL_REACTIONS.get(key);
    if (r) { const id = ++seq.current; setBubbles((b) => [...b.slice(-5), { id, text: `${r.emoji} ${r.label}` }]); }
    try { await fetch('/api/feed-react', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ card, reaction: key }) }); onReacted(); } catch { /* se reintenta al volver */ }
  };

  return (
    <>
      <Floating items={bubbles} />
      {top.length > 0 && (
        <div className="pointer-events-none absolute left-6 top-6 flex gap-1.5">
          {top.map(([k, n]) => <span key={k} className="rounded-full bg-black/50 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">{ALL_REACTIONS.get(k)?.emoji} {n}</span>)}
        </div>
      )}
      <div className="absolute bottom-[11.5rem] right-4 z-10 flex flex-col items-center">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Reaccionar"
          className={`grid h-12 w-12 place-items-center rounded-full text-[22px] backdrop-blur ${mine ? 'bg-white text-black' : 'bg-black/45 text-white hover:bg-black/60'}`}>
          {mine ? ALL_REACTIONS.get(mine)?.emoji : '😀'}
        </button>
        <span className="mt-1 font-mono text-[11px] tab-num text-white">{total || ''}</span>
        {open && (
          <div role="menu" className="absolute bottom-0 right-14 w-[220px] rounded-[18px] border border-white/15 bg-black/80 p-2 backdrop-blur">
            {defs.map((r) => (
              <button key={r.key} role="menuitem" type="button" onClick={() => react(r.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] text-white hover:bg-white/10 ${mine === r.key ? 'bg-white/15 font-semibold' : ''}`}>
                <span className="text-[20px]">{r.emoji}</span>{r.label}
                <span className="ml-auto font-mono text-[11px] text-white/60">{counts[r.key] || ''}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
