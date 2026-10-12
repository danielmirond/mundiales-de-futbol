'use client';

import { useEffect, useSyncExternalStore } from 'react';

export type LiveToday = { live: number; total: number; liveSlugs: string[]; todaySlugs: string[] };
const EMPTY: LiveToday = { live: 0, total: 0, liveSlugs: [], todaySlugs: [] };

// Pequeño store compartido: el snapshot de servidor es siempre EMPTY, así la
// hidratación coincide con el SSR aunque otro componente ya haya cargado datos.
let snapshot: LiveToday = EMPTY;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let inflight: Promise<void> | null = null;

const load = () => {
  inflight ??= fetch('/api/live-today', { cache: 'no-store' })
    .then((r) => r.json())
    .then((j) => { if (j && typeof j.live === 'number') { snapshot = j; listeners.forEach((l) => l()); } })
    .catch(() => {})
    .finally(() => { inflight = null; });
  return inflight;
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  if (!timer) { timer = setInterval(load, 60_000); }
  return () => {
    listeners.delete(l);
    if (listeners.size === 0 && timer) { clearInterval(timer); timer = null; }
  };
};

/** Partidos en directo hoy (para el contador del nav y los puntos de la subnav). */
export function useLiveToday(): LiveToday {
  const data = useSyncExternalStore(subscribe, () => snapshot, () => EMPTY);
  useEffect(() => { if (snapshot === EMPTY) void load(); }, []);
  return data;
}
