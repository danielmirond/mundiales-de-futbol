'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import type { SedeCity } from '@/lib/wc-2026-sedes';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Mapa interactivo Leaflet de las 16 sedes del Mundial 2026.
 *
 * Usa OpenStreetMap como proveedor de tiles (gratuito, sin API key).
 * Carga Leaflet dinámicamente para no inflar el bundle inicial.
 *
 * El componente es client-side (Leaflet manipula DOM directamente y
 * requiere `window`).
 */

// Bandera por país anfitrión, para colorear los markers.
const HOST_COLOR: Record<'USA' | 'MEX' | 'CAN', string> = {
  USA: '#0a5fd3',
  MEX: '#006341',
  CAN: '#ff3b3b',
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function SedesMap({ sedes }: { sedes: SedeCity[] }) {
  const locale = useLocale() as Locale;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cleanup = () => {};

    (async () => {
      const L = (await import('leaflet')).default;
      // CSS importado vía side-effect; lo añadimos como tag para evitar
      // conflicto con el bundler de Next y permitir tree-shaking en SSR.
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity =
          'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Vista inicial: norteamérica completa.
      const map = L.map(containerRef.current!, {
        center: [38.5, -98.0],
        zoom: 3,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        },
      ).addTo(map);

      // Añadir 16 markers con popup.
      for (const s of sedes) {
        const color = HOST_COLOR[s.countryCode];
        const icon = L.divIcon({
          className: 'sede-marker',
          html: `<span class="sede-marker-pin" style="background:${color}"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -8],
        });
        const marker = L.marker([s.coords[0], s.coords[1]], { icon }).addTo(
          map,
        );
        const url = withLocale(locale, `/2026/sedes/${s.citySlug}`);
        marker.bindPopup(
          `<div class="sede-popup">
            <div class="sede-popup-flag">${s.flag}</div>
            <strong>${s.cityName}</strong>
            <div class="sede-popup-stadium">${s.venueSlug.replace(/-/g, ' ')}</div>
            <a href="${url}" class="sede-popup-link">Guía de la sede →</a>
          </div>`,
        );
      }

      cleanup = () => map.remove();
    })();

    return () => cleanup();
  }, [sedes, locale]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] md:h-[520px]"
      role="application"
      aria-label="Mapa interactivo de las 16 sedes del Mundial 2026"
    />
  );
}
