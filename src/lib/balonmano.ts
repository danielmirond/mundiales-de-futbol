import data from '../data/balonmano.json';

/** Lectura de la copia diaria de Highlightly (scripts/balonmano/snapshot.ts). */
export type HbRow = { pos: number; team: string; logo?: string; pj: number; g: number; e: number; p: number; gf: number; gc: number; pts: number };
export type HbMatch = { id: number; date: string; week: string | null; home: string; away: string; state: string; score: [number, number] | null; half: [number, number] | null };
export type HbLeague = { season: number; groups: { name: string; rows: HbRow[] }[]; matches: HbMatch[] };

const D = data as unknown as { updatedAt: string; leagues: Record<string, HbLeague> };
export const hbLeague = (slug: string): HbLeague | undefined => D.leagues[slug];
