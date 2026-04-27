'use client';

import dynamic from 'next/dynamic';
import type { SedeCity } from '@/lib/wc-2026-sedes';

/**
 * Wrapper client-side que carga el mapa Leaflet con `ssr: false`.
 * Necesario porque `dynamic` con `ssr: false` solo funciona dentro
 * de client components (no se permite en server components).
 */
const SedesMap = dynamic(
  () => import('@/components/sedes/sedes-map').then((m) => m.SedesMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[420px] w-full animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] md:h-[520px]"
        aria-label="Cargando mapa…"
      />
    ),
  },
);

export function SedesMapClient({ sedes }: { sedes: SedeCity[] }) {
  return <SedesMap sedes={sedes} />;
}
