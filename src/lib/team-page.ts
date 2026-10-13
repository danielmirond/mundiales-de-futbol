import { getSport, getCompetition, type Competition, type Sport } from '@/lib/competitions';
import { resolveTeam, type TeamRef } from '@/lib/espn-team';

export const POS_LABEL: Record<string, string> = { G: 'Porteros', D: 'Defensas', M: 'Centrocampistas', F: 'Delanteros', C: 'Pívots', 'G-F': 'Exteriores', 'F-C': 'Interiores', PG: 'Bases', SG: 'Escoltas', SF: 'Aleros', PF: 'Ala-pívots' };

export type TeamCtx = { s: Sport; c: Competition; ref: TeamRef };

/** Deporte, competición y equipo de la ruta `/[deporte]/[competicion]/equipo/[slug]`. */
export async function loadTeam(deporte: string, competicion: string, slug: string): Promise<TeamCtx | null> {
  const s = getSport(deporte);
  const c = getCompetition(deporte, competicion);
  if (!s || !c || !c.espn) return null;
  const ref = await resolveTeam(c, slug);
  if (!ref) return null;
  return { s, c, ref };
}
export const teamBase = (c: Competition, ref: TeamRef) => `/${c.sport}/${c.slug}/equipo/${ref.slug}`;
