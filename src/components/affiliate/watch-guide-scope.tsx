'use client';

import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';

const stripLocale = (p: string) => p.replace(new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`), '') || '/';

/**
 * Muestra `children` salvo en las rutas que ya llevan la franja «Dónde ver»
 * arriba (portada de la competición y ficha de partido), para no duplicarla.
 */
export function WatchGuideScope({ root, children }: { root: string; children: React.ReactNode }) {
  const path = stripLocale(usePathname()).replace(/\/$/, '');
  if (path === root || path.startsWith(`${root}/partido/`)) return null;
  return <>{children}</>;
}
