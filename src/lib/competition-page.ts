import { notFound, redirect } from 'next/navigation';
import { getSport, getCompetition, type Competition, type Sport } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';

export const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Resuelve deporte y competición de la ruta; 404 si no existen, redirección si viven en otra sección. */
export function resolveCompetition(locale: string, deporte: string, competicion: string): { s: Sport; c: Competition } {
  const s = getSport(deporte);
  const c = getCompetition(deporte, competicion);
  if (!s || !c) notFound();
  if (c.href) redirect(withLocale(locale as Locale, c.href));
  return { s, c };
}
export const compBase = (c: Competition) => `/${c.sport}/${c.slug}`;
