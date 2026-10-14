'use client';

import { useState } from 'react';
import { uploadsPlaylist, type YtVideo } from '@/lib/youtube';

const dateEs = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'Europe/Madrid' }).format(d);
};

/**
 * Carrusel de vídeos del canal oficial. Fachada: solo miniatura hasta que el
 * usuario pulsa; entonces carga el reproductor de youtube-nocookie. Así no se
 * cargan iframes ni cookies de YouTube al abrir la página.
 */
export function YouTubeCarousel({ videos, channelUrl, team }: { videos: YtVideo[]; channelUrl?: string; team: string }) {
  const [playing, setPlaying] = useState<string | null>(null);
  if (videos.length === 0) return null;
  return (
    <div>
      <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10">
        {videos.map((v) => (
          <figure key={v.id} className="w-[280px] shrink-0 snap-start md:w-[340px]">
            <div className="relative aspect-video overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
              {playing === v.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button type="button" onClick={() => setPlaying(v.id)} className="group absolute inset-0" aria-label={`Reproducir: ${v.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 grid place-items-center bg-black/20 group-hover:bg-black/10">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-black/70 text-white">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </button>
              )}
            </div>
            <figcaption className="mt-2">
              <span className="line-clamp-2 text-sm font-medium leading-snug text-[var(--color-fg)]">{v.title}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{dateEs(v.published)}{v.views ? ` · ${v.views.toLocaleString('es-ES')} visualizaciones` : ''}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {channelUrl && (
        <a href={channelUrl} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)] hover:underline">Canal oficial de {team} en YouTube →</a>
      )}
    </div>
  );
}

/** Sin lista de vídeos: reproductor con las últimas subidas del canal, cargado al pulsar. */
export function ChannelPlaylist({ channelId, channelUrl, team, color }: { channelId: string; channelUrl?: string; team: string; color?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-[860px]">
      <div className="relative aspect-video overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
        {open ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${uploadsPlaylist(channelId)}&autoplay=1&rel=0`}
            title={`Últimos vídeos de ${team}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="group absolute inset-0 grid place-items-center" style={color ? { background: `linear-gradient(135deg, #${color}55, transparent 70%)` } : undefined} aria-label={`Ver los últimos vídeos de ${team}`}>
            <span className="flex flex-col items-center gap-3">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-black/70 text-white transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="text-sm font-semibold text-[var(--color-fg)]">Ver los últimos vídeos de {team}</span>
            </span>
          </button>
        )}
      </div>
      {channelUrl && (
        <a href={channelUrl} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)] hover:underline">Canal oficial de {team} en YouTube →</a>
      )}
    </div>
  );
}
