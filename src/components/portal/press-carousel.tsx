'use client';

import { useState } from 'react';
import type { PressItem } from '@/lib/press-feeds';

const LANG: Record<string, string> = { en: 'EN', it: 'IT', de: 'DE', pt: 'PT', fr: 'FR' };
const ago = (iso: string) => {
  if (!iso) return '';
  const m = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (m < 60) return `hace ${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`;
};

/** Carrusel de titulares de prensa (España / internacional) que enlazan al medio original. */
export function PressCarousel({ items, title }: { items: PressItem[]; title: string }) {
  const [tab, setTab] = useState<'all' | 'ES' | 'INT'>('all');
  const hasBoth = items.some((i) => i.region === 'ES') && items.some((i) => i.region === 'INT');
  const shown = tab === 'all' ? items : items.filter((i) => i.region === tab);
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="kicker">En la prensa</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{title}</h2>
        </div>
        {hasBoth && (
          <div role="tablist" className="flex gap-1.5">
            {([['all', 'Todo'], ['ES', 'España'], ['INT', 'Internacional']] as const).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] ${tab === k ? 'border-transparent bg-[var(--color-fg)] font-semibold text-[var(--color-bg)]' : 'border-[var(--color-border)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'}`}>{l}</button>
            ))}
          </div>
        )}
      </div>
      <div className="no-scrollbar -mx-6 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10">
        {shown.map((i) => (
          <a key={i.link} href={i.link} target="_blank" rel="noopener nofollow" className="group flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-2)] hover:border-[var(--color-border-strong)] md:w-[300px]">
            <div className="relative aspect-[16/9] bg-[var(--color-surface)]">
              {i.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              )}
              {LANG[i.lang] && <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">{LANG[i.lang]}</span>}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <span className="line-clamp-3 text-[15px] font-semibold leading-snug text-[var(--color-fg)] group-hover:text-[var(--accent-ink)]">{i.title}</span>
              <span className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{i.source}{i.date ? ` · ${ago(i.date)}` : ''} ↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
