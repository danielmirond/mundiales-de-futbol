'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import {
  GALLERY,
  ERA_LABELS,
  TYPE_LABELS,
  getErasWithPhotos,
  getTeamCodesWithPhotos,
  type GalleryEra,
  type GalleryPhoto,
  type GalleryPhotoType,
} from '@/lib/gallery';

const ALL_ERAS = getErasWithPhotos();
const ALL_TEAMS = getTeamCodesWithPhotos();
const ALL_TYPES: GalleryPhotoType[] = ['champion', 'action', 'portrait', 'venue', 'trophy', 'squad'];

type Filters = {
  era: GalleryEra | null;
  team: string | null;
  type: GalleryPhotoType | null;
};

export function PhotoGallery() {
  const [filters, setFilters] = useState<Filters>({ era: null, team: null, type: null });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return GALLERY.filter((p) => {
      if (filters.era && p.era !== filters.era) return false;
      if (filters.team && p.teamCode !== filters.team) return false;
      if (filters.type && p.type !== filters.type) return false;
      return true;
    });
  }, [filters]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      else if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i === null || i === 0 ? i : i - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i === null || i >= filtered.length - 1 ? i : i + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, filtered.length]);

  const activePhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const hasFilters = filters.era || filters.team || filters.type;

  return (
    <>
      {/* Filtros */}
      <div className="mt-12 space-y-4">
        <FilterRow
          label="Década"
          options={ALL_ERAS.map((e) => ({ value: e, label: ERA_LABELS[e] }))}
          value={filters.era}
          onChange={(v) => setFilters((f) => ({ ...f, era: v as GalleryEra | null }))}
        />
        <FilterRow
          label="Selección"
          options={ALL_TEAMS.map((c) => ({ value: c, label: c }))}
          value={filters.team}
          onChange={(v) => setFilters((f) => ({ ...f, team: v }))}
        />
        <FilterRow
          label="Tipo"
          options={ALL_TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] }))}
          value={filters.type}
          onChange={(v) => setFilters((f) => ({ ...f, type: v as GalleryPhotoType | null }))}
        />
        {hasFilters && (
          <button
            onClick={() => setFilters({ era: null, team: null, type: null })}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            ← Quitar filtros · {filtered.length} foto{filtered.length === 1 ? '' : 's'}
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <p className="text-[var(--color-fg-muted)]">
            Ninguna foto coincide con los filtros activos.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filtered.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--color-bg-2)] text-left transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-pitch)]"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                  {photo.year} · {TYPE_LABELS[photo.type]}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-snug text-white md:text-sm">
                  {photo.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {activePhoto && lightboxIndex !== null && (
        <Lightbox
          photo={activePhoto}
          onClose={() => setLightboxIndex(null)}
          onPrev={
            lightboxIndex > 0 ? () => setLightboxIndex(lightboxIndex - 1) : null
          }
          onNext={
            lightboxIndex < filtered.length - 1
              ? () => setLightboxIndex(lightboxIndex + 1)
              : null
          }
          counter={`${lightboxIndex + 1} / ${filtered.length}`}
        />
      )}
    </>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(active ? null : opt.value)}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              active
                ? 'border-[var(--color-pitch)] bg-[var(--color-pitch)]/15 text-[var(--color-pitch)]'
                : 'border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  counter,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  counter: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
    >
      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute left-4 top-4 font-mono text-xs uppercase tracking-[0.2em] text-white/60 md:left-8 md:top-8">
        {counter}
      </div>

      {/* Prev */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:left-6"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next */}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:right-6"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Content */}
      <div
        className="relative flex w-full max-w-6xl flex-col gap-4 md:flex-row md:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[70vh] flex-1 overflow-hidden rounded-2xl bg-black md:max-h-[80vh]">
          <img
            src={photo.url}
            alt={photo.alt}
            className="h-full w-full object-contain"
          />
        </div>
        <aside className="flex w-full flex-col gap-4 rounded-2xl bg-[var(--color-bg-2)]/80 p-6 backdrop-blur md:w-80 md:flex-shrink-0">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {photo.year} · {ERA_LABELS[photo.era]} · {TYPE_LABELS[photo.type]}
            </div>
            {photo.teamCode && (
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                {photo.teamCode}
              </div>
            )}
          </div>
          <p className="text-sm leading-relaxed text-white">{photo.caption}</p>
          <div className="mt-auto space-y-2 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            <div>{photo.credit}</div>
            <div>{photo.license}</div>
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
            >
              Ver en Wikimedia <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
