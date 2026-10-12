'use client';

import { useEffect, useState } from 'react';

export type LiveToday = { live: number; total: number; liveSlugs: string[]; todaySlugs: string[] };
const EMPTY: LiveToday = { live: 0, total: 0, liveSlugs: [], todaySlugs: [] };
let cache: LiveToday | null = null;

/** Partidos en directo hoy (para el contador del nav y los puntos de la subnav). */
export function useLiveToday(): LiveToday {
  const [data, setData] = useState<LiveToday>(cache ?? EMPTY);
  useEffect(() => {
    let cancelled = false;
    const load = () => fetch('/api/live-today', { cache: 'no-store' }).then((r) => r.json()).then((j) => { if (!cancelled && j) { cache = j; setData(j); } }).catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return data;
}
