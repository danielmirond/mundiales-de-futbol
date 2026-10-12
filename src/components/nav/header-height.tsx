'use client';

import { useEffect } from 'react';

/**
 * Publica la altura real de la cabecera fija en `--header-h` (html) para que
 * `main` compense el hueco: nav + tira móvil + subnav cambian de altura según
 * viewport y ruta. Ver regla `main { padding-top }` en globals.css.
 */
export function HeaderHeight({ target = 'site-header' }: { target?: string }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [target]);
  return null;
}
